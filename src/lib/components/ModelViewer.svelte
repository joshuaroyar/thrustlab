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
	let observer: IntersectionObserver | null = null;
	let isVisible = false;
	let hasLoaded = $state(false);
	let isLoading = $state(false);

	// Tooltip state
	let tooltipVisible = $state(false);
	let tooltipContent = $state({ name: '', description: '' });

	const sanitizeValue = (value?: string | null) =>
		(value || '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, ' ')
			.trim()
			.replace(/\s+/g, ' ');

	const buildSearchable = (value?: string | null) => {
		const sanitized = sanitizeValue(value);
		return sanitized ? ` ${sanitized} ` : '';
	};

	// Helper to find description by mesh name or material name
	function findPartDescription(mesh: AbstractMesh) {
		if (!partDescriptions) return null;

		// Log mesh names for debugging
		console.log('Clicked mesh:', {
			name: mesh.name,
			material: mesh.material?.name,
			id: mesh.id,
			parent: mesh.parent?.name
		});

		const meshNameLower = mesh.name.toLowerCase();
		const materialNameLower = mesh.material?.name?.toLowerCase() || '';
		const meshIdLower = mesh.id?.toLowerCase() || '';
		const meshNameSearch = buildSearchable(mesh.name);
		const materialNameSearch = buildSearchable(mesh.material?.name);
		const meshIdSearch = buildSearchable(mesh.id);
		
		let bestMatchKey = null;
		let bestMatchLength = -1;

		for (const key in partDescriptions) {
			const keyLower = key.toLowerCase();
			const keySearch = buildSearchable(key);
			const keySearchLen = keySearch.trim().length;

			// 1. Check Mesh Name (exact match first)
			if (meshNameLower === keyLower) {
				console.log('Exact mesh name match:', key);
				return partDescriptions[key];
			}

			// 2. Check Material Name (exact match)
			if (materialNameLower === keyLower) {
				console.log('Exact material name match:', key);
				return partDescriptions[key];
			}

			// 3. Check Mesh ID (exact match)
			if (meshIdLower === keyLower) {
				console.log('Exact mesh ID match:', key);
				return partDescriptions[key];
			}

			// 4. Check partial matches in mesh name
			if (
				keySearch &&
				((meshNameSearch && meshNameSearch.includes(keySearch)) ||
					(materialNameSearch && materialNameSearch.includes(keySearch)) ||
					(meshIdSearch && meshIdSearch.includes(keySearch)))
			) {
				if (keySearchLen > bestMatchLength) {
					bestMatchLength = keySearchLen;
					bestMatchKey = key;
				}
			}
		}

		if (bestMatchKey) {
			console.log('Best partial match found:', bestMatchKey);
			return partDescriptions[bestMatchKey];
		}

		console.log('No match found for mesh');
		return null;
	}

	onMount(() => {
		if (!canvas) return;

		// 1. Initialize Engine
		// optimize: disable preserveDrawingBuffer for performance unless needed for screenshots
		engine = new Engine(canvas, true, {
			preserveDrawingBuffer: false,
			stencil: true,
			limitDeviceRatio: 1.0 // Limit to 1.0 to avoid high-DPI rendering performance hits on mobile
		});

		// optimize: Ensure we aren't rendering at native retina resolution on mobile
		// 1.0 = 1:1 match with CSS pixels. Higher values = lower resolution (better performance)
		engine.setHardwareScalingLevel(1);

		// 2. Create Scene
		scene = new Scene(engine);
		scene.clearColor = new Color4(0, 0, 0, 0);

		// Create a temporary camera/light
		const tempCamera = new ArcRotateCamera('tempCam', 0, 0, 10, Vector3.Zero(), scene);
		tempCamera.attachControl(canvas, true);
		new HemisphericLight('tempLight', new Vector3(0, 1, 0), scene);

		// 3. Setup Intersection Observer for Performance & Lazy Loading
		// Only render when the canvas is actually visible in the viewport
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					isVisible = entry.isIntersecting;
				});
			},
			{ threshold: 0 }
		);

		observer.observe(canvas as unknown as HTMLElement);

		// 4. Start Render Loop (Optimized)
		engine.runRenderLoop(() => {
			if (scene && isVisible) {
				scene.render();
			}
		});

		// 5. Handle Window Resize
		window.addEventListener('resize', handleResize);
	});

	function loadModel() {
		if (!scene) return;

		isLoading = true;

		SceneLoader.Append(
			'',
			modelPath,
			scene,
			(loadedScene) => {
				hasLoaded = true;
				isLoading = false;

				// Log all meshes for debugging
				console.log('=== LOADED MODEL MESHES ===');
				loadedScene.meshes.forEach((mesh, index) => {
					console.log(`Mesh ${index}:`, {
						name: mesh.name,
						id: mesh.id,
						material: mesh.material?.name,
						parent: mesh.parent?.name
					});
				});
				console.log('=== END MESHES ===');

				// Post-Load Setup (The "Magic Helper")
				loadedScene.createDefaultCameraOrLight(true, true, true);

				// Re-attach controls to the new camera
				const activeCam = loadedScene.activeCamera as ArcRotateCamera;
				if (activeCam) {
					// Explicitly attach controls to ensure events are captured
					activeCam.attachControl(canvas, true);

					// Enable framing behavior for auto-sizing
					activeCam.useFramingBehavior = true;

					// --- Smoothness with Control (Low Inertia) ---
					// Reducing inertia significantly to prevent excessive spinning
					// Lower inertia = stops faster when you release the mouse
					activeCam.inertia = 0.85;

					// --- Industry Standard Sensitivity ---
					
					// Rotate Speed: Fast & Even across all angles
					// Lower value = Faster rotation.
					// Setting both X and Y to same value (400) for consistent speed everywhere
					activeCam.angularSensibilityX = 400;
					activeCam.angularSensibilityY = 400;

					// Zoom Speed: 1.2 (Faster than default)
					// Babylon default wheelPrecision is 3. Lower = Faster.
					activeCam.wheelPrecision = 2.5;
					activeCam.pinchPrecision = 10; // Adjusted for touch as well

					// Pan Speed: 0.5 (Slower than default)
					// Babylon default panningSensibility is 1000. Higher = Slower.
					activeCam.panningSensibility = 2000;

					// --- 360-Degree Orbit ---
					// Allow full horizontal rotation (Alpha)
					activeCam.lowerAlphaLimit = null;
					activeCam.upperAlphaLimit = null;

					// Restrict vertical rotation (Beta) to prevent gimbal lock/flipping at poles
					// This prevents the disorienting "fast flip" when going over the top/bottom
					activeCam.lowerBetaLimit = 0.1; // ~5.7 degrees from top
					activeCam.upperBetaLimit = Math.PI - 0.1; // ~5.7 degrees from bottom

					// Prevent auto-rotation compensation that can cause speed inconsistencies
					activeCam.checkCollisions = false;

					// Add WASD controls
					// Clear existing keys first to avoid conflicts
					activeCam.keysUp = [];
					activeCam.keysDown = [];
					activeCam.keysLeft = [];
					activeCam.keysRight = [];

					activeCam.keysUp.push(87); // W
					activeCam.keysDown.push(83); // S
					activeCam.keysLeft.push(65); // A
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
					createSkybox: false
				});

				// Setup highlighting
				if (enableHighlight) {
					setupHighlighting(loadedScene);
				}

				if (onModelLoaded) {
					onModelLoaded();
				}
			},
			// Progress callback
			undefined,
			// Error callback
			(scene, message, exception) => {
				console.error('Error loading model:', message, exception);
				isLoading = false;
			}
		);
	}

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
		if (observer) {
			observer.disconnect();
		}
		engine?.dispose();
	});

	const handleResize = () => {
		engine?.resize();
	};

	function setupHighlighting(scene: Scene) {
		highlightLayer = new HighlightLayer('highlightLayer', scene);
		highlightLayer.blurHorizontalSize = 0.8;
		highlightLayer.blurVerticalSize = 0.8;

		scene.onPointerObservable.add((pointerInfo) => {
			// Handle hover for highlighting only
			if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
				const pickResult = scene.pick(scene.pointerX, scene.pointerY);

				if (pickResult.hit && pickResult.pickedMesh) {
					const mesh = pickResult.pickedMesh;
					const description = findPartDescription(mesh);

					if (description) {
						// Only update highlight if it's different from selected mesh
						if (highlightedMesh !== mesh && selectedMesh !== mesh) {
							if (highlightedMesh && highlightedMesh !== selectedMesh) {
								highlightLayer?.removeMesh(highlightedMesh as Mesh);
							}
							// Use cyan for hover
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
					const description = findPartDescription(mesh);

					if (description) {
						// Deselect previous
						if (selectedMesh && selectedMesh !== mesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
						}

						// If clicking the same mesh, deselect it
						if (selectedMesh === mesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
							selectedMesh = null;
							tooltipVisible = false;
						} else {
							// Select new mesh
							selectedMesh = mesh;
							// Use yellow/gold for selected mesh
							highlightLayer?.addMesh(selectedMesh as Mesh, new Color3(1, 0.84, 0));

							// Show tooltip above the model
							tooltipContent = description;
							tooltipVisible = true;
						}

						// Remove hover highlight if it exists
						if (highlightedMesh) {
							highlightLayer?.removeMesh(highlightedMesh as Mesh);
							highlightedMesh = null;
						}
					} else {
						// Clicked on non-interactive part - deselect
						if (selectedMesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
							selectedMesh = null;
						}
						tooltipVisible = false;
					}
				} else {
					// Clicked on background - deselect
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

	{#if !hasLoaded && !isLoading}
		<button class="load-overlay" onclick={loadModel} aria-label="Load 3D Model">
			<div class="spinner-static"></div>
			<p>Click to Load 3D Model</p>
		</button>
	{/if}

	{#if isLoading}
		<div class="loading-overlay">
			<div class="spinner"></div>
			<p>Loading 3D Model...</p>
		</div>
	{/if}

	{#if tooltipVisible}
		<div class="model-tooltip fixed-top">
			<button class="tooltip-close" onclick={() => { tooltipVisible = false; if (selectedMesh) { highlightLayer?.removeMesh(selectedMesh as Mesh); selectedMesh = null; } }} aria-label="Close tooltip">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
			<h4>{tooltipContent.name}</h4>
			<p>{tooltipContent.description}</p>
		</div>
	{/if}

	<div class="controls-info">
		<div class="control-item highlight">
			<strong>Click</strong> on any colored component to learn more
		</div>
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
		position: absolute;
		background: rgba(10, 25, 47, 0.95);
		color: white;
		padding: 20px 24px;
		border-radius: 12px;
		pointer-events: auto;
		z-index: 1000;
		max-width: 300px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(0, 212, 255, 0.3);
		border: 2px solid rgba(0, 212, 255, 0.5);
		backdrop-filter: blur(10px);
		animation: tooltipSlideIn 0.3s ease-out;
	}

	@keyframes tooltipSlideIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.model-tooltip.fixed-top {
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		width: 85%;
		max-width: 500px;
	}

	.tooltip-close {
		position: absolute;
		top: 10px;
		right: 10px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: rgba(255, 255, 255, 0.7);
		padding: 0;
	}

	.tooltip-close:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.4);
		color: white;
		transform: scale(1.1);
	}

	.model-tooltip h4 {
		margin: 0 0 12px 0;
		font-size: 18px;
		font-weight: 700;
		color: #00d4ff;
		text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
		letter-spacing: 0.5px;
	}

	.model-tooltip p {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.95);
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

	.control-item.highlight {
		background: rgba(0, 212, 255, 0.15);
		padding: 8px 10px;
		border-radius: 6px;
		border-left: 3px solid #00d4ff;
		margin-bottom: 10px;
		font-weight: 600;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			box-shadow: 0 0 5px rgba(0, 212, 255, 0.3);
		}
		50% {
			box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
		}
	}

	.loading-overlay,
	.load-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		z-index: 10;
		backdrop-filter: blur(5px);
		border: none;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.load-overlay:hover {
		background: rgba(0, 0, 0, 0.5);
	}

	.load-overlay p {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 1rem;
		color: #00d4ff;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-top: 4px solid #00d4ff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 12px;
	}

	.spinner-static {
		width: 60px;
		height: 60px;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-top: 4px solid #00d4ff;
		border-radius: 50%;
		margin-bottom: 12px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
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
