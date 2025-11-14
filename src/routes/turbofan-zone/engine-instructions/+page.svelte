<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let showInstructions = $state(true);

	onMount(() => {
		// Handle escape key to go back
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				goto('/turbofan-zone');
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	function handleContainerClick() {
		goto('/turbofan-zone/engine-fullscreen');
	}

	function handleBackClick(e: Event) {
		e.stopPropagation();
		goto('/turbofan-zone');
	}
</script>

<!-- Evening Sky Background (static) -->
<div class="sky-background"></div>

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
					<h1 class="instructions-title">Welcome aboard! 🚀</h1>
					<p class="instructions-subtitle">Explore your 3D Turbofan Engine like a pro:</p>

					<div class="instruction-list">
						<div class="instruction-item">
							<div class="instruction-icon">🔍</div>
							<div class="instruction-text">
								<strong>Zoom In & Out:</strong> Use your mouse scroll to get closer or step back for the full view.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">🔄</div>
							<div class="instruction-text">
								<strong>Rotate the Engine:</strong> Hold the left mouse button and move around to inspect every angle.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">👆</div>
							<div class="instruction-text">
								<strong>Explore Components:</strong> Click any part to see its definition and hear a voice explanation.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">⛶</div>
							<div class="instruction-text">
								<strong>Enter Full Screen:</strong> Click the zoom magnifying glass to go full screen.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">⛶</div>
							<div class="instruction-text">
								<strong>Exit Full Screen:</strong> Click the unzoom magnifying glass to return to normal view.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">🔄</div>
							<div class="instruction-text">
								<strong>Reset View:</strong> Press the Reset button to return the engine to its original position.
							</div>
						</div>

						<div class="instruction-item">
							<div class="instruction-icon">🏷️</div>
							<div class="instruction-text">
								<strong>Toggle Labels:</strong> Turn component labels on or off to reduce clutter or check details.
							</div>
						</div>
					</div>

					<div class="click-hint">
						<p>👉 Click anywhere to continue to fullscreen view</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
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
		max-width: 1200px;
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
		padding: 4rem 3rem;
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
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 900;
		color: var(--font-accent-yellow);
		text-align: center;
		margin: 0 0 1rem 0;
		text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
	}

	.instructions-subtitle {
		font-family: var(--font-body);
		font-size: clamp(1.2rem, 2vw, 1.5rem);
		color: var(--font-accent-cyan);
		text-align: center;
		margin: 0 0 3rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.instruction-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.instruction-item {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 1.5rem;
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
