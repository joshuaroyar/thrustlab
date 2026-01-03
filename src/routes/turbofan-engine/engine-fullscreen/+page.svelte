<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ModelViewer from '$lib/components/ModelViewer.svelte';
	import { turbofanPartDescriptions, turbofanComponentGroups } from '$lib/data/turbofanParts';
	import { ttsService } from '$lib/utils/tts';

	let modelLoaded = $state(false);

	// Part descriptions for highlighting
	// Based on actual 3D model mesh names and colors
	const partDescriptions = turbofanPartDescriptions;

	let cameraResetTrigger = $state(0);
	let showInstructions = $state(true);
	let showLabels = $state(false);

	onMount(() => {
		// Handle escape key to go back to turbofan engine
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				goto('/turbofan-engine');
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		document.body.classList.add('zone-turbofan');
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			document.body.classList.remove('zone-turbofan');
		};
	});

	function handleBackClick() {
		goto('/turbofan-engine');
	}

	function resetView() {
		// Trigger camera reset by changing the key
		cameraResetTrigger++;
	}

	function handleModelLoaded() {
		modelLoaded = true;

		// Preload TTS audio for all components for better performance
		const textsToPreload = turbofanComponentGroups.map(
			(group) => `${group.label}. ${group.description}`
		);
		ttsService.preload(textsToPreload).catch((error) => {
			console.warn('Failed to preload TTS audio:', error);
		});
	}
</script>

