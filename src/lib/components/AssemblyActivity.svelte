<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { saveActivityScore, getActivityScores } from '$lib/utils/activityScore';
	
	let Engine: any, Scene: any, ArcRotateCamera: any, Vector3: any;
	let HemisphericLight: any, SceneLoader: any, Color4: any, Color3: any;
	let AbstractMesh: any, MeshBuilder: any, GizmoManager: any;
	let PointerEventTypes: any, UtilityLayerRenderer: any;

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
			id: 'compressor',
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

	let canvas: HTMLCanvasElement;
	let engine: any = null;
	let scene: any = null;
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

	// Helper to find root mesh
	function findRootMesh(mesh: any): any {
		let parent = mesh;
		while (parent.parent && parent.parent.getClassName() !== 'Scene') {
			parent = parent.parent;
		}
		return parent;
	}

	// Drag and drop handler for canvas
	function onCanvasDragOver(e: DragEvent) {
		e.preventDefault();
	}

	async function onCanvasDrop(e: DragEvent) {
		e.preventDefault();
		
		if (!scene) return;

		const componentId = e.dataTransfer?.getData('componentId');
		if (!componentId) return;

		const component = COMPONENTS.find(c => c.id === componentId);
		if (!component) return;

		// Calculate 3D position from mouse coordinates
		const pickResult = scene.pick(scene.pointerX, scene.pointerY);
		const dropPosition = pickResult?.hit && pickResult.pickedPoint 
			? pickResult.pickedPoint 
			: Vector3.Zero();

		try {
			const result = await SceneLoader.ImportMeshAsync("", component.modelPath, "", scene);
			
			if (result.meshes.length > 0) {
				const rootMesh = result.meshes[0];
				rootMesh.position = dropPosition.clone();
				rootMesh.metadata = { componentId: component.id, componentName: component.name };
				
				placedMeshes.push(rootMesh);
				
				// Auto-select the newly placed mesh
				if (gizmoManager) {
					gizmoManager.attachToMesh(rootMesh);
					selectedMeshName = component.name;
				}

				score += 5; // Points for placing
			}
		} catch (error) {
			console.error('Error loading component:', error);
		}
	}

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
		placedMeshes.forEach(mesh => {
			mesh.dispose();
		});
		placedMeshes = [];
		
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

		// Initialize Babylon.js
		engine = new Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true
		});

		scene = new Scene(engine);
		scene.clearColor = new Color4(0.02, 0.02, 0.05, 1);

		// Camera setup
		const camera = new ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2.5,
			25,
			Vector3.Zero(),
			scene
		);
		camera.attachControl(canvas, true);
		camera.lowerRadiusLimit = 10;
		camera.upperRadiusLimit = 60;

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
				camera.target = center;
				casingMesh.isPickable = false; // Don't select the casing
			}
		} catch (error) {
			console.error('Error loading casing:', error);
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
							gizmoManager.attachToMesh(null);
							meshToDelete.dispose();
							placedMeshes = placedMeshes.filter(m => m !== meshToDelete);
							selectedMeshName = null;
							score = Math.max(0, score - 5);
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
			{#each COMPONENTS as component (component.id)}
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
		border: 2px solid var(--ui-yellow);
		border-radius: 1rem;
		padding: 1.5rem;
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
		color: var(--ui-yellow);
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
		border: 1px solid var(--ui-yellow);
		font-family: var(--font-heading);
		font-weight: 700;
		color: var(--ui-yellow);
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
		border: 2px solid var(--ui-yellow);
		color: var(--ui-yellow);
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
		background: var(--ui-yellow);
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
		border: 2px solid var(--ui-yellow);
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
		color: var(--ui-yellow);
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
		padding: 1.5rem;
	}

	.shelf-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--ui-yellow);
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.shelf-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
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
	}

	.component-card:hover {
		border-color: var(--ui-yellow);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	.component-card:active {
		cursor: grabbing;
	}

	.component-preview-wrapper {
		width: 100%;
		height: 150px;
		background: rgba(0, 0, 0, 0.5);
		position: relative;
	}

	.component-preview {
		width: 100%;
		height: 100%;
		display: block;
	}

	.component-info {
		padding: 1rem;
		text-align: center;
	}

	.component-name {
		font-family: var(--font-heading);
		font-size: 1rem;
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
		padding: 0.75rem 1.5rem;
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
		background: linear-gradient(135deg, var(--ui-yellow), var(--font-accent-yellow));
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
		padding: 1rem 1.5rem;
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
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
		}

		.component-preview-wrapper {
			height: 120px;
		}

		.controls-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
