<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Handle escape key to go back to turbofan zone
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

	function handleBackClick() {
		goto('/turbofan-zone');
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
			Back to Turbofan Zone
		</button>

		<div class="control-group">
			<button class="control-button" title="Reset View">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="23 4 23 10 17 10"></polyline>
					<polyline points="1 20 1 14 7 14"></polyline>
					<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
				</svg>
				Reset
			</button>

			<button class="control-button" title="Toggle Labels">
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
		<div class="placeholder-content">
			<div class="placeholder-icon">⚙️</div>
			<h2>3D Turbofan Engine Viewer</h2>
			<p class="placeholder-text">Interactive 3D model will be integrated here</p>
			<div class="placeholder-instructions">
				<div class="instruction-badge">
					<span>🖱️ Scroll to Zoom</span>
				</div>
				<div class="instruction-badge">
					<span>🔄 Drag to Rotate</span>
				</div>
				<div class="instruction-badge">
					<span>👆 Click Parts for Info</span>
				</div>
				<div class="instruction-badge">
					<span>⎋ Press ESC to Exit</span>
				</div>
			</div>
		</div>
	</div>

	<div class="footer-info">
		<p>Press <kbd>ESC</kbd> to return to Turbofan Zone</p>
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
		align-items: center;
		justify-content: center;
		min-height: 600px;
		margin-bottom: 1rem;
		animation: fadeIn 0.6s ease;
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

	.placeholder-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		padding: 3rem;
		text-align: center;
	}

	.placeholder-icon {
		font-size: 8rem;
		animation: rotate 10s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.placeholder-content h2 {
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 3vw, 2.5rem);
		font-weight: 900;
		color: var(--font-accent-yellow);
		margin: 0;
		text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
	}

	.placeholder-text {
		font-family: var(--font-body);
		font-size: 1.2rem;
		color: var(--font-secondary);
		margin: 0;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
	}

	.placeholder-instructions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 1rem;
	}

	.instruction-badge {
		padding: 0.75rem 1.5rem;
		background: rgba(28, 62, 74, 0.7);
		border-radius: 50px;
		border: 1px solid rgba(135, 206, 235, 0.3);
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--font-accent-cyan);
		transition: all 0.3s ease;
	}

	.instruction-badge:hover {
		background: rgba(28, 62, 74, 0.9);
		border-color: var(--ui-light-blue);
		transform: translateY(-2px);
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

		.placeholder-icon {
			font-size: 5rem;
		}

		.placeholder-instructions {
			flex-direction: column;
		}

		.instruction-badge {
			width: 100%;
		}
	}
</style>
