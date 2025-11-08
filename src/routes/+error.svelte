<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let stars: Array<{x: number, y: number, size: number, delay: number}> = [];

	onMount(() => {
		// Generate random stars
		stars = Array.from({ length: 50 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3 + 1,
			delay: Math.random() * 3
		}));
	});

	const errorCode = $page.status;
	const errorMessage = $page.error?.message || 'Page not found';
</script>

<div class="error-page">
	<div class="stars-container">
		{#each stars as star}
			<div 
				class="star"
				style="
					left: {star.x}%;
					top: {star.y}%;
					width: {star.size}px;
					height: {star.size}px;
					animation-delay: {star.delay}s;
				"
			></div>
		{/each}
	</div>

	<div class="error-content animate-scale">
		<div class="rocket-container">
			<div class="rocket">🚀</div>
			<div class="exhaust">
				<div class="flame"></div>
				<div class="flame"></div>
				<div class="flame"></div>
			</div>
		</div>

		<h1 class="error-code animate-slide-left">{errorCode}</h1>
		<h2 class="error-title animate-slide-right">Houston, We Have a Problem!</h2>
		<p class="error-description animate-fade">
			{#if errorCode === 404}
				Looks like this page has drifted into space. The trajectory you're following doesn't exist in our mission logs.
			{:else}
				{errorMessage}
			{/if}
		</p>

		<div class="error-actions animate-on-scroll">
			<a href="/" class="btn-primary">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<polyline points="9 22 9 12 15 12 15 22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Return to Base
			</a>
			<a href="/hangar-zone" class="btn-secondary">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round"/>
					<path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Explore Learning Zones
			</a>
		</div>

		<div class="error-hints animate-on-scroll">
			<div class="hint">
				<span class="hint-icon">💡</span>
				<span>Try using the navigation menu above</span>
			</div>
			<div class="hint">
				<span class="hint-icon">🤖</span>
				<span>Ask JAJA for help finding what you need</span>
			</div>
			<div class="hint">
				<span class="hint-icon">🔍</span>
				<span>Check your URL for typos</span>
			</div>
		</div>
	</div>

	<div class="orbit-container">
		<div class="orbit orbit-1">
			<div class="planet">🌍</div>
		</div>
		<div class="orbit orbit-2">
			<div class="planet">🛸</div>
		</div>
		<div class="orbit orbit-3">
			<div class="planet">🌙</div>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		background: linear-gradient(180deg, #223A5E 0%, #1a2d47 50%, #0f1922 100%);
	}

	.stars-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.star {
		position: absolute;
		background: white;
		border-radius: 50%;
		animation: twinkle 2s ease-in-out infinite;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.3; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.2); }
	}

	.error-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 800px;
		color: white;
	}

	.rocket-container {
		position: relative;
		display: inline-block;
		margin-bottom: 2rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(-15deg); }
		50% { transform: translateY(-20px) rotate(-10deg); }
	}

	.rocket {
		font-size: 8rem;
		filter: drop-shadow(0 0 20px rgba(255, 167, 38, 0.5));
		animation: shake 0.5s ease-in-out infinite;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-2px); }
		75% { transform: translateX(2px); }
	}

	.exhaust {
		position: absolute;
		bottom: -20px;
		right: 10%;
		display: flex;
		gap: 5px;
	}

	.flame {
		width: 15px;
		height: 30px;
		background: linear-gradient(180deg, #FFA726 0%, #FF3C7E 50%, transparent 100%);
		border-radius: 50% 50% 0 0;
		animation: flicker 0.2s ease-in-out infinite;
	}

	.flame:nth-child(2) {
		animation-delay: 0.1s;
		height: 25px;
	}

	.flame:nth-child(3) {
		animation-delay: 0.2s;
		height: 20px;
	}

	@keyframes flicker {
		0%, 100% { transform: scaleY(1); opacity: 1; }
		50% { transform: scaleY(1.3); opacity: 0.8; }
	}

	.error-code {
		font-family: 'Montserrat', sans-serif;
		font-size: 8rem;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, #38C172 0%, #FFA726 50%, #FF3C7E 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0 0 60px rgba(56, 193, 114, 0.3);
		line-height: 1;
	}

	.error-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 1rem 0;
		color: white;
	}

	.error-description {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.8);
		margin: 1.5rem 0 3rem;
		line-height: 1.6;
	}

	.error-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: none;
	}

	.btn-primary {
		background: linear-gradient(135deg, #38C172 0%, #2ea05e 100%);
		color: white;
		box-shadow: 0 4px 20px rgba(56, 193, 114, 0.4);
	}

	.btn-primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(56, 193, 114, 0.6);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);
	}

	.btn-secondary:hover {
		transform: translateY(-3px);
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.error-hints {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 2rem;
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50px;
		color: rgba(255, 255, 255, 0.9);
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.hint:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	.hint-icon {
		font-size: 1.5rem;
	}

	.orbit-container {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		border: 2px dashed rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		animation: rotate 20s linear infinite;
	}

	.orbit-1 {
		width: 300px;
		height: 300px;
		margin: -150px 0 0 -150px;
	}

	.orbit-2 {
		width: 450px;
		height: 450px;
		margin: -225px 0 0 -225px;
		animation-duration: 30s;
		animation-direction: reverse;
	}

	.orbit-3 {
		width: 600px;
		height: 600px;
		margin: -300px 0 0 -300px;
		animation-duration: 40s;
	}

	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.planet {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		font-size: 2rem;
		filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
	}

	@media (max-width: 768px) {
		.error-code {
			font-size: 5rem;
		}

		.error-title {
			font-size: 1.8rem;
		}

		.error-description {
			font-size: 1rem;
		}

		.rocket {
			font-size: 5rem;
		}

		.error-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.error-hints {
			flex-direction: column;
			align-items: stretch;
		}

		.orbit {
			display: none;
		}
	}
</style>
