<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
</script>

<AnimatedBackground variant="orange" />

<div class="page-container">
	<div class="hero-section animate-on-scroll">
		<h1>🔧 Overhaul Station</h1>
		<p class="hero-subtitle">Interact with 3D models of engine assemblies</p>
	</div>

	<div class="content-wrapper">
		<div class="info-card animate-slide-left">
			<div class="card-icon">🎮</div>
			<h2>3D Model Viewer</h2>
			<p>
				Explore detailed 3D models of gas turbine and turbofan engines. Rotate, zoom, 
				and inspect every component in an immersive interactive environment.
			</p>
		</div>

		<div class="info-card animate-slide-right" style="--delay: 0.2s">
			<div class="card-icon">🔩</div>
			<h2>Assembly & Disassembly</h2>
			<p>
				Practice assembly and disassembly procedures with step-by-step guidance. 
				Learn proper techniques and safety protocols for engine maintenance.
			</p>
		</div>

		<div class="info-card animate-scale" style="--delay: 0.4s">
			<div class="card-icon">🛠️</div>
			<h2>Component Analysis</h2>
			<p>
				Study individual components in detail. Understand their function, material 
				properties, and how they integrate into the larger engine system.
			</p>
		</div>
	</div>

	<div class="cta-section animate-on-scroll">
		<h2>Start Your Virtual Overhaul</h2>
		<p>Hands-on experience with engine assembly in a safe, virtual environment!</p>
		<button class="cta-button">Enter 3D Viewer</button>
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
		background: linear-gradient(135deg, #FFA726 0%, #FF3C7E 100%);
		border-radius: 2rem;
		color: white;
		margin-bottom: 3rem;
		box-shadow: 0 10px 40px rgba(255, 167, 38, 0.3);
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
		transform: translateY(-10px) rotate(1deg);
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
		background: linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 60, 126, 0.1) 100%);
		border-radius: 1.5rem;
		border: 2px solid #FF3C7E;
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
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: white;
		border: none;
		padding: 1.25rem 3rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 10px 30px rgba(255, 60, 126, 0.3);
	}

	.cta-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 40px rgba(255, 60, 126, 0.4);
	}

	@media (max-width: 768px) {
		.content-wrapper {
			grid-template-columns: 1fr;
		}
	}
</style>
