<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ModelViewer from '$lib/components/ModelViewer.svelte';

	let showLabels = $state(true);
	let modelLoaded = $state(false);

	// Part descriptions for highlighting
	const partDescriptions = {
		'Fan': {
			name: 'Fan',
			description: 'Large rotating blades that draw air into the engine and provide bypass thrust.'
		},
		'Compressor': {
			name: 'Compressor',
			description: 'Increases the pressure of incoming air before combustion.'
		},
		'Combustor': {
			name: 'Combustion Chamber',
			description: 'Where fuel is mixed with compressed air and ignited to produce hot gases.'
		},
		'Turbine': {
			name: 'Turbine',
			description: 'Extracts energy from hot gases to drive the compressor and fan.'
		},
		'Nozzle': {
			name: 'Exhaust Nozzle',
			description: 'Accelerates exhaust gases to produce thrust.'
		},
		'Bypass': {
			name: 'Bypass Duct',
			description: 'Channel for air that bypasses the engine core, providing additional thrust.'
		}
	};

	let cameraResetTrigger = $state(0);

	onMount(() => {
		// Handle escape key to go back to turbofan engine
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				goto('/turbofan-engine');
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	function handleBackClick() {
		goto('/turbofan-engine');
	}

	function toggleLabels() {
		showLabels = !showLabels;
	}

	function resetView() {
		// Trigger camera reset by changing the key
		cameraResetTrigger++;
	}

	function handleModelLoaded() {
		modelLoaded = true;
	}
</script>

<!-- Evening Sky Background -->
<div class="sky-background"></div>

<div class="fullscreen-page">
	<div class="header-controls">
		<button class="control-button back-button" onclick={handleBackClick}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			Back to Turbofan Engine
		</button>

		<div class="control-group">
			<button class="control-button" title="Reset View" onclick={resetView}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="23 4 23 10 17 10"></polyline>
					<polyline points="1 20 1 14 7 14"></polyline>
					<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
				</svg>
				Reset
			</button>

			<button 
				class="control-button {showLabels ? 'active' : ''}" 
				title="Toggle Labels"
				onclick={toggleLabels}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="12" y1="2" x2="12" y2="6"></line>
					<line x1="12" y1="18" x2="12" y2="22"></line>
					<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
					<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
					<line x1="2" y1="12" x2="6" y2="12"></line>
					<line x1="18" y1="12" x2="22" y2="12"></line>
					<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
					<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
				</svg>
				Labels
			</button>

			<button class="control-button exit-fullscreen" onclick={handleBackClick} title="Exit Fullscreen">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					<line x1="11" y1="8" x2="11" y2="14"></line>
				</svg>
				Exit Fullscreen
			</button>
		</div>
	</div>

	<div class="engine-container">
		{#if !modelLoaded}
			<div class="loading-overlay">
				<div class="loading-spinner"></div>
				<p>Loading 3D Model...</p>
			</div>
		{/if}
		
		{#key cameraResetTrigger}
			<ModelViewer 
				modelPath="/models/Turbofan.glb"
				canvasClass="fullscreen-canvas"
				cameraPosition={{ alpha: Math.PI / 2, beta: Math.PI / 3, radius: 8 }}
				enableHighlight={showLabels}
				partDescriptions={partDescriptions}
				onModelLoaded={handleModelLoaded}
			/>
		{/key}
	</div>

	<div class="footer-info">
		<p>Press <kbd>ESC</kbd> to return to Turbofan Engine</p>
	</div>
</div>

<style>
	.sky-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom, #FF6B6B 0%, #FF8C42 30%, #FFB347 60%, #FFD700 100%);
		z-index: -1;
	}

	.fullscreen-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		position: relative;
	}

	.header-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
		z-index: 10;
	}

	.control-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.control-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(10, 47, 53, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 2px solid rgba(135, 206, 235, 0.5);
		border-radius: 50px;
		color: var(--font-secondary);
		font-family: var(--font-heading);
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.control-button:hover {
		background: rgba(28, 62, 74, 0.9);
		border-color: var(--ui-light-blue);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(135, 206, 235, 0.3);
	}

	.back-button {
		background: rgba(255, 217, 102, 0.9);
		border-color: var(--ui-yellow);
		color: #000000;
	}

	.back-button:hover {
		background: var(--ui-yellow);
		border-color: #FFE66D;
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.5);
	}

	.exit-fullscreen {
		background: rgba(215, 94, 46, 0.8);
		border-color: rgba(215, 94, 46, 0.6);
	}

	.exit-fullscreen:hover {
		background: rgba(215, 94, 46, 1);
		border-color: #D75E2E;
	}

	.engine-container {
		flex: 1;
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		display: flex;
		position: relative; /* Ensure loading overlay is positioned relative to this */
		min-height: 600px;
		margin-bottom: 1rem;
		animation: fadeIn 0.6s ease;
		overflow: hidden; /* Ensure content doesn't spill out */
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(10, 47, 53, 0.9);
		z-index: 100;
		gap: 1.5rem;
	}

	.loading-spinner {
		width: 60px;
		height: 60px;
		border: 4px solid rgba(135, 206, 235, 0.2);
		border-top-color: var(--ui-light-blue);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-overlay p {
		color: var(--font-accent-cyan);
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 600;
	}

	.control-button.active {
		background: rgba(28, 62, 74, 1);
		border-color: var(--ui-light-blue);
		box-shadow: 0 0 20px rgba(135, 206, 235, 0.4);
	}

	.footer-info {
		text-align: center;
		padding: 1rem;
		background: rgba(10, 47, 53, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.2);
	}

	.footer-info p {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--font-secondary);
		margin: 0;
	}

	kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: rgba(255, 217, 102, 0.3);
		border: 1px solid var(--ui-yellow);
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--font-accent-yellow);
		margin: 0 0.25rem;
	}

	@media (max-width: 768px) {
		.fullscreen-page {
			padding: 0.5rem;
		}

		.header-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.control-group {
			justify-content: center;
		}

		.control-button {
			font-size: 0.85rem;
			padding: 0.6rem 1.2rem;
		}

		.engine-container {
			min-height: 400px;
		}
	}
</style>
