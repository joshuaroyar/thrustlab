<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { saveActivityScore, getActivityScores } from '$lib/utils/activityScore';
	
	let Engine: any, Scene: any, ArcRotateCamera: any, Vector3: any;
	let HemisphericLight: any, SceneLoader: any, Color4: any, Color3: any;
	let AbstractMesh: any, MeshBuilder: any, GizmoManager: any;
	let PointerEventTypes: any, UtilityLayerRenderer: any, PointerDragBehavior: any;

	interface Component {
		id: string;
		name: string;
		modelPath: string;
		correctOrder: number;
	}

	const COMPONENTS: Component[] = [
		{
			id: 'intake',
			name: 'Intake Section',
			modelPath: '/models/assembly-disassembly/Intake Section (Gray).glb',
			correctOrder: 0
		},
		{
			id: 'compression',
			name: 'Compression Section',
			modelPath: '/models/assembly-disassembly/Compression Section (Gray).glb',
			correctOrder: 1
		},
		{
			id: 'combustion',
			name: 'Combustion Section',
			modelPath: '/models/assembly-disassembly/Combustion Section (Gray).glb',
			correctOrder: 2
		},
		{
			id: 'turbine',
			name: 'Turbine Section',
			modelPath: '/models/assembly-disassembly/Turbine Section (Gray).glb',
			correctOrder: 3
		},
		{
			id: 'exhaust',
			name: 'Exhaust Section',
			modelPath: '/models/assembly-disassembly/Exhaust Section (Gray).glb',
			correctOrder: 4
		}
	];

	let shuffledComponents = $state<Component[]>([]);

	function shuffleInPlace<T>(arr: T[]) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	// Correct sequence (aligns with component ids)
	const SEQUENCE = ['intake', 'compression', 'combustion', 'turbine', 'exhaust'];
	const trayPositions = new Map<string, any>();
	// Tracks all placed meshes (used for camera framing + deletion)
	const placedMap = new Map<string, any>();
	// Tracks the current left-to-right order (derived from X positions)
	let placedOrder: string[] = [];
	// Store reference scales from full turbofan model for perfect fit
	const referenceScales = new Map<string, {scale: any, bounds: any, position?: any}>();

	const CASING_PADDING_X = 0.3; // Padding to prevent components from extending outside
	const PUSH_AWAY_Z = 2.5;

	let canvas: HTMLCanvasElement;
	let engine: any = null;
	let scene: any = null;
	let camera: any = null;
	let gizmoManager: any = null;
	let ground: any = null;
	let casingMesh: any = null;
	let placedMeshes: any[] = [];
	let componentPreviews = new Map<string, HTMLCanvasElement>();
	let previewScenes = new Map<string, { engine: any; scene: any }>();
	let score = $state(0);
	let selectedMeshName = $state<string | null>(null);
	let showInstructions = $state(true);
	let highScore = $state(0);
	let isSavingScore = $state(false);
	let saveMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	// Precompute tray positions so pieces can be sent back when dropped incorrectly
	function initTrayPositions() {
		if (trayPositions.size > 0) return;
		const startX = -18;
		const gap = 6;
		SEQUENCE.forEach((id, idx) => {
			trayPositions.set(id, new Vector3(startX + gap * idx, 0, -12));
		});
	}

	function getMeshBounds(mesh: any) {
		return mesh.getHierarchyBoundingVectors();
	}

	function boundsIntersect(aMin: any, aMax: any, bMin: any, bMax: any) {
		return (
			aMin.x <= bMax.x && aMax.x >= bMin.x &&
			aMin.y <= bMax.y && aMax.y >= bMin.y &&
			aMin.z <= bMax.z && aMax.z >= bMin.z
		);
	}

	function rememberLastValid(mesh: any) {
		mesh.metadata = mesh.metadata || {};
		mesh.metadata.lastValidPos = mesh.position.clone();
		mesh.metadata.snapped = true;
	}

	function restoreLastValidOrTray(mesh: any) {
		const lastValid = mesh.metadata?.lastValidPos;
		if (lastValid) {
			mesh.position.copyFrom(lastValid);
			return;
		}
		returnToTray(mesh);
	}

	// Helper to find root mesh
	function findRootMesh(mesh: any): any {
		let parent = mesh;
		while (parent.parent && parent.parent.getClassName() !== 'Scene') {
			parent = parent.parent;
		}
		return parent;
	}

	// Keep stable handlers for Svelte reactivity; assign impls inside onMount.
	let onCanvasDragOverImpl: ((e: DragEvent) => void) | null = null;
	let onCanvasDropImpl: ((e: DragEvent) => Promise<void>) | null = null;

	function onCanvasDragOver(e: DragEvent) {
		e.preventDefault();
		onCanvasDragOverImpl?.(e);
	}

	async function onCanvasDrop(e: DragEvent) {
		e.preventDefault();
		await onCanvasDropImpl?.(e);
	}
	let handleDragEnd = (mesh: any, skipSnapping?: boolean) => {
		// assigned inside onMount
	};

	// Create preview for component
	async function createComponentPreview(component: Component, previewCanvas: HTMLCanvasElement) {
		if (!browser) return;

		const babylon = await import('@babylonjs/core');
		await import('@babylonjs/loaders');

		const previewEngine = new babylon.Engine(previewCanvas, true, {
			preserveDrawingBuffer: true,
			stencil: true
		});

		const previewScene = new babylon.Scene(previewEngine);
		previewScene.clearColor = new babylon.Color4(0.05, 0.05, 0.05, 1);

		const camera = new babylon.ArcRotateCamera(
			'previewCamera',
			-Math.PI / 4,
			Math.PI / 3,
			3,
			babylon.Vector3.Zero(),
			previewScene
		);

		const light = new babylon.HemisphericLight('previewLight', new babylon.Vector3(1, 1, 0), previewScene);
		light.intensity = 1.2;

		try {
			const result = await babylon.SceneLoader.ImportMeshAsync("", component.modelPath, "", previewScene);
			
			if (result.meshes.length > 0) {
				const rootMesh = result.meshes[0];
				const bounds = rootMesh.getHierarchyBoundingVectors();
				const center = bounds.max.add(bounds.min).scale(0.5);
				const size = bounds.max.subtract(bounds.min);
				const maxDim = Math.max(size.x, size.y, size.z);
				
				camera.target = center;
				camera.radius = maxDim * 2;
				
				// Auto-rotate
				previewScene.registerBeforeRender(() => {
					rootMesh.rotation.y += 0.01;
				});
			}
		} catch (error) {
			console.error('Error loading preview:', error);
		}

		previewEngine.runRenderLoop(() => {
			previewScene.render();
		});

		previewScenes.set(component.id, { engine: previewEngine, scene: previewScene });
	}

	function resetScene() {
		if (!scene) return;

		// Remove all placed meshes
		placedMeshes.forEach((mesh) => {
			mesh.dispose();
		});
		placedMeshes = [];
		placedOrder = [];
		placedMap.clear();
		
		if (gizmoManager) {
			gizmoManager.attachToMesh(null);
		}
		
		selectedMeshName = null;
		score = 0;
		saveMessage = null;
	}

	async function saveScore() {
		if (score <= 0) {
			saveMessage = { type: 'error', text: 'Score must be greater than 0' };
			setTimeout(() => saveMessage = null, 3000);
			return;
		}

		isSavingScore = true;
		saveMessage = null;

		const result = await saveActivityScore({
			activityType: 'assembly-disassembly',
			score,
			metadata: {
				componentsPlaced: placedMeshes.length,
				timestamp: new Date().toISOString()
			}
		});

		isSavingScore = false;

		if (result.success) {
			saveMessage = { type: 'success', text: 'Score saved successfully!' };
			// Refresh high score
			await loadHighScore();
		} else {
			saveMessage = { type: 'error', text: result.error || 'Failed to save score' };
		}

		setTimeout(() => saveMessage = null, 3000);
	}

	async function loadHighScore() {
		const result = await getActivityScores('assembly-disassembly', 1);
		if (result.success && result.highScore !== undefined) {
			highScore = result.highScore;
		}
	}

	onMount(async () => {
		if (!browser || !canvas) return;

		// Shuffle tray order on every page load (client-only to avoid SSR hydration mismatch)
		shuffledComponents = shuffleInPlace([...COMPONENTS]);

		// Dynamically import Babylon.js only on client side
		const babylon = await import('@babylonjs/core');
		await import('@babylonjs/loaders');

		Engine = babylon.Engine;
		Scene = babylon.Scene;
		ArcRotateCamera = babylon.ArcRotateCamera;
		Vector3 = babylon.Vector3;
		HemisphericLight = babylon.HemisphericLight;
		SceneLoader = babylon.SceneLoader;
		Color4 = babylon.Color4;
		Color3 = babylon.Color3;
		AbstractMesh = babylon.AbstractMesh;
		MeshBuilder = babylon.MeshBuilder;
		GizmoManager = babylon.GizmoManager;
		PointerEventTypes = babylon.PointerEventTypes;
		UtilityLayerRenderer = babylon.UtilityLayerRenderer;
		PointerDragBehavior = babylon.PointerDragBehavior;

		initTrayPositions();

		// Initialize Babylon.js
		engine = new Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true
		});

		scene = new Scene(engine);
		scene.clearColor = new Color4(0.02, 0.02, 0.05, 1);

		// Camera setup
		camera = new ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2.5,
			88,
			Vector3.Zero(),
			scene
		);
		camera.attachControl(canvas, true);
		camera.lowerRadiusLimit = 18;
		camera.upperRadiusLimit = 400;
		camera.useFramingBehavior = true;
		if (camera.framingBehavior) {
			// Add comfortable padding so the scene doesn't feel over-zoomed.
			camera.framingBehavior.radiusScale = 2.6;
			camera.framingBehavior.positionScale = 0.5;
			camera.framingBehavior.framingTime = 250;
			camera.framingBehavior.elevationReturnTime = -1;
			camera.framingBehavior.zoomStopsAnimation = false;
			camera.framingBehavior.autoCorrectCameraLimitsAndSensibility = false;
		}

		// Lighting
		const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);
		light.intensity = 1.5;

		// Create ground for picking
		ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
		ground.isPickable = true;
		ground.visibility = 0.1;

		// Load casing model
		try {
			const result = await SceneLoader.ImportMeshAsync(
				'',
				'/models/assembly-disassembly/Casing (Gray).glb',
				'',
				scene
			);
			casingMesh = result.meshes[0];
			
			if (casingMesh) {
				const bounds = casingMesh.getHierarchyBoundingVectors();
				const center = bounds.max.add(bounds.min).scale(0.5);
				// Center the casing and face the opening toward the user.
				// Engine axis is X in this activity; alpha=0 places the camera on +X looking toward -X.
				camera.setTarget(center);
				camera.alpha = 0;
				camera.beta = Math.PI / 2.05;
				camera.radius = Math.max(bounds.max.subtract(bounds.min).length() * 2.0, 65);
				casingMesh.isPickable = false; // Don't select the casing
				updateCameraFraming();
			}
		} catch (error) {
			console.error('Error loading casing:', error);
		}

		// ---- Dynamic placement + scaling + scoring (client-only) ----
		const getWorldBounds = (mesh: any) => mesh.getHierarchyBoundingVectors();
		const getBoundingSize = (mesh: any) => {
			try {
				mesh.computeWorldMatrix?.(true);
				const bb = mesh.getBoundingInfo?.()?.boundingBox;
				const ex = bb?.extendSizeWorld ?? bb?.extendSize;
				if (ex) {
					return {
						x: Math.max(0.0001, (ex.x ?? 0) * 2),
						y: Math.max(0.0001, (ex.y ?? 0) * 2),
						z: Math.max(0.0001, (ex.z ?? 0) * 2)
					};
				}
			} catch {
				// ignore and fallback
			}
			const b = getWorldBounds(mesh);
			return {
				x: Math.max(0.0001, b.max.x - b.min.x),
				y: Math.max(0.0001, b.max.y - b.min.y),
				z: Math.max(0.0001, b.max.z - b.min.z)
			};
		};

		const setYZToCasingCenter = (mesh: any) => {
			if (!casingMesh) return;
			const casingBounds = getWorldBounds(casingMesh);
			const casingCenter = casingBounds.max.add(casingBounds.min).scale(0.5);
			const curBounds = getWorldBounds(mesh);
			const curCenter = curBounds.max.add(curBounds.min).scale(0.5);
			mesh.position.y += casingCenter.y - curCenter.y;
			mesh.position.z += casingCenter.z - curCenter.z;
		};

		const clampXToCasing = (mesh: any) => {
			if (!casingMesh) return;
			const casingBounds = getWorldBounds(casingMesh);
			const cur = getWorldBounds(mesh);
			const minX = casingBounds.min.x + CASING_PADDING_X;
			const maxX = casingBounds.max.x - CASING_PADDING_X;
			if (cur.min.x < minX) mesh.position.x += minX - cur.min.x;
			if (cur.max.x > maxX) mesh.position.x -= cur.max.x - maxX;
		};
		
		// Position component at next available slot (left to right from casing front)
		const positionNextToLastPlaced = (mesh: any) => {
			if (!casingMesh) return;
			
			const casingBounds = getWorldBounds(casingMesh);
			const meshBounds = getWorldBounds(mesh);
			const meshWidth = meshBounds.max.x - meshBounds.min.x;
			
			// If this is the first component, place it at the front (max.x) of casing
			if (placedMap.size <= 1) {
				const targetMaxX = casingBounds.max.x - CASING_PADDING_X;
				const currentMaxX = meshBounds.max.x;
				mesh.position.x += (targetMaxX - currentMaxX);
				mesh.computeWorldMatrix?.(true);
				return;
			}
			
			// Find the leftmost placed component (excluding self) - components flow from max.x towards min.x
			let leftmostMinX = casingBounds.max.x;
			for (const [id, otherMesh] of placedMap.entries()) {
				if (otherMesh === mesh) continue; // Skip self
				const otherBounds = getWorldBounds(otherMesh);
				if (otherBounds.min.x < leftmostMinX) {
					leftmostMinX = otherBounds.min.x;
				}
			}
			
			// Position this component to the left of the leftmost one (towards min.x)
			const currentMaxX = meshBounds.max.x;
			const targetMaxX = leftmostMinX - 0.05; // Small gap for visual separation
			mesh.position.x += (targetMaxX - currentMaxX);
			mesh.computeWorldMatrix?.(true);
		};

		// Reflow all placed meshes to fit perfectly inside casing with no gaps
		const reflowAndFit = () => {
			if (!casingMesh || placedMap.size === 0) return;
			const casingBounds = getWorldBounds(casingMesh);
			const casingSize = getBoundingSize(casingMesh);
			const availableWidth = (casingBounds.max.x - casingBounds.min.x) - CASING_PADDING_X * 2;
			
			// Sort by current world X descending (max.x to min.x) - front to back
			const meshes = Array.from(placedMap.values()).sort((a, b) => {
				const aB = getWorldBounds(a);
				const bB = getWorldBounds(b);
				return bB.min.x - aB.min.x; // Reversed: higher X (front) comes first
			});
			
			// Measure current widths
			let totalWidth = 0;
			for (const m of meshes) {
				m.computeWorldMatrix?.(true);
				const b = getWorldBounds(m);
				const w = b.max.x - b.min.x;
				totalWidth += w;
			}
			
			// If total width exceeds available width, scale all components down uniformly
			let scaleFactor = 1;
			if (totalWidth > availableWidth) {
				scaleFactor = availableWidth / Math.max(totalWidth, 0.0001);
				console.log(`Scaling components by ${scaleFactor.toFixed(3)} to fit casing`);
				
				// Apply uniform scaling to all components
				meshes.forEach(m => {
					m.scaling.scaleInPlace(scaleFactor);
					m.computeWorldMatrix?.(true);
				});
			}

			// Position components touching each other from front to back with no gaps
			let cursor = casingBounds.max.x - CASING_PADDING_X; // Start from front (max.x)
			meshes.forEach((m) => {
				// Align Y/Z to centerline
				setYZToCasingCenter(m);
				m.computeWorldMatrix?.(true);
				
				// Position component at cursor
				const b = getWorldBounds(m);
				const currentMaxX = b.max.x;
				const dx = cursor - currentMaxX;
				m.position.x += dx;
				m.computeWorldMatrix?.(true);
				
				// Move cursor to left edge of this component for next component
				const placedBounds = getWorldBounds(m);
				cursor = placedBounds.min.x; // No gap - components touch
			});
		};

		// Load reference scales from full turbofan model for perfect fit
		const loadReferenceScales = async () => {
			try {
				const result = await SceneLoader.ImportMeshAsync(
					'',
					'/models/Turbofan.glb',
					'',
					scene
				);
				
				if (result.meshes.length > 0) {
					console.log('Reference model meshes:', result.meshes.map((m: any) => m.name));
					
					// Find component meshes by name matching (case-insensitive, partial match)
					const componentMap: Record<string, string[]> = {
						intake: ['intake', 'inlet', 'fan'],
						compression: ['compress', 'compressor', 'lpc', 'hpc'],
						combustion: ['combustion', 'combustor', 'burner', 'chamber'],
						turbine: ['turbine', 'lpt', 'hpt'],
						exhaust: ['exhaust', 'nozzle', 'tail']
					};
					
					for (const [id, keywords] of Object.entries(componentMap)) {
						const mesh = result.meshes.find((m: any) => {
							const name = m.name.toLowerCase();
							return keywords.some(kw => name.includes(kw));
						});
						
						if (mesh) {
							const bounds = mesh.getHierarchyBoundingVectors();
							const worldPos = mesh.getAbsolutePosition();
							referenceScales.set(id, {
								scale: mesh.scaling.clone(),
								bounds: {
									min: bounds.min.clone(),
									max: bounds.max.clone()
								},
								position: worldPos.clone()
							});
							console.log(`Found reference for ${id}:`, mesh.name, 'scale:', mesh.scaling);
						} else {
							console.warn(`No reference mesh found for ${id}`);
						}
					}
				}
				
				// Dispose the reference model after extracting data
				result.meshes.forEach((m: any) => m.dispose());
			} catch (error) {
				console.warn('Could not load reference turbofan model, using fallback scaling:', error);
			}
		};

		// Apply dynamic scaling to fit components perfectly inside the casing
		const normalizeScaleToCasing = (mesh: any, fitRatio = 0.92) => {
			if (!casingMesh) return;
			mesh.metadata = mesh.metadata || {};
			mesh.metadata.__normalize = mesh.metadata.__normalize || {};
			const meta = mesh.metadata.__normalize;
			if (!meta.baseScaling) meta.baseScaling = mesh.scaling.clone();

			// Always use proportional scaling to ensure perfect fit with casing
			const casingSize = getBoundingSize(casingMesh);
			mesh.scaling.copyFrom(meta.baseScaling);
			mesh.computeWorldMatrix?.(true);
			const compSize = getBoundingSize(mesh);

			// Scale to fit snugly inside the casing diameter (Y/Z)
			const targetY = casingSize.y * fitRatio;
			const targetZ = casingSize.z * fitRatio;
			const scaleY = targetY / compSize.y;
			const scaleZ = targetZ / compSize.z;
			const scaleFactor = Math.min(scaleY, scaleZ);
			
			const componentId = mesh.metadata?.componentId;
			console.log(`Scaling ${componentId || 'component'} by ${scaleFactor.toFixed(3)} to fit casing`);
			mesh.scaling.copyFrom(meta.baseScaling);
			mesh.scaling.setAll(scaleFactor);
			mesh.computeWorldMatrix?.(true);
		};
		
		// Load reference scales for perfect component fit
		await loadReferenceScales();

		const computeOrderFromPositions = () => {
			return Array.from(placedMap.entries())
				.filter(([id, mesh]) => !!id && !!mesh)
				.sort((a, b) => {
					const aBounds = getWorldBounds(a[1]);
					const bBounds = getWorldBounds(b[1]);
					return aBounds.min.x - bBounds.min.x;
				})
				.map(([id]) => id);
		};

		const recomputeScore = (order: string[]) => {
			const n = order.filter((id) => placedMap.has(id)).length;
			
			if (n === 0) {
				score = 0;
				return;
			}
			
			// Check sequential correctness
			let correctPositions = 0;
			for (let i = 0; i < Math.min(order.length, SEQUENCE.length); i++) {
				if (order[i] === SEQUENCE[i]) {
					correctPositions++;
				}
			}
			
			// Percentage-based scoring:
			// - Each correctly positioned component = 20% (5 components × 20% = 100%)
			// - Placed but wrong position = 5% each
			const correctScore = correctPositions * 20;
			const incorrectScore = (n - correctPositions) * 5;
			
			score = correctScore + incorrectScore;
		};

		const SNAP_THRESHOLD_X = 1.25;
		const COLLISION_TOLERANCE = 0.1; // Small overlap tolerance
		
		const hasCollision = (mesh: any): boolean => {
			const a = getWorldBounds(mesh);
			for (const [otherId, otherMesh] of placedMap.entries()) {
				if (otherMesh === mesh) continue;
				const b = getWorldBounds(otherMesh);
				// Check for significant overlap (beyond tolerance)
				const overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
				if (overlapX > COLLISION_TOLERANCE) {
					return true;
				}
			}
			return false;
		};
		
		const resolveCollisionX = (mesh: any) => {
			mesh.metadata = mesh.metadata || {};
			const lastValidX = mesh.metadata.lastValidPos?.x;
			
			if (!hasCollision(mesh)) return;
			
			// Try to revert to last valid position first
			if (typeof lastValidX === 'number' && Number.isFinite(lastValidX)) {
				mesh.position.x = lastValidX;
				mesh.computeWorldMatrix?.(true);
				
				// If still colliding after revert, send back to tray
				if (hasCollision(mesh)) {
					returnToTray(mesh);
				}
				return;
			}
			
			// No valid last position, try to find space or return to tray
			let resolved = false;
			for (const [otherId, otherMesh] of placedMap.entries()) {
				if (otherMesh === mesh) continue;
				const a = getWorldBounds(mesh);
				const b = getWorldBounds(otherMesh);
				const overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
				
				if (overlapX > COLLISION_TOLERANCE) {
					// Try pushing to nearest free space
					const pushLeftDist = b.min.x - a.max.x;
					const pushRightDist = b.max.x - a.min.x;
					
					if (Math.abs(pushLeftDist) < Math.abs(pushRightDist)) {
						mesh.position.x += pushLeftDist - 0.2; // Add small gap
					} else {
						mesh.position.x += pushRightDist + 0.2; // Add small gap
					}
					mesh.computeWorldMatrix?.(true);
					
					// Check if pushing resolved the collision
					if (!hasCollision(mesh)) {
						resolved = true;
						break;
					}
				}
			}
			
			// If still colliding after all attempts, return to tray
			if (!resolved && hasCollision(mesh)) {
				returnToTray(mesh);
			}
		};

		const trySnapToCorrectNeighbor = (mesh: any) => {
			const id = mesh.metadata?.componentId as string | undefined;
			if (!id) return;
			const idx = SEQUENCE.indexOf(id);
			if (idx === -1) return;

			const leftId = idx > 0 ? SEQUENCE[idx - 1] : null;
			const rightId = idx < SEQUENCE.length - 1 ? SEQUENCE[idx + 1] : null;
			const leftMesh = leftId ? placedMap.get(leftId) : null;
			const rightMesh = rightId ? placedMap.get(rightId) : null;

			const cur = getWorldBounds(mesh);
			let bestDelta: number | null = null;

			if (leftMesh) {
				const lb = getWorldBounds(leftMesh);
				const gap = cur.min.x - lb.max.x;
				if (Math.abs(gap) <= SNAP_THRESHOLD_X) bestDelta = -gap;
			}

			if (rightMesh) {
				const rb = getWorldBounds(rightMesh);
				const gap = rb.min.x - cur.max.x;
				const delta = gap;
				if (Math.abs(delta) <= SNAP_THRESHOLD_X) {
					if (bestDelta === null || Math.abs(delta) < Math.abs(bestDelta)) bestDelta = delta;
				}
			}

			if (bestDelta !== null) {
				mesh.position.x += bestDelta;
				mesh.computeWorldMatrix?.(true);
			}
		};

		handleDragEnd = (mesh: any, skipSnapping?: boolean) => {
			const id = mesh.metadata?.componentId as string | undefined;
			if (!id) return;
			
			// Always maintain centerline alignment
			setYZToCasingCenter(mesh);
			// Use 92% fit ratio for proper assembly
			normalizeScaleToCasing(mesh, 0.92);
			clampXToCasing(mesh);
			reflowAndFit();
			
			// Only try to snap and resolve collisions during drag, not on initial drop
			if (skipSnapping !== true) {
				trySnapToCorrectNeighbor(mesh);
				resolveCollisionX(mesh);
				clampXToCasing(mesh);
			}
			
			mesh.metadata = mesh.metadata || {};
			mesh.metadata.lastValidPos = mesh.position.clone();
			mesh.metadata.snapped = true;

			placedOrder = computeOrderFromPositions();
			recomputeScore(placedOrder);
			updateCameraFraming();
		};

		onCanvasDragOverImpl = (_e: DragEvent) => {
			// no-op beyond preventDefault in the stable handler
		};

		onCanvasDropImpl = async (e: DragEvent) => {
			if (!scene) return;

			const componentId = e.dataTransfer?.getData('componentId');
			if (!componentId) return;
			const component = COMPONENTS.find((c) => c.id === componentId);
			if (!component) return;

			// If already placed, ignore re-drop (user can drag to reposition)
			const already = placedMap.get(component.id);
			if (already) {
				if (gizmoManager) {
					gizmoManager.attachToMesh(already);
					selectedMeshName = component.name;
				}
				return;
			}

			try {
				const result = await SceneLoader.ImportMeshAsync('', component.modelPath, '', scene);
				if (result.meshes.length <= 0) return;

				// Use a mesh-like root for behaviors/bounds when possible.
				const candidate =
					result.meshes.find((m: any) => typeof m.getBoundingInfo === 'function') ?? result.meshes[0];
				const rootMesh = findRootMesh(candidate);
				
				// Start at casing center (will be positioned sequentially after)
				if (casingMesh) {
					const casingBounds = getWorldBounds(casingMesh);
					const casingCenter = casingBounds.max.add(casingBounds.min).scale(0.5);
					rootMesh.position.copyFrom(casingCenter);
				} else {
					rootMesh.position.copyFrom(Vector3.Zero());
				}
				
				rootMesh.metadata = {
					componentId: component.id,
					componentName: component.name,
					originalPos: rootMesh.position.clone(),
					snapped: false,
					lastValidPos: null
				};

				// Set Y/Z to centerline and scale to fit
				setYZToCasingCenter(rootMesh);
				normalizeScaleToCasing(rootMesh, 0.95);
				
				// Add to map before positioning (so positionNextToLastPlaced can see previous components)
				placedMap.set(component.id, rootMesh);
				placedMeshes.push(rootMesh);
				
				// Position sequentially from left to right, then reflow to keep everything inside casing
				positionNextToLastPlaced(rootMesh);
				reflowAndFit();

				// PointerDragBehavior: strictly X-axis only, Y and Z locked to centerline.
				const drag = new PointerDragBehavior({ dragAxis: new Vector3(1, 0, 0), moveAttached: true });
				drag.dragDeltaRatio = 1;
				drag.forceNormal = true;
				
				// Store the locked Y and Z positions
				let lockedY: number;
				let lockedZ: number;
				
				drag.onDragStartObservable.add(() => {
					rootMesh.metadata.originalPos = rootMesh.position.clone();
					rootMesh.metadata.lastValidPos = rootMesh.position.clone();
					setYZToCasingCenter(rootMesh);
					clampXToCasing(rootMesh);
					// Lock Y and Z positions
					lockedY = rootMesh.position.y;
					lockedZ = rootMesh.position.z;
				});
				drag.onDragObservable.add(() => {
					// Enforce Y and Z lock during drag
					rootMesh.position.y = lockedY;
					rootMesh.position.z = lockedZ;
					clampXToCasing(rootMesh);
				});
				drag.onDragEndObservable.add(() => {
					// Final enforcement of Y and Z lock
					rootMesh.position.y = lockedY;
					rootMesh.position.z = lockedZ;
					handleDragEnd(rootMesh);
				});
				rootMesh.addBehavior(drag);

				handleDragEnd(rootMesh, true); // Skip snapping/collision on initial drop

				if (gizmoManager) {
					gizmoManager.attachToMesh(rootMesh);
					selectedMeshName = component.name;
				}
				updateCameraFraming();
			} catch (error) {
				console.error('Error loading component:', error);
			}
		};

		// If parts were placed before casing finished loading, reflow them now.
		if (placedOrder.length > 0) {
			placedOrder = computeOrderFromPositions();
			recomputeScore(placedOrder);
			updateCameraFraming();
		}

		// Setup Gizmo Manager
		gizmoManager = new GizmoManager(scene);
		gizmoManager.positionGizmoEnabled = true;
		gizmoManager.rotationGizmoEnabled = true;
		gizmoManager.scaleGizmoEnabled = false;
		gizmoManager.usePointerToAttachGizmos = false;
		
		if (gizmoManager.gizmos.positionGizmo) {
			gizmoManager.gizmos.positionGizmo.scaleRatio = 2;
		}

		// Click to select logic
		scene.onPointerObservable.add((pointerInfo: any) => {
			if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
				if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh) {
					const mesh = pointerInfo.pickInfo.pickedMesh;
					
					if (mesh.name === 'ground' || mesh === casingMesh) {
						gizmoManager.attachToMesh(null);
						selectedMeshName = null;
					} else {
						const root = findRootMesh(mesh);
						gizmoManager.attachToMesh(root);
						selectedMeshName = root.metadata?.componentName || root.name;
					}
				} else {
					gizmoManager.attachToMesh(null);
					selectedMeshName = null;
				}
			}
		});

		// Keyboard shortcuts
		scene.onKeyboardObservable.add((kbInfo: any) => {
			if (kbInfo.type === 2) { // KEYDOWN
				switch (kbInfo.event.key.toLowerCase()) {
					case 'w':
						gizmoManager.positionGizmoEnabled = true;
						gizmoManager.rotationGizmoEnabled = false;
						gizmoManager.scaleGizmoEnabled = false;
						break;
					case 'e':
						gizmoManager.positionGizmoEnabled = false;
						gizmoManager.rotationGizmoEnabled = true;
						gizmoManager.scaleGizmoEnabled = false;
						break;
					case 'r':
						gizmoManager.positionGizmoEnabled = false;
						gizmoManager.rotationGizmoEnabled = false;
						gizmoManager.scaleGizmoEnabled = true;
						break;
					case 'escape':
						gizmoManager.attachToMesh(null);
						selectedMeshName = null;
						break;
					case 'delete':
					case 'backspace':
						if (gizmoManager.gizmos.positionGizmo?.attachedMesh) {
							const meshToDelete = gizmoManager.gizmos.positionGizmo.attachedMesh;
							const wasSnapped = !!meshToDelete.metadata?.snapped;
							gizmoManager.attachToMesh(null);
							meshToDelete.dispose();
							placedMeshes = placedMeshes.filter(m => m !== meshToDelete);
							const id = meshToDelete.metadata?.componentId;
							if (id) {
								placedMap.delete(id);
								placedOrder = placedOrder.filter((x) => x !== id);
							}
							selectedMeshName = null;
							if (wasSnapped) score = Math.max(0, score - 5);
							placedOrder = computeOrderFromPositions();
							recomputeScore(placedOrder);
							updateCameraFraming();
						}
						break;
				}
			}
		});

		// Render loop
		engine.runRenderLoop(() => {
			scene?.render();
		});

		// Handle resize
		if (browser && typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
		}

		// Load high score
		await loadHighScore();
	});

	function handleResize() {
		engine?.resize();
	}

	function returnToTray(mesh: any) {
		const id = mesh.metadata?.componentId as string | undefined;
		const trayPos = id ? trayPositions.get(id) : null;
		if (trayPos) {
			mesh.position.copyFrom(trayPos);
		} else {
			pushAway(mesh);
		}
		if (id) {
			placedMap.delete(id);
			placedOrder = placedOrder.filter((x) => x !== id);
			mesh.metadata = mesh.metadata || {};
			mesh.metadata.snapped = false;
			mesh.metadata.lastValidPos = null;
		}
	}

	function pushAway(mesh: any) {
		mesh.position.addInPlace(new Vector3(0, 0, PUSH_AWAY_Z));
	}

	function updateCameraFraming() {
		const activeCamera = camera || scene?.activeCamera;
		if (!activeCamera) return;

		let min = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		let max = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		let hasAnyBounds = false;

		// Include casing bounds as baseline so framing isn't too tight/zoomed
		if (casingMesh) {
			const cb = casingMesh.getHierarchyBoundingVectors();
			min = Vector3.Minimize(min, cb.min);
			max = Vector3.Maximize(max, cb.max);
			hasAnyBounds = true;
		}

		if (placedMap.size > 0) {
			placedMap.forEach((m) => {
				const b = m.getHierarchyBoundingVectors();
				min = Vector3.Minimize(min, b.min);
				max = Vector3.Maximize(max, b.max);
				hasAnyBounds = true;
			});
		}

		if (!hasAnyBounds) return;

		if (casingMesh && typeof activeCamera.setTarget === 'function') {
			const cb = casingMesh.getHierarchyBoundingVectors();
			activeCamera.setTarget(cb.max.add(cb.min).scale(0.5));
		}

		if (activeCamera.framingBehavior) {
			// Keep a consistent, non-zoomed-in framing.
			activeCamera.framingBehavior.radiusScale = 2.6;
			activeCamera.framingBehavior.positionScale = 0.5;
			activeCamera.framingBehavior.framingTime = 250;
			activeCamera.framingBehavior.elevationReturnTime = -1;
			activeCamera.framingBehavior.zoomStopsAnimation = false;
			activeCamera.framingBehavior.zoomOnBoundingInfo(min, max, false);
			return;
		}

		if (typeof activeCamera.zoomOn === 'function') {
			// Prefer Babylon's built-in zoomOn when available
			const meshesToZoom: any[] = [];
			if (casingMesh) meshesToZoom.push(casingMesh);
			placedMap.forEach((m) => meshesToZoom.push(m));
			activeCamera.zoomOn(meshesToZoom);
			return;
		}

		// fallback
		const size = max.subtract(min);
		const maxDim = Math.max(size.x, size.y, size.z);
		activeCamera.setTarget(max.add(min).scale(0.5));
		activeCamera.radius = maxDim * 6.3;
	}

	onDestroy(() => {
		if (browser && typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
		
		// Dispose preview scenes
		previewScenes.forEach(({ engine, scene }) => {
			scene?.dispose();
			engine?.dispose();
		});
		previewScenes.clear();
		
		scene?.dispose();
		engine?.dispose();
	});
    
    function initPreview(node: HTMLCanvasElement, component: Component) {
		if (browser) {
			tick().then(() => {
				createComponentPreview(component, node);
				componentPreviews.set(component.id, node);
			});
		}
		
		return {
			destroy() {}
		};
	}
</script>

<div class="assembly-container">
	<!-- Instructions Banner -->
	{#if showInstructions}
		<div class="instructions-banner">
			<div class="instructions-content">
				<h3>🎮 Controls</h3>
				<div class="controls-grid">
					<div><kbd>W</kbd> Position Mode</div>
					<div><kbd>E</kbd> Rotation Mode</div>
					<div><kbd>ESC</kbd> Deselect</div>
					<div><kbd>DEL</kbd> Delete Selected</div>
				</div>
				<p>Drag components from below onto the canvas. Click to select and use gizmos to position/rotate.</p>
			</div>
			<button class="close-instructions" onclick={() => showInstructions = false}>✕</button>
		</div>
	{/if}

	<!-- Main Canvas -->
	<div class="canvas-wrapper">
		<canvas 
			bind:this={canvas} 
			class="assembly-canvas"
			ondragover={onCanvasDragOver}
			ondrop={onCanvasDrop}
		></canvas>

		<!-- Status Overlay -->
		<div class="status-overlay">
			<div class="score-badge">
				<span class="score-label">Score</span>
				<span class="score-value">{score}</span>
			</div>
			{#if highScore > 0}
				<div class="high-score-badge">
					<span class="high-score-label">High Score</span>
					<span class="high-score-value">{highScore}</span>
				</div>
			{/if}
			{#if selectedMeshName}
				<div class="selected-badge">
					Selected: {selectedMeshName}
				</div>
			{/if}
		</div>
	</div>

	<!-- Components Shelf -->
	<div class="components-shelf">
		<h3 class="shelf-title">Component Parts</h3>
		<div class="shelf-grid">
			{#each (shuffledComponents.length ? shuffledComponents : COMPONENTS) as component (component.id)}
				<div
					class="component-card"
					draggable="true"
					ondragstart={(e) => {
						e.dataTransfer?.setData('componentId', component.id);
					}}
					role="button"
					tabindex="0"
				>
					<div class="component-preview-wrapper">
						<canvas
							class="component-preview"
							use:initPreview={component}
						></canvas>
					</div>
					<div class="component-info">
						<div class="component-name">{component.name}</div>
						<div class="drag-hint">Drag to canvas</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Control Buttons -->
	<div class="controls">
		<button class="control-btn reset-btn" onclick={resetScene}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
				<path d="M21 3v5h-5"/>
			</svg>
			Reset Scene
		</button>
		<button class="control-btn save-btn" onclick={saveScore} disabled={isSavingScore || score <= 0}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
				<polyline points="17 21 17 13 7 13 7 21"/>
				<polyline points="7 3 7 8 15 8"/>
			</svg>
			{isSavingScore ? 'Saving...' : 'Save Score'}
		</button>
		<button class="control-btn help-btn" onclick={() => showInstructions = !showInstructions}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>
			Help
		</button>
	</div>

	<!-- Save Message -->
	{#if saveMessage}
		<div class="save-message" class:success={saveMessage.type === 'success'} class:error={saveMessage.type === 'error'}>
			{saveMessage.text}
		</div>
	{/if}
</div>

<!-- Svelte action for initializing previews -->
<script module lang="ts">
	import { tick } from 'svelte';
</script>

<style>
	.assembly-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		position: relative;
	}

	/* Instructions Banner */
	.instructions-banner {
		background: linear-gradient(135deg, rgba(255, 204, 0, 0.15), rgba(135, 206, 235, 0.15));
		border: 2px solid var(--navbar-accent, var(--ui-yellow));
		border-radius: 1rem;
		padding: var(--spacing-md);
		position: relative;
		animation: slideDown 0.3s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.instructions-content h3 {
		font-family: var(--font-heading);
		color: var(--navbar-accent, var(--ui-yellow));
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
		font-family: var(--font-body);
		color: var(--font-secondary);
	}

	.controls-grid kbd {
		background: rgba(0, 0, 0, 0.5);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--navbar-accent, var(--ui-yellow));
		font-family: var(--font-heading);
		font-weight: 700;
		color: var(--navbar-accent, var(--ui-yellow));
		margin-right: 0.5rem;
	}

	.instructions-content p {
		color: var(--font-secondary);
		margin: 0;
		font-family: var(--font-body);
	}

	.close-instructions {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.5);
		border: 2px solid var(--navbar-accent, var(--ui-yellow));
		color: var(--navbar-accent, var(--ui-yellow));
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		cursor: pointer;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.close-instructions:hover {
		background: var(--navbar-accent, var(--ui-yellow));
		color: var(--bg-dark);
		transform: rotate(90deg);
	}

	/* Canvas */
	.canvas-wrapper {
		position: relative;
		width: 100%;
		height: 600px;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(10, 47, 53, 0.5));
		border-radius: 1rem;
		overflow: hidden;
		border: 2px solid rgba(135, 206, 235, 0.3);
		box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.assembly-canvas {
		width: 100%;
		height: 100%;
		display: block;
		outline: none;
		cursor: crosshair;
	}

	/* Status Overlay */
	.status-overlay {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: flex-end;
		pointer-events: none;
	}

	.score-badge {
		background: rgba(0, 0, 0, 0.8);
		border: 2px solid var(--navbar-accent, var(--ui-yellow));
		border-radius: 0.75rem;
		padding: 0.75rem 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	}

	.score-label {
		font-family: var(--font-heading);
		font-size: 0.875rem;
		color: var(--font-accent-yellow);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.score-value {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 900;
		color: var(--navbar-accent, var(--ui-yellow));
		line-height: 1;
	}

	.selected-badge {
		background: rgba(135, 206, 235, 0.2);
		border: 2px solid var(--ui-light-blue);
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		font-family: var(--font-heading);
		font-size: 0.875rem;
		color: var(--ui-light-blue);
		font-weight: 700;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	}

	.high-score-badge {
		background: rgba(255, 215, 0, 0.2);
		border: 2px solid gold;
		border-radius: 0.75rem;
		padding: 0.75rem 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
	}

	.high-score-label {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		color: gold;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.high-score-value {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 900;
		color: gold;
		line-height: 1;
	}

	/* Components Shelf */
	.components-shelf {
		background: rgba(0, 0, 0, 0.3);
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 1rem;
		padding: var(--spacing-md);
	}

	.shelf-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--navbar-accent, var(--ui-yellow));
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.shelf-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 1rem;
		justify-content: space-between;
	}

	.component-card {
		background: rgba(10, 47, 53, 0.8);
		border: 2px solid rgba(135, 206, 235, 0.5);
		border-radius: 1rem;
		overflow: hidden;
		cursor: grab;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.component-card:hover {
		border-color: var(--navbar-accent, var(--ui-yellow));
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	.component-card:active {
		cursor: grabbing;
	}

	.component-preview-wrapper {
		width: 100%;
		height: 120px;
		background: rgba(0, 0, 0, 0.5);
		position: relative;
	}

	.component-preview {
		width: 100%;
		height: 100%;
		display: block;
	}

	.component-info {
		padding: var(--spacing-sm);
		text-align: center;
	}

	.component-name {
		font-family: var(--font-heading);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--font-secondary);
		margin-bottom: 0.5rem;
	}

	.drag-hint {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--font-accent-cyan);
		font-style: italic;
	}

	/* Controls */
	.controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.control-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: var(--spacing-xs) var(--spacing-md);
		border: none;
		border-radius: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.reset-btn {
		background: linear-gradient(135deg, var(--navbar-accent, var(--ui-yellow)), var(--font-accent-yellow));
		color: var(--bg-dark);
	}

	.help-btn {
		background: linear-gradient(135deg, var(--ui-light-blue), var(--font-accent-cyan));
		color: var(--bg-dark);
	}

	.save-btn {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
	}

	.save-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.save-btn:disabled:hover {
		transform: none;
	}

	.control-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
	}

	.control-btn:active {
		transform: translateY(0);
	}

	.control-btn svg {
		flex-shrink: 0;
	}

	/* Save Message */
	.save-message {
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: 0.75rem;
		font-family: var(--font-heading);
		font-weight: 700;
		text-align: center;
		animation: slideDown 0.3s ease;
	}

	.save-message.success {
		background: rgba(16, 185, 129, 0.2);
		border: 2px solid #10b981;
		color: #10b981;
	}

	.save-message.error {
		background: rgba(239, 68, 68, 0.2);
		border: 2px solid #ef4444;
		color: #ef4444;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.canvas-wrapper {
			height: 400px;
		}

		.shelf-grid {
			gap: 1rem;
		}

		.component-card {
			flex-basis: 150px;
			min-width: 150px;
		}

		.component-preview-wrapper {
			height: 120px;
		}

		.controls-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
