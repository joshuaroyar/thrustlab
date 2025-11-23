<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { 
		Engine, 
		Scene, 
		ArcRotateCamera, 
		Vector3, 
		HemisphericLight, 
		SceneLoader, 
		Color4,
		HighlightLayer,
		PointerEventTypes,
		Color3,
		AbstractMesh,
		Mesh

	} from '@babylonjs/core';
	import '@babylonjs/loaders';

	interface ModelViewerProps {
		modelPath: string;
		canvasClass?: string;
		cameraPosition?: { alpha: number; beta: number; radius: number };
		enableHighlight?: boolean;
		partDescriptions?: Record<string, { name: string; description: string }>;
		onModelLoaded?: () => void;
	}

	let {
		modelPath,
		canvasClass = 'model-canvas',
		cameraPosition = { alpha: Math.PI / 2, beta: Math.PI / 3, radius: 5 },
		enableHighlight = true,
		partDescriptions = {},
		onModelLoaded
	}: ModelViewerProps = $props();

	let canvas: HTMLCanvasElement;
	let engine: Engine | null = null;
	let scene: Scene | null = null;
	let selectedMesh: AbstractMesh | null = null;
	let highlightedMesh: AbstractMesh | null = null;
	let highlightLayer: HighlightLayer | null = null;

	// Tooltip state
	let tooltipVisible = $state(false);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipContent = $state({ name: '', description: '' });

	onMount(() => {
		if (!canvas) return;

		// 1. Initialize Engine
		engine = new Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true
		});
		
		// 2. Create Scene
		scene = new Scene(engine);
		scene.clearColor = new Color4(0, 0, 0, 0); 

		// Create a temporary camera/light
		const tempCamera = new ArcRotateCamera("tempCam", 0, 0, 10, Vector3.Zero(), scene);
		tempCamera.attachControl(canvas, true);
		new HemisphericLight("tempLight", new Vector3(0, 1, 0), scene);

		// 3. Load the Model
		SceneLoader.Append("", modelPath, scene, (loadedScene) => {
			
			// 4. Post-Load Setup (The "Magic Helper")
			loadedScene.createDefaultCameraOrLight(true, true, true);
			
			// Re-attach controls to the new camera
			const activeCam = loadedScene.activeCamera as ArcRotateCamera;
			if (activeCam) {
				// Explicitly attach controls to ensure events are captured
				activeCam.attachControl(canvas, true);

				// Enable framing behavior for auto-sizing
				activeCam.useFramingBehavior = true;
				
				// Adjust sensitivity (Lower values = faster for precision)
				// Default is usually around 3 for wheel, 12 for pinch.
				activeCam.wheelPrecision = 3;
				activeCam.pinchPrecision = 12;
				activeCam.panningSensibility = 1000;
				
				// Add WASD controls
				// Clear existing keys first to avoid conflicts
				activeCam.keysUp = [];
				activeCam.keysDown = [];
				activeCam.keysLeft = [];
				activeCam.keysRight = [];
				
				activeCam.keysUp.push(87);    // W
				activeCam.keysDown.push(83);  // S
				activeCam.keysLeft.push(65);  // A
				activeCam.keysRight.push(68); // D

				// Apply custom camera position if provided, but respect auto-radius if it seems too small
				if (cameraPosition) {
					activeCam.alpha = cameraPosition.alpha;
					activeCam.beta = cameraPosition.beta;
					// Only override radius if it's explicitly set to something other than default, 
					// or if we want to force it. But for "too zoomed in" issues, 
					// it's better to let the framing behavior handle the distance initially.
					// activeCam.radius = cameraPosition.radius; 
				}
			}

			// Add environment
			loadedScene.createDefaultEnvironment({
				createGround: false,
				createSkybox: false, 
			});

			// Setup highlighting
			if (enableHighlight) {
				setupHighlighting(loadedScene);
			}

			if (onModelLoaded) {
				onModelLoaded();
			}
		});

		// 5. Start Render Loop
		engine.runRenderLoop(() => {
			scene?.render();
		});

		// 6. Handle Window Resize
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
		engine?.dispose();
	});

	const handleResize = () => {
		engine?.resize();
	};

	function setupHighlighting(scene: Scene) {
		highlightLayer = new HighlightLayer('highlightLayer', scene);
		highlightLayer.blurHorizontalSize = 0.5;
		highlightLayer.blurVerticalSize = 0.5;

		scene.onPointerObservable.add((pointerInfo) => {
			// Handle hover for highlighting only
			if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
				const pickResult = scene.pick(scene.pointerX, scene.pointerY);
				
				if (pickResult.hit && pickResult.pickedMesh) {
					const mesh = pickResult.pickedMesh;
					
					if (mesh.name && partDescriptions[mesh.name]) {
						// Only update highlight if it's different from selected mesh
						if (highlightedMesh !== mesh && selectedMesh !== mesh) {
							if (highlightedMesh && highlightedMesh !== selectedMesh) {
								highlightLayer?.removeMesh(highlightedMesh as Mesh);
							}
							highlightLayer?.addMesh(mesh as Mesh, new Color3(0, 1, 1));
							highlightedMesh = mesh;
						}
					} else {
						// Remove highlight if not hovering over a valid part and not selected
						if (highlightedMesh && highlightedMesh !== selectedMesh) {
							highlightLayer?.removeMesh(highlightedMesh as Mesh);
							highlightedMesh = null;
						}
					}
				} else {
					// Remove highlight if not hovering over anything and not selected
					if (highlightedMesh && highlightedMesh !== selectedMesh) {
						highlightLayer?.removeMesh(highlightedMesh as Mesh);
						highlightedMesh = null;
					}
				}
			}
			
			// Handle click for selection
			else if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
				const pickResult = scene.pick(scene.pointerX, scene.pointerY);
				
				if (pickResult.hit && pickResult.pickedMesh) {
					const mesh = pickResult.pickedMesh;
					
					if (mesh.name && partDescriptions[mesh.name]) {
						// Deselect previous
						if (selectedMesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
						}
						
						// Select new
						selectedMesh = mesh;
						highlightLayer?.addMesh(selectedMesh as Mesh, Color3.Teal()); // Different color for selection
						
						// Show tooltip
						tooltipContent = partDescriptions[mesh.name];
						tooltipX = scene.pointerX;
						tooltipY = scene.pointerY;
						tooltipVisible = true;
					} else {
						// Clicked on non-interactive part
						if (selectedMesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
							selectedMesh = null;
						}
						tooltipVisible = false;
					}
				} else {
					// Clicked on background
					if (selectedMesh) {
						highlightLayer?.removeMesh(selectedMesh as Mesh);
						selectedMesh = null;
					}
					tooltipVisible = false;
				}
			}
		});
	}
