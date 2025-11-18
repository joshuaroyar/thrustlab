<!-- Page Content -->
<div class="page-container">
	<div class="hero-section">
		<h1 class="gradient-title">Hangar Zone</h1>
		<p class="description">
			Welcome to the Hangar Zone, a learning space where students journey through the history and evolution of gas turbine engines. Here, they'll discover how these powerful machines have developed over time—from early designs to the advanced engines that power today's aircraft—building a strong foundation for deeper exploration ahead.
		</p>
	</div>

	<div class="modules-container">
		<a href="/hangar-zone/module/history" class="module-card">
			<div class="module-number">01</div>
			<h2>LEARNING MODULE 01:</h2>
			<h3>HISTORY OF GAS TURBINE ENGINES</h3>
			<div class="arrow">→</div>
		</a>

		<a href="/hangar-zone/module/types" class="module-card">
			<div class="module-number">02</div>
			<h2>LEARNING MODULE 02:</h2>
			<h3>TYPES OF GAS TURBINE ENGINES</h3>
			<div class="arrow">→</div>
		</a>
	</div>
</div>

<style>
	/* Page Container */
	.page-container {
		position: relative;
		z-index: 5;
		min-height: 100vh;
		padding: 8rem 2rem 4rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 4rem;
		padding: 0 1rem;
	}

	.gradient-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 900;
		margin: 0 0 2rem 0;
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
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

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

	.description {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		line-height: 1.8;
		color: var(--font-primary);
		max-width: 900px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 2rem 3rem;
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	/* Modules Container */
	.modules-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		margin-top: 4rem;
	}

	.module-card {
		position: relative;
		background: rgba(10, 47, 53, 0.5);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border: 3px solid rgba(135, 206, 235, 0.4);
		border-radius: 25px;
		padding: 3rem 2.5rem;
		text-decoration: none;
		color: var(--font-secondary);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		cursor: pointer;
	}

	.module-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 217, 102, 0.2), transparent);
		transition: left 0.6s ease;
	}

	.module-card:hover::before {
		left: 100%;
	}

	.module-card:hover {
		transform: translateY(-10px) scale(1.02);
		border-color: var(--ui-yellow);
		box-shadow: 0 20px 60px rgba(255, 217, 102, 0.4), 0 0 40px rgba(135, 206, 235, 0.3);
		background: rgba(10, 47, 53, 0.7);
	}

	.module-number {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 4rem;
		font-weight: 900;
		color: var(--ui-yellow);
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 10px rgba(255, 217, 102, 0.5);
	}

	.module-card h2 {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: var(--font-accent-cyan);
		margin: 0 0 0.5rem 0;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.module-card h3 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		margin: 0;
		line-height: 1.3;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: linear-gradient(
			90deg,
			var(--font-secondary) 0%,
			var(--ui-light-blue) 50%,
			var(--font-secondary) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 3.5s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
	}

	.module-card:hover h3 {
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-yellow) 50%,
			var(--ui-yellow) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 2.5s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(255, 217, 102, 0.8));
	}

	.arrow {
		position: absolute;
		bottom: 2rem;
		right: 2.5rem;
		font-size: 3rem;
		color: var(--ui-light-blue);
		transition: all 0.3s ease;
	}

	.module-card:hover .arrow {
		color: var(--ui-yellow);
		transform: translateX(10px);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-container {
			padding: 6rem 1.5rem 3rem;
		}

		.modules-container {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.module-card {
			padding: 2.5rem 2rem;
		}

		.description {
			padding: 1.5rem 2rem;
			font-size: 1rem;
		}

		.module-number {
			font-size: 3rem;
		}

		.arrow {
			bottom: 1.5rem;
			right: 2rem;
			font-size: 2.5rem;
		}
	}

	@media (max-width: 480px) {
		.gradient-title {
			font-size: 2.5rem;
		}

		.description {
			padding: 1.5rem;
			font-size: 0.95rem;
		}

		.module-card {
			padding: 2rem 1.5rem;
		}
	}
</style>
