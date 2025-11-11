<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="green" />

<div class="page-container">
	<div class="hero-section animate-on-scroll">
		<h1>✈️ Turbofan Zone</h1>
		<p class="hero-subtitle">Explore insights into Turbofan Engine systems</p>
	</div>

	<div class="content-wrapper">
		<div class="info-card animate-scale">
			<div class="card-icon">⚙️</div>
			<h2>Advanced Systems</h2>
			<p>
				Dive deep into the complex mechanics of turbofan engines. Learn how bypass ratios, 
				fan blades, and compression stages work together for maximum efficiency.
			</p>
		</div>

		<div class="info-card animate-scale" style="--delay: 0.2s">
			<div class="card-icon">💨</div>
			<h2>Aerodynamics</h2>
			<p>
				Master the principles of airflow, thrust generation, and fuel efficiency in modern 
				turbofan engines used in commercial and military aviation.
			</p>
		</div>

		<div class="info-card animate-scale" style="--delay: 0.4s">
			<div class="card-icon">📊</div>
			<h2>Performance Analysis</h2>
			<p>
				Analyze engine performance metrics, efficiency curves, and operational parameters 
				through interactive simulations and real-world data.
			</p>
		</div>
	</div>

	<div class="cta-section animate-on-scroll">
		<h2>Explore Turbofan Technology</h2>
		<p>Start your journey into advanced jet propulsion systems!</p>
		<button class="cta-button" onclick={() => goto('/turbofan-zone/module')}>Get Started</button>
	</div>
</div>

<style>
	.page-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.hero-section {
		text-align: center;
		padding: 4rem 2rem;
		background: linear-gradient(135deg, #38C172 0%, #FFA726 100%);
		border-radius: 2rem;
		color: white;
		margin-bottom: 3rem;
		box-shadow: 0 10px 40px rgba(56, 193, 114, 0.3);
	}

	.hero-section h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		margin: 0 0 1rem 0;
		font-weight: 700;
	}

	.hero-subtitle {
		font-family: 'Roboto', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		margin: 0;
		opacity: 0.95;
	}

	.content-wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.info-card {
		background: white;
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--delay, 0s);
	}

	.info-card:hover {
		transform: translateY(-10px) scale(1.02);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
	}

	.card-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.info-card h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.info-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		line-height: 1.8;
		margin: 0;
		font-size: 1.05rem;
	}

	.cta-section {
		text-align: center;
		padding: 4rem 2rem;
		background: linear-gradient(135deg, rgba(56, 193, 114, 0.1) 0%, rgba(255, 167, 38, 0.1) 100%);
		border-radius: 1.5rem;
		border: 2px solid #FFA726;
	}

	.cta-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.cta-section p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin: 0 0 2rem 0;
	}

	.cta-button {
		background: linear-gradient(135deg, #FFA726 0%, #ff9800 100%);
		color: white;
		border: none;
		padding: 1.25rem 3rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 10px 30px rgba(255, 167, 38, 0.3);
	}

	.cta-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 40px rgba(255, 167, 38, 0.4);
	}

	@media (max-width: 768px) {
		.content-wrapper {
			grid-template-columns: 1fr;
		}
	}
</style>
