<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('zone-hangar');
		return () => {
			document.body.classList.remove('zone-hangar');
		};
	});
</script>

<div class="page-container">
	
	<div class="hero-section">
		<h1 class="gradient-title gradient-animated">Hangar Zone</h1>
		<p class="description">
			Welcome to the Hangar Zone, a learning space where students journey through the history and evolution of gas turbine engines. Here, they'll discover how these powerful machines have developed over time—from early designs to the advanced engines that power today's aircraft—building a strong foundation for deeper exploration ahead.
		</p>
	</div>

	<div class="modules-container">
		<a href="/hangar-zone/module/history" class="module-card">
			<div class="card-content">
				<span class="sub-label">LEARNING</span>
				<span class="main-label">MODULE 01:</span>
				<h3 class="module-title-text gradient-animated">HISTORY OF<br>GAS TURBINE<br>ENGINES</h3>
			</div>
			<div class="arrow-icon">
				<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</div>
		</a>

		<a href="/hangar-zone/module/types" class="module-card">
			<div class="card-content">
				<span class="sub-label">LEARNING</span>
				<span class="main-label">MODULE 02:</span>
				<h3 class="module-title-text gradient-animated">TYPES OF GAS<br>TURBINE<br>ENGINES</h3>
			</div>
			<div class="arrow-icon">
				<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</div>
		</a>
	</div>
</div>

<style>
	/* Page Container */
	.page-container {
		position: relative;
		z-index: 5;
		min-height: 100vh;
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl); /* use variable */
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 3rem;
		padding: 0 1rem;
	}

	.gradient-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		margin: 0 0 1.5rem 0;
		/* Gradient animation moved to .gradient-animated (opt-in) */
		background: transparent;
		color: var(--font-secondary);
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	/* gradient-flash moved to src/app.css for global reuse */

	.description {
		font-family: 'Poppins', var(--font-body), sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		line-height: 1.8;
		color: var(--font-secondary);
		max-width: 800px;
		margin: 0 auto;
		background: transparent;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
		border: none;
		text-align: justify;
	}

	/* Modules Container */
	.modules-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--card-padding-mobile);
		margin-top: 3rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.module-card {
		position: relative;
		border-radius: 30px;
		padding: var(--card-padding);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		text-decoration: none;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		cursor: pointer;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		text-align: center;
		border: none;
		background-color: #1a2b47; /* Dark Blue for both */
		color: #FFFFFF;
	}

	.module-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
		background-color: #2c4a7c; /* Lighter blue on hover */
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		z-index: 2;
	}

	.sub-label {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.6rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 1px;
		line-height: 1.2;
	}

	.main-label {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 2.2rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.module-title-text {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 2.2rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 1px;
		line-height: 1.2;
		margin: 0;
	}

	.arrow-icon {
		position: absolute;
		bottom: var(--card-padding-mobile);
		right: var(--card-padding-mobile);
		color: var(--navbar-accent, var(--ui-yellow)); /* Arrow color uses per-page navbar accent */
		transition: transform 0.3s ease;
		z-index: 2;
	}

	.module-card:hover .arrow-icon {
		transform: translateX(10px);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-container {
			padding: calc(var(--spacing-xxl) * 1.25) var(--container-side-padding) var(--spacing-xl);
		}

		.modules-container {
			grid-template-columns: 1fr;
			gap: var(--card-padding-mobile);
		}

		.module-card {
			padding: var(--card-padding-mobile);
			min-height: 300px;
		}

		.description {
			padding: var(--spacing-sm) var(--card-padding-mobile);
			font-size: 0.95rem;
		}

		.sub-label {
			font-size: 1.4rem;
		}

		.main-label,
		.module-title-text {
			font-size: 1.8rem;
		}
	}

	@media (max-width: 480px) {
		.gradient-title {
			font-size: 2rem;
		}

		.description {
			padding: var(--spacing-sm);
			font-size: 0.9rem;
		}
	}
</style>
