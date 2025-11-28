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
	let hasLoaded = false;
	let isLoading = $state(false);

	// Tooltip state
	let tooltipVisible = $state(false);
	let tooltipContent = $state({ name: '', description: '' });

	// Helper to find description by mesh name or material name
	function findPartDescription(mesh: AbstractMesh) {
		if (!partDescriptions) return null;

		// 1. Exact match
		if (partDescriptions[mesh.name]) return partDescriptions[mesh.name];

		// 2. Partial match (keys in partDescriptions are substrings of mesh.name)
		for (const key in partDescriptions) {
			if (mesh.name.toLowerCase().includes(key.toLowerCase())) {
				return partDescriptions[key];
			}
		}

		// 3. Material name match
		if (mesh.material && mesh.material.name) {
			for (const key in partDescriptions) {
				if (mesh.material.name.toLowerCase().includes(key.toLowerCase())) {
					return partDescriptions[key];
				}
			}
		}

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
		// And only load the model when it first comes into view
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					isVisible = entry.isIntersecting;

					if (isVisible && !hasLoaded && !isLoading) {
						loadModel();
					}
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

				// Post-Load Setup (The "Magic Helper")
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
		highlightLayer.blurHorizontalSize = 0.5;
		highlightLayer.blurVerticalSize = 0.5;

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
						if (selectedMesh) {
							highlightLayer?.removeMesh(selectedMesh as Mesh);
						}

						// Select new
						selectedMesh = mesh;
						highlightLayer?.addMesh(selectedMesh as Mesh, Color3.Teal()); // Different color for selection

						// Show tooltip
						tooltipContent = description;
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

	{#if isLoading}
		<div class="loading-overlay">
			<div class="spinner"></div>
			<p>Loading 3D Model...</p>
		</div>
	{/if}

	{#if tooltipVisible}
		<div class="model-tooltip fixed-top">
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
		position: absolute;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		padding: 12px 16px;
		border-radius: 8px;
		pointer-events: none;
		z-index: 1000;
		max-width: 300px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.model-tooltip.fixed-top {
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		width: 80%;
		max-width: 400px;
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

	.loading-overlay {
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
