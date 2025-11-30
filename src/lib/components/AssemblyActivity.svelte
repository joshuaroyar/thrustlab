<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as BABYLON from '@babylonjs/core';
	import '@babylonjs/loaders/glTF';
    import SkyBackground from '$lib/components/SkyBackground.svelte';

	let canvas: HTMLCanvasElement;
	let engine: BABYLON.Engine;
	let scene: BABYLON.Scene;
	let highlightLayer: BABYLON.HighlightLayer;
	let score = 0;
	let message = 'Drag and drop each component of the turbofan engine to its correct position inside the casing. Pay attention to the order and orientation — each part has its special place in the engine!';
	let placedComponents = new Set<string>();
	let totalComponents = 5;

	const components = [
		{ name: 'Intake Section', fileName: 'Intake Section (Gray).glb' },
		{ name: 'Compressor Section', fileName: 'Compression Section (Gray).glb' },
		{ name: 'Combustion Section', fileName: 'Combustion Section (Gray).glb' },
		{ name: 'Turbine Section', fileName: 'Turbine Section (Gray).glb' },
		{ name: 'Exhaust Section', fileName: 'Exhaust Section (Gray).glb' }
	];

	// Randomize initial positions for the "tray"
	let initialPositions: { [key: string]: BABYLON.Vector3 } = {};
    let componentMeshes: { [key: string]: BABYLON.AbstractMesh } = {};

	onMount(async () => {
		if (!canvas) return;

		engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
		scene = new BABYLON.Scene(engine);
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Transparent background
		
		highlightLayer = new BABYLON.HighlightLayer("hl1", scene);

		// Camera
		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			Math.PI / 2,
			Math.PI / 2.2, // Slightly from above
			12, // Zoomed out slightly to fit everything
			new BABYLON.Vector3(0, -1, 0), // Target slightly lower
			scene
		);
		camera.attachControl(canvas, true);
		camera.lowerRadiusLimit = 8;
		camera.upperRadiusLimit = 20;
		camera.wheelPrecision = 50;
        // Lock camera angles to keep the "side view" feel mostly
        camera.lowerBetaLimit = Math.PI / 3;
        camera.upperBetaLimit = Math.PI / 1.8;

		// Lighting
		new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
		const dirLight = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(-1, -2, -1), scene);
		dirLight.position = new BABYLON.Vector3(20, 40, 20);
        dirLight.intensity = 1.2;

		// Load Casing (Base)
		try {
			const casingResult = await BABYLON.SceneLoader.ImportMeshAsync(
				'',
				'/models/assembly-disassembly/',
				'Casing (Gray).glb',
				scene
			);
			
			casingResult.meshes.forEach((m) => {
				m.isPickable = false; // Casing is not draggable
                m.position.y = 1.5; // Move casing UP
			});
		} catch (e) {
			console.error('Error loading casing:', e);
		}

		// Load Components
        await loadComponents();

		engine.runRenderLoop(() => {
			scene.render();
		});

		window.addEventListener('resize', () => {
			engine.resize();
		});
	});

    async function loadComponents() {
        // We'll place them in a row at Y = -3.5 (closer to casing), spread along X
		const startX = -6;
		const spacing = 3;

		// Shuffle the components array for random placement order
		const shuffledComponents = [...components].sort(() => Math.random() - 0.5);

		for (let i = 0; i < shuffledComponents.length; i++) {
			const comp = shuffledComponents[i];
			try {
				const result = await BABYLON.SceneLoader.ImportMeshAsync(
					'',
					'/models/assembly-disassembly/',
					comp.fileName,
					scene
				);
				
				const rootMesh = result.meshes[0];
                componentMeshes[comp.name] = rootMesh;
				
				// Calculate initial position
				const posX = startX + i * spacing;
				const initialPos = new BABYLON.Vector3(posX, -3.5, 0); // Place below casing
				rootMesh.position = initialPos.clone();
				
				// Store initial pos for reset
				initialPositions[comp.name] = initialPos;

				// Add metadata
				rootMesh.metadata = { name: comp.name, isPlaced: false };

				// Add Drag Behavior
				const dragBehavior = new BABYLON.PointerDragBehavior({
					dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) // Drag on XY plane
				});
				
				dragBehavior.onDragStartObservable.add(() => {
					if (!rootMesh.metadata.isPlaced) {
						// Optional: visual feedback
					}
				});

				dragBehavior.onDragEndObservable.add((event) => {
                    if (rootMesh.metadata.isPlaced) return;

					const targetPos = new BABYLON.Vector3(0, 1.5, 0); // Target is now shifted up
					const currentPos = rootMesh.position;
					const distance = BABYLON.Vector3.Distance(currentPos, targetPos);

					// Threshold for snapping
					if (distance < 2.5) {
						handleCorrectPlacement(rootMesh, comp.name);
					} else {
						handleIncorrectPlacement(rootMesh, comp.name);
					}
				});

				rootMesh.addBehavior(dragBehavior);

			} catch (e) {
				console.error(`Error loading ${comp.name}:`, e);
			}
		}
    }

	function handleCorrectPlacement(mesh: BABYLON.AbstractMesh, name: string) {
		// Snap to correct position (relative to casing at y=1.5)
		mesh.position = new BABYLON.Vector3(0, 1.5, 0);
        
		// Highlight Green
		highlightMesh(mesh, new BABYLON.Color3(0, 1, 0));

		// Disable Drag
        const dragBehavior = mesh.getBehaviorByName("PointerDrag");
        if (dragBehavior) {
            mesh.removeBehavior(dragBehavior);
        }
        
        mesh.metadata.isPlaced = true;
        placedComponents.add(name);
        placedComponents = placedComponents; // Trigger reactivity
        
        // Update Score
        score += 10;
        // message = `Correct! ${name} placed.`;

        checkCompletion();
	}

	function handleIncorrectPlacement(mesh: BABYLON.AbstractMesh, name: string) {
		// Highlight Red temporarily
		highlightMesh(mesh, new BABYLON.Color3(1, 0, 0));
        
        setTimeout(() => {
             removeHighlight(mesh);
             // Return to start
             const initPos = initialPositions[name];
             if (initPos) {
                 const anim = BABYLON.Animation.CreateAndStartAnimation(
                     "returnAnim",
                     mesh,
                     "position",
                     30,
                     30,
                     mesh.position.clone(),
                     initPos.clone(),
                     BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                 );
             }
        }, 500);

        // score -= 5;
        // message = `Incorrect placement for ${name}. Try again.`;
	}

    function highlightMesh(mesh: BABYLON.AbstractMesh, color: BABYLON.Color3) {
        mesh.getChildMeshes().forEach(m => {
            if (m instanceof BABYLON.Mesh) {
                highlightLayer.addMesh(m, color);
            }
        });
    }

    function removeHighlight(mesh: BABYLON.AbstractMesh) {
         mesh.getChildMeshes().forEach(m => {
            if (m instanceof BABYLON.Mesh) {
                highlightLayer.removeMesh(m);
            }
        });
    }

	function checkCompletion() {
		if (placedComponents.size === totalComponents) {
			message = `Congratulations! You completed the assembly!`;
		}
	}
	
	function shuffleComponents() {
        // Reset all unplaced components
        const unplaced = components.filter(c => !placedComponents.has(c.name));
        const shuffled = [...unplaced].sort(() => Math.random() - 0.5);
        
        const startX = -6;
		const spacing = 3;
        
        // Recalculate positions for unplaced items
        // We might need to clear existing meshes and reload or just move them?
        // Moving them is better.
        
        let index = 0;
        // We need to find the meshes for these components
        // But wait, the meshes are already in the scene.
        // Let's just re-assign positions to the meshes that are NOT placed.
        
        // Get all unplaced meshes
        const meshesToMove: BABYLON.AbstractMesh[] = [];
        scene.meshes.forEach(m => {
            if (m.metadata && m.metadata.name && !m.metadata.isPlaced && m.parent === null) {
                 // This is a root mesh of a component
                 meshesToMove.push(m);
            }
        });
        
        // Shuffle the meshes array
        meshesToMove.sort(() => Math.random() - 0.5);
        
        meshesToMove.forEach((mesh, i) => {
             const posX = startX + i * spacing;
             const newPos = new BABYLON.Vector3(posX, -3.5, 0);
             
             // Animate to new pos
             BABYLON.Animation.CreateAndStartAnimation(
                 "shuffleAnim",
                 mesh,
                 "position",
                 30,
                 30,
                 mesh.position.clone(),
                 newPos,
                 BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
             );
             
             // Update initial pos reference
             if (mesh.metadata && mesh.metadata.name) {
                 initialPositions[mesh.metadata.name] = newPos;
             }
        });
	}

	onDestroy(() => {
		if (engine) {
			engine.dispose();
		}
	});
