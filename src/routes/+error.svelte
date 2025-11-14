<script lang="ts">
	import { page } from '$app/state';
	import SkyParallax from '$lib/components/ui/SkyParallax.svelte';

	const errorCode = page.status;
	const errorMessage = page.error?.message || 'Page not found';
</script>

<!-- Use the reusable Sky Parallax component with static day mode -->
<SkyParallax staticSky={true} skyMode="day" enableMouseParallax={true} enableDrift={true} />

<div class="error-page">

	<div class="error-content animate-scale">
		<div class="airplane-container">
			<div class="airplane">✈️</div>
			<div class="contrail">
				<div class="trail"></div>
				<div class="trail"></div>
				<div class="trail"></div>
			</div>
		</div>

		<h1 class="error-code animate-slide-left">{errorCode}</h1>
		<h2 class="error-title animate-slide-right">Flight Path Not Found!</h2>
		<p class="error-description animate-fade">
			{#if errorCode === 404}
				Looks like this page is off the radar. The flight path you're following doesn't exist in our navigation system.
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
				Return to Home
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
				<span class="hint-icon">🧭</span>
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

	<div class="flight-patterns">
		<div class="pattern pattern-1">
			<div class="mini-plane">✈️</div>
		</div>
		<div class="pattern pattern-2">
			<div class="mini-plane">✈️</div>
		</div>
		<div class="pattern pattern-3">
			<div class="mini-plane">✈️</div>
		</div>
	</div>
</div>

<style>
	@keyframes gradient-flash {
		0%, 100% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 50% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		75% {
			background-position: 50% 50%;
		}
	}

	.error-page {
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}

	.error-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 800px;
		color: var(--font-primary);
	}

	.airplane-container {
		position: relative;
		display: inline-block;
		margin-bottom: 2rem;
		animation: fly 4s ease-in-out infinite;
	}

	@keyframes fly {
		0%, 100% { transform: translateY(0) translateX(0) rotate(-5deg); }
		25% { transform: translateY(-15px) translateX(10px) rotate(0deg); }
		50% { transform: translateY(-30px) translateX(0) rotate(-5deg); }
		75% { transform: translateY(-15px) translateX(-10px) rotate(-10deg); }
	}

	.airplane {
		font-size: 8rem;
		filter: drop-shadow(0 4px 12px rgba(0, 206, 209, 0.5));
		animation: tilt 2s ease-in-out infinite;
	}

	@keyframes tilt {
		0%, 100% { transform: rotate(-5deg); }
		50% { transform: rotate(5deg); }
	}

	.contrail {
		position: absolute;
		bottom: 25%;
		right: 70%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transform: rotate(-20deg);
	}

	.trail {
		width: 80px;
		height: 4px;
		background: linear-gradient(
			90deg,
			rgba(255, 217, 102, 0.6) 0%,
			rgba(0, 206, 209, 0.4) 50%,
			transparent 100%
		);
		border-radius: 2px;
		animation: fade-trail 1.5s ease-in-out infinite;
	}

	.trail:nth-child(2) {
		animation-delay: 0.3s;
		width: 60px;
		opacity: 0.7;
	}

	.trail:nth-child(3) {
		animation-delay: 0.6s;
		width: 40px;
		opacity: 0.5;
	}

	@keyframes fade-trail {
		0%, 100% { opacity: 0.3; transform: scaleX(1); }
		50% { opacity: 0.8; transform: scaleX(1.2); }
	}

	.error-code {
		font-family: 'Montserrat', sans-serif;
		font-size: 8rem;
		font-weight: 900;
		margin: 0;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 20%,
			var(--ui-light-blue) 40%,
			var(--font-accent-yellow) 60%,
			var(--ui-yellow) 80%,
			var(--font-accent-cyan) 100%
		);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 4s ease-in-out infinite;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
		line-height: 1;
	}

	.error-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 1rem 0;
		color: var(--font-primary);
		text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
	}

	.error-description {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: var(--font-primary);
		margin: 1.5rem 0 3rem;
		line-height: 1.6;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
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
		font-weight: 700;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: none;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 100%
		);
		color: var(--font-primary);
		box-shadow: 0 4px 20px rgba(0, 206, 209, 0.4);
		border: 2px solid rgba(255, 217, 102, 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(0, 206, 209, 0.6);
		border-color: var(--font-accent-cyan);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.7);
		color: var(--font-primary);
		border: 2px solid var(--font-accent-cyan);
		backdrop-filter: blur(10px);
	}

	.btn-secondary:hover {
		transform: translateY(-3px);
		background: rgba(255, 255, 255, 0.9);
		border-color: var(--ui-yellow);
		box-shadow: 0 4px 20px rgba(255, 217, 102, 0.4);
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
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 50px;
		color: var(--font-primary);
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.hint:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: var(--ui-yellow);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.3);
	}

	.hint-icon {
		font-size: 1.5rem;
	}

	.flight-patterns {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.pattern {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 300px;
		height: 300px;
		border: 2px dashed rgba(255, 217, 102, 0.3);
		border-radius: 50%;
		animation: circle-flight 25s linear infinite;
	}

	.pattern-1 {
		width: 250px;
		height: 250px;
		margin: -125px 0 0 -125px;
		animation-duration: 20s;
	}

	.pattern-2 {
		width: 400px;
		height: 400px;
		margin: -200px 0 0 -200px;
		animation-duration: 30s;
		animation-direction: reverse;
		border-color: rgba(0, 206, 209, 0.3);
	}

	.pattern-3 {
		width: 550px;
		height: 550px;
		margin: -275px 0 0 -275px;
		animation-duration: 40s;
		border-color: rgba(135, 206, 235, 0.3);
	}

	@keyframes circle-flight {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.mini-plane {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%) rotate(90deg);
		font-size: 1.5rem;
		filter: drop-shadow(0 2px 6px rgba(0, 206, 209, 0.4));
		animation: plane-wobble 2s ease-in-out infinite;
	}

	@keyframes plane-wobble {
		0%, 100% { transform: translateX(-50%) rotate(85deg); }
		50% { transform: translateX(-50%) rotate(95deg); }
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

		.airplane {
			font-size: 5rem;
		}

		.contrail {
			display: none;
		}

		.error-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.error-hints {
			flex-direction: column;
			align-items: stretch;
		}

		.flight-patterns {
			display: none;
		}
	}
</style>