</script>

<div class="model-viewer-container">
	<canvas bind:this={canvas} class={canvasClass} tabindex="0"></canvas>
	
	{#if tooltipVisible}
		<div 
			class="model-tooltip" 
			style="left: {tooltipX}px; top: {tooltipY}px;"
		>
			<h4>{tooltipContent.name}</h4>
			<p>{tooltipContent.description}</p>
		</div>
	{/if}

	<div class="controls-info">
		<div class="control-item">
			<strong>Mouse:</strong> Left-click + drag to rotate
		</div>
		<div class="control-item">
			<strong>Zoom:</strong> Scroll wheel or pinch
		</div>
		<div class="control-item">
			<strong>Pan:</strong> Right-click + drag or middle mouse
		</div>
		<div class="control-item">
			<strong>Keys:</strong> W/A/S/D to rotate
		</div>
	</div>
</div>

<style>
	.model-viewer-container {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
		outline: none;
		touch-action: none; 
	}

	.model-tooltip {
		position: fixed;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		padding: 12px 16px;
		border-radius: 8px;
		pointer-events: none;
		z-index: 1000;
		max-width: 300px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		transform: translate(15px, 15px); /* Offset from cursor */
	}

	.model-tooltip h4 {
		margin: 0 0 8px 0;
		font-size: 16px;
		font-weight: 600;
		color: #00d4ff;
	}

	.model-tooltip p {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.9);
	}

	.controls-info {
		position: absolute;
		bottom: 20px;
		left: 20px;
		background: rgba(0, 0, 0, 0.7);
		padding: 16px;
		border-radius: 8px;
		color: white;
		font-size: 13px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		pointer-events: none;
	}

	.control-item {
		margin-bottom: 6px;
	}

	.control-item:last-child {
		margin-bottom: 0;
	}

	.control-item strong {
		color: #00d4ff;
		margin-right: 4px;
	}

	@media (max-width: 768px) {
		.controls-info {
			font-size: 11px;
			padding: 12px;
			bottom: 10px;
			left: 10px;
		}
	}
</style>