</script>

<div class="activity-wrapper">
    <!-- Sky Background -->
    <SkyBackground day={true} />

    <!-- Header Section -->
    <div class="header-section">
        <!-- Speech Bubble Box -->
        <div class="speech-bubble">
            <p class="speech-text">
                <span class="speech-label">JAJA:</span> Yey! You've mastered the fundamentals of the turbofan engine!
                Now it's time to put that knowledge into action.
            </p>
        </div>
        
        <!-- Character Image -->
        <div class="character-container">
            <img src="/images/jaja-standing.png" alt="Jaja Character" class="character-image" />
        </div>
    </div>

    <!-- Main Activity Card -->
    <div class="activity-card">
        
        <!-- Title -->
        <h1 class="activity-title">
            Assembly and Disassembly <br/> Activity
        </h1>

        <!-- Instructions -->
        <p class="activity-instructions">
            <span class="instruction-label">Instruction:</span> {message}
        </p>

        <!-- 3D Canvas Area -->
        <div class="canvas-container">
            <canvas bind:this={canvas} class="babylon-canvas"></canvas>
        </div>

        <!-- Shuffle Button -->
        <button 
            onclick={shuffleComponents}
            class="shuffle-button"
        >
            SHUFFLE
        </button>
    </div>
</div>

<style>
    /* Wrapper */
    .activity-wrapper {
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Header Section */
    .header-section {
        position: relative;
        max-width: 64rem; /* max-w-5xl */
        width: 100%;
        margin: 2rem auto;
        display: flex;
        justify-content: flex-end;
    }

    /* Speech Bubble */
    .speech-bubble {
        background: rgba(10, 47, 53, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--ui-yellow);
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 10;
        margin-right: 8rem; /* Space for character */
        max-width: 600px;
    }

    .speech-text {
        font-family: var(--font-body);
        font-size: 1.125rem; /* text-lg */
        color: var(--font-secondary);
        font-weight: 500;
        line-height: 1.6;
    }

    .speech-label {
        font-family: var(--font-heading);
        font-weight: 800;
        color: var(--ui-yellow);
    }

    /* Character */
    .character-container {
        position: absolute;
        right: -1rem;
        top: -1rem;
        z-index: 20;
        width: 10rem; /* w-40 */
        height: 12rem; /* h-48 */
    }

    .character-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
    }

    /* Main Activity Card */
    .activity-card {
        width: 100%;
        max-width: 72rem; /* max-w-6xl */
        background: rgba(10, 47, 53, 0.6);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-radius: 2rem;
        padding: 2rem;
        border: 2px solid rgba(135, 206, 235, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 0;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Title */
    .activity-title {
        font-family: var(--font-heading);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 900;
        text-align: center;
        margin-bottom: 1.5rem;
        background: linear-gradient(
            90deg,
            var(--ui-yellow) 0%,
            var(--font-accent-cyan) 20%,
            var(--ui-light-blue) 40%,
            var(--font-accent-yellow) 60%,
            var(--ui-yellow) 80%,
            var(--font-accent-cyan) 100%
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-flash 4s ease-in-out infinite;
        filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5));
    }

    @keyframes gradient-flash {
		0%, 100% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 50% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		75% {
			background-position: 50% 50%;
		}
	}

    /* Instructions */
    .activity-instructions {
        text-align: center;
        color: var(--font-secondary);
        max-width: 56rem; /* max-w-4xl */
        margin-bottom: 1rem;
        font-size: 1.125rem; /* text-lg */
        line-height: 1.625;
        font-family: var(--font-body);
    }

    .instruction-label {
        font-weight: 700;
        color: var(--font-accent-yellow);
    }

    /* Canvas Area */
    .canvas-container {
        position: relative;
        width: 100%;
        flex-grow: 1;
        min-height: 500px;
        border-radius: 1rem;
        overflow: hidden;
        /* Optional: Add a subtle inner border/glow */
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
    }

    .babylon-canvas {
        width: 100%;
        height: 100%;
        touch-action: none;
        outline: none;
    }

    /* Shuffle Button */
    .shuffle-button {
        margin-top: 1.5rem;
        background: linear-gradient(135deg, var(--ui-yellow) 0%, var(--font-accent-yellow) 100%);
        color: #0f172a; /* Dark slate for contrast against yellow */
        font-family: var(--font-heading);
        font-weight: 800;
        font-size: 1.1rem;
        padding: 0.75rem 3rem;
        border-radius: 9999px;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .shuffle-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
        filter: brightness(1.1);
    }

    .shuffle-button:active {
        transform: translateY(0);
        filter: brightness(0.95);
    }
</style>