<div class="fullscreen-page">
	<div class="header-controls">
		<button class="control-button back-button" onclick={handleBackClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			Back to Turbofan Engine
		</button>

		<div class="control-group">
			<button
				class="control-button"
				title="View Instructions"
				onclick={() => (showInstructions = true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
					<line x1="12" y1="17" x2="12.01" y2="17"></line>
				</svg>
				Help
			</button>

			<button
				class="control-button {showLabels ? 'active' : ''}"
				title="Toggle Labels"
				onclick={() => (showLabels = !showLabels)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
					></path>
					<line x1="7" y1="7" x2="7.01" y2="7"></line>
				</svg>
				{showLabels ? 'Labels On' : 'Labels Off'}
			</button>

			<button class="control-button" title="Reset View" onclick={resetView}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="23 4 23 10 17 10"></polyline>
					<polyline points="1 20 1 14 7 14"></polyline>
					<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
				</svg>
				Reset
			</button>
		</div>
	</div>

	<!-- Instructions Modal (Replicated from AssemblyActivity) -->
	{#if showInstructions}
		<div
			class="instructions-overlay"
			role="button"
			tabindex="0"
			onclick={() => (showInstructions = false)}
			onkeydown={(e) => e.key === 'Enter' && (showInstructions = false)}
		>
			<div
				class="instructions-modal"
				role="button"
				tabindex="0"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<div class="instructions-content">
					<h1 class="instructions-title">Welcome aboard!</h1>
					<p class="instructions-subtitle">Explore your 3D Turbofan Engine like a pro:</p>

					<div class="instruction-list">
						<div class="instruction-item">
							<div class="instruction-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><circle cx="11" cy="11" r="8"></circle><line
										x1="21"
										y1="21"
										x2="16.65"
										y2="16.65"
									></line><line x1="11" y1="8" x2="11" y2="14"></line><line
										x1="8"
										y1="11"
										x2="14"
										y2="11"
									></line></svg
								>
							</div>
							<div class="instruction-text">
								<strong>Zoom In & Out:</strong> Use your mouse scroll to get closer or step back for the
								full view.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path
										d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
									/></svg
								>
							</div>
							<div class="instruction-text">
								<strong>Rotate the Engine:</strong> Hold the left mouse button and move around to inspect
								every angle.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
									></path><polyline points="15 3 21 3 21 9"></polyline><line
										x1="10"
										y1="14"
										x2="21"
										y2="3"
									></line></svg
								>
							</div>
							<div class="instruction-text">
								<strong>Explore Components:</strong> Click any part to see its definition and hear a voice
								explanation.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path
										d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
									></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg
								>
							</div>
							<div class="instruction-text">
								<strong>Toggle Labels:</strong> Turn component labels on or off to reduce clutter or check
								details.
							</div>
						</div>
					</div>

					<div class="jaja-tip">
						<p>
							<strong>Tip from JAJA:</strong> Take your time, click around, and discover every part of
							the engine—learning is just a click away!
						</p>
					</div>

					<div class="click-hint">
						<p>Click "Start Exploring" to continue</p>
					</div>
				</div>
				<button class="start-button" onclick={() => (showInstructions = false)}>
					Start Exploring
				</button>
			</div>
		</div>
	{/if}

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
				enableHighlight={true}
				{partDescriptions}
				onModelLoaded={handleModelLoaded}
				enableTTS={true}
				autoLoad={true}
				enableDefaultControls={true}
				{showLabels}
			/>
		{/key}
	</div>

	<div class="footer-info">
		<p>Press <kbd>ESC</kbd> to return to Turbofan Engine</p>
	</div>
</div>

<style>
	.fullscreen-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-sm);
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
		padding: 0.6rem 1.2rem; /* Reduced padding slightly to match AssemblyActivity */
		background: rgba(255, 255, 255, 0.1); /* Lighter glass */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.2); /* Thinner border */
		border-radius: 8px; /* Less rounded (8px vs 50px) to match AssemblyActivity */
		color: #e0e0e0;
		font-family: var(--font-heading); /* Or Poppins if strict */
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.control-button:hover {
		background: rgba(93, 168, 203, 0.3);
		border-color: #5da8cb;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.back-button {
		background: rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.9);
		border-color: var(--navbar-accent, var(--ui-yellow));
		color: #ffffff;
	}

	.back-button:hover {
		background: var(--navbar-accent, var(--ui-yellow));
		border-color: rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.95);
		box-shadow: 0 6px 20px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.45);
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

	.footer-info {
		text-align: center;
		padding: var(--spacing-sm);
		background: rgba(10, 47, 53, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.2);
	}

	.footer-info p {
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 900;
		margin: 0;
		background: linear-gradient(
			90deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 50%,
			var(--navbar-accent, var(--ui-yellow)) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash var(--gradient-duration) ease-in-out infinite;
	}

	kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.3);
		border: 1px solid var(--navbar-accent, var(--ui-yellow));
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--navbar-accent, var(--ui-yellow));
		margin: 0 0.25rem;
	}

	@media (max-width: 768px) {
		.fullscreen-page {
			padding: var(--spacing-xs);
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

	/* Control Button Active State */
	.control-button.active {
		background: rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.2);
		border-color: var(--navbar-accent, var(--ui-yellow));
		color: var(--navbar-accent, var(--ui-yellow));
		box-shadow: 0 0 15px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.3);
	}

	/* Instructions Overlay & Modal (Matched to AssemblyActivity & Welcome Aboard) */
	.instructions-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(5px);
		overflow-y: auto;
		padding: 2rem 0;
	}

	.instructions-modal {
		background: linear-gradient(135deg, #2d3561 0%, #1f2544 100%);
		border-radius: 16px;
		padding: 2rem;
		max-width: 700px; /* Slightly wider for new content */
		width: 90%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(255, 255, 255, 0.1);
		margin: auto;
	}

	/* Welcome Aboard Styles Ported */
	.instructions-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3rem); /* Smaller than full page but big enough for modal */
		font-weight: 900;
		text-align: center;
		margin: 0 0 1rem 0;
		background: linear-gradient(
			90deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 50%,
			var(--navbar-accent, var(--ui-yellow)) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash var(--gradient-duration) ease-in-out infinite;
		text-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
	}

	.instructions-subtitle {
		font-family: var(--font-body);
		font-size: 1.1rem;
		color: var(--font-accent-cyan);
		text-align: center;
		margin: 0 0 2rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.instruction-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.instruction-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05); /* Clean glass */
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.instruction-item:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(135, 206, 235, 0.4);
		transform: translateX(5px);
	}

	.instruction-icon {
		font-size: 1.5rem;
		color: var(--font-accent-cyan);
		flex-shrink: 0;
		filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
	}

	.instruction-text {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.5;
		color: #e0e0e0;
	}

	.instruction-text strong {
		color: var(--navbar-accent, var(--ui-yellow));
		font-weight: 700;
		display: block;
		margin-bottom: 0.25rem;
	}

	.jaja-tip {
		background: rgba(0, 212, 255, 0.1);
		border-left: 4px solid #00d4ff;
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 8px 8px 0;
	}

	.jaja-tip p {
		margin: 0;
		color: #e0e0e0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.jaja-tip strong {
		color: #00d4ff;
	}

	.click-hint {
		text-align: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(135, 206, 235, 0.2);
	}

	.click-hint p {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 700;
		color: var(--font-accent-cyan);
		margin: 0;
		animation: pulse 2s ease-in-out infinite;
	}

	.start-button {
		width: 100%;
		padding: 1rem;
		margin-top: 1rem;
		background: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: var(--font-heading);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.start-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(79, 195, 247, 0.3);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.05);
		}
	}
</style>
