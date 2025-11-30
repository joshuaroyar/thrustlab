<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let showInstructions = $state(true);

	onMount(() => {
		// Handle escape key to go back
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

	function handleContainerClick() {
		goto('/turbofan-engine/engine-fullscreen');
	}

	function handleBackClick(e: Event) {
		e.stopPropagation();
		goto('/turbofan-engine');
	}
</script>



<div class="instructions-page">
	{#if showInstructions}
		<div class="instructions-overlay">
			<button class="back-button" onclick={handleBackClick}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
				Back
			</button>

			<div 
				class="instructions-container" 
				role="button" 
				tabindex="0"
				onclick={handleContainerClick}
				onkeydown={(e) => e.key === 'Enter' && handleContainerClick()}
			>
				<div class="instructions-content">
					<h1 class="instructions-title">Welcome aboard!</h1>
					<p class="instructions-subtitle">Explore your 3D Turbofan Engine like a pro:</p>

					<div class="instruction-list">
						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
							</div>
							<div class="instruction-text">
								<strong>Zoom In & Out:</strong> Use your mouse scroll to get closer or step back for the full view.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
							</div>
							<div class="instruction-text">
								<strong>Rotate the Engine:</strong> Hold the left mouse button and move around to inspect every angle.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
							</div>
							<div class="instruction-text">
								<strong>Explore Components:</strong> Click any part to see its definition and hear a voice explanation.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
							</div>
							<div class="instruction-text">
								<strong>Enter Full Screen:</strong> Click the zoom magnifying glass to go full screen.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
							</div>
							<div class="instruction-text">
								<strong>Exit Full Screen:</strong> Click the unzoom magnifying glass to return to normal view.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
							</div>
							<div class="instruction-text">
								<strong>Reset View:</strong> Press the Reset button to return the engine to its original position.
							</div>
						</div>
					</div>

					<div class="click-hint">
						<p>Click anywhere to continue to fullscreen view</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>


	.instructions-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
	}

	.instructions-overlay {
		width: 100%;
		max-width: 800px;
		position: relative;
	}

	.back-button {
		position: absolute;
		top: -60px;
		left: 0;
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
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 10;
	}

	.back-button:hover {
		background: rgba(28, 62, 74, 0.9);
		border-color: var(--ui-light-blue);
		transform: translateX(-5px);
	}

	.back-button svg {
		width: 20px;
		height: 20px;
	}

	.instructions-container {
		background: rgba(10, 47, 53, 0.95);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 2rem;
		padding: 2.5rem 2rem;
		border: 2px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeIn 0.6s ease;
	}

	.instructions-container:hover {
		transform: scale(1.02);
		border-color: var(--ui-yellow);
		box-shadow: 0 25px 70px rgba(255, 217, 102, 0.3);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.instructions-content {
		color: var(--font-secondary);
	}

	.instructions-title {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 900;
		color: var(--font-accent-yellow);
		text-align: center;
		margin: 0 0 1rem 0;
		text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
	}

	.instructions-subtitle {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1.5vw, 1.2rem);
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
		background: rgba(28, 62, 74, 0.5);
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.2);
		transition: all 0.3s ease;
	}

	.instruction-item:hover {
		background: rgba(28, 62, 74, 0.7);
		border-color: rgba(135, 206, 235, 0.4);
		transform: translateX(10px);
	}

	.instruction-icon {
		font-size: 2rem;
		flex-shrink: 0;
		filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
	}

	.instruction-text {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--font-secondary);
	}

	.instruction-text strong {
		color: var(--font-accent-yellow);
		font-weight: 700;
		display: block;
		margin-bottom: 0.25rem;
	}

	.click-hint {
		text-align: center;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid rgba(135, 206, 235, 0.3);
	}

	.click-hint p {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--font-accent-cyan);
		margin: 0;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.05);
		}
	}

	@media (max-width: 768px) {
		.instructions-container {
			padding: 3rem 2rem;
		}

		.instruction-item {
			flex-direction: column;
			gap: 1rem;
		}

		.instruction-icon {
			font-size: 1.5rem;
		}

		.instruction-text {
			font-size: 1rem;
		}

		.back-button {
			position: fixed;
			top: 20px;
			left: 20px;
		}
	}
</style>
