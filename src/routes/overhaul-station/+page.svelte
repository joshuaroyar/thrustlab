<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		document.body.classList.add('zone-overhaul');

		// Safety: Ensure scrolling is enabled when page loads
		if (typeof document !== 'undefined') {
			document.body.classList.remove('page-transitioning');
			document.body.style.removeProperty('overflow');
			document.documentElement.style.removeProperty('overflow');
			console.log('Overhaul Station mounted - scroll enabled');
		}

		return () => {
			document.body.classList.remove('zone-overhaul');
			// Safety: Ensure scroll remains enabled on cleanup
			if (typeof document !== 'undefined') {
				document.body.style.removeProperty('overflow');
				document.documentElement.style.removeProperty('overflow');
			}
		};
	});
</script>

<!-- Page Content -->
<div class="page-container">
	<div class="hero-section">
		<h1 class="gradient-title gradient-animated">Overhaul Station</h1>
		<p class="description">
			Step into the Overhaul Station, where hands-on learning takes flight. In this interactive
			zone, students dive into the intricate process of assembling and disassembling turbofan engine
			components—gaining a deeper understanding of each part's role and the essential principles of
			gas turbine engine overhaul. It's where theory meets practice, transforming knowledge into
			real-world technical skill.
		</p>
	</div>

	<div class="modules-container">
		<a href="/overhaul-station/preliminary-module" class="module-card">
			<div class="card-content">
				<span class="sub-label">LABORATORY</span>
				<span class="main-label">MODULE:</span>
				<h3 class="module-title-text gradient-animated">PRELIMINARY<br />LABORATORY<br />MODULE</h3>
			</div>
			<div class="arrow-icon">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</div>
		</a>

		<a href="/overhaul-station/assembly-disassembly" class="module-card">
			<div class="card-content">
				<span class="sub-label">ACTIVITY</span>
				<span class="main-label">MODULE:</span>
				<h3 class="module-title-text gradient-animated">
					ASSEMBLY &<br />DISASSEMBLY ACTIVITY
				</h3>
			</div>
			<div class="arrow-icon">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
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
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl);
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
		/* Gradient moved to .gradient-animated utility */
		color: var(--font-secondary);
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	/* gradient-flash keyframes moved to global app.css */

	.description {
		font-family: 'Poppins', var(--font-body), sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		line-height: 1.8;
		color: var(--font-primary);
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
		background-color: var(--ui-navy); /* Dark Blue for both (from design tokens) */
		color: var(--font-secondary);
	}

	.module-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
		background-color: var(--bg-primary); /* Lighter blue on hover (from design tokens) */
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
		color: var(--navbar-accent, var(--ui-yellow)); /* Responsive arrow color */
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
		.module-title-one-line {
			white-space: normal;
			font-size: 2.2rem;
			letter-spacing: 1px;
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
