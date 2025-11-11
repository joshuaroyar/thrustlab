<script lang="ts">
	import { onMount } from 'svelte';
	
	let loading = $state(true);
	let progress = $state(0);

	onMount(() => {
		// Simulate loading progress
		const interval = setInterval(() => {
			progress += Math.random() * 30;
			if (progress >= 100) {
				progress = 100;
				setTimeout(() => {
					loading = false;
				}, 300);
				clearInterval(interval);
			}
		}, 200);

		return () => clearInterval(interval);
	});
</script>

{#if loading}
	<div class="page-loader">
		<div class="loader-content">
			<div class="logo-loader">
				<span class="logo-text">ThrustLab</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%"></div>
			</div>
			<p class="loading-text">Initializing 3D Environment...</p>
		</div>
	</div>
{/if}

<style>
	.page-loader {
		position: fixed;
		inset: 0;
		background: linear-gradient(135deg, #223A5E 0%, #0a1628 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		animation: fadeOut 0.5s ease 0.3s forwards;
	}

	@keyframes fadeOut {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}

	.loader-content {
		text-align: center;
		max-width: 400px;
		width: 100%;
		padding: 2rem;
	}

	.logo-loader {
		margin-bottom: 3rem;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.8;
		}
	}

	.logo-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		background: linear-gradient(135deg, #38C172 0%, #FFA726 50%, #FF3C7E 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-shift 3s ease infinite;
		background-size: 200% 200%;
	}

	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.progress-bar {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 1.5rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #38C172, #FFA726, #FF3C7E);
		border-radius: 2px;
		transition: width 0.3s ease;
		box-shadow: 0 0 10px rgba(56, 193, 114, 0.5);
	}

	.loading-text {
		font-family: 'Roboto', sans-serif;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		margin: 0;
		animation: blink 1.5s ease-in-out infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
</style>
