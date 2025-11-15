<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="green" />

<div class="content-container">
	<nav class="breadcrumb">
		<button on:click={() => goto('/hangar-zone')}>Hangar Zone</button>
		<span>›</span>
		<button on:click={() => goto('/hangar-zone/module')}>Module</button>
		<span>›</span>
		<span class="current">Fundamentals</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">⚙️</div>
			<h1>Fundamental Working Principle</h1>
			<p class="intro">
				Understanding the core principles behind gas turbine engine operation
			</p>
		</header>

		<div class="content-block">
			<h2>The Brayton Cycle</h2>
			<p>
				Gas turbine engines operate on the <strong>Brayton cycle</strong>, a thermodynamic cycle 
				consisting of four main processes:
			</p>

			<div class="process-grid">
				<div class="process-card">
					<div class="process-number">1</div>
					<h3>Compression</h3>
					<p>Air is drawn from the atmosphere and compressed to high pressure and temperature</p>
				</div>
				<div class="process-card">
					<div class="process-number">2</div>
					<h3>Heat Addition (Combustion)</h3>
					<p>Fuel is added to the compressed air and ignited at constant pressure</p>
				</div>
				<div class="process-card">
					<div class="process-number">3</div>
					<h3>Expansion</h3>
					<p>Hot, high-pressure gases expand through the turbine, producing mechanical work</p>
				</div>
				<div class="process-card">
					<div class="process-number">4</div>
					<h3>Heat Rejection</h3>
					<p>Exhaust gases are expelled to the atmosphere</p>
				</div>
			</div>
		</div>

		<div class="content-block highlight-block">
			<h2>Efficiency and Performance</h2>
			<p>
				The efficiency of this cycle increases with the pressure ratio, which typically ranges from 
				<strong>11:1 to 30:1</strong> depending on the engine type. The theoretical efficiency can be 
				expressed as:
			</p>
			<div class="formula-box">
				<p class="formula">
					η = 1 - (P₁/P₂)<sup>(γ-1)/γ</sup>
				</p>
				<p class="formula-description">
					where P₁ and P₂ are inlet and outlet pressures, and γ is the heat capacity ratio
				</p>
			</div>
		</div>

		<div class="image-section">
			<img 
				src="https://pplx-res.cloudinary.com/image/upload/v1755540416/pplx_project_search_images/30a62a4c10b37c5477f373a63ff8bc8c7b7f545f.png"
				alt="Cross-sectional view of a jet engine's compressor section"
			/>
			<p class="image-caption">
				Cross-sectional view of a jet engine's compressor section showing multiple stages of 
				compressor blades and mechanical detail.
			</p>
		</div>

		<div class="content-block">
			<h2>Continuous Flow Operation</h2>
			<p>
				Unlike piston engines where combustion occurs intermittently in cylinders, gas turbines 
				operate as <strong>continuous flow engines</strong>. This means that intake, compression, 
				combustion, and exhaust all happen simultaneously in different sections of the engine, 
				providing smooth and efficient power generation.
			</p>
		</div>

		<div class="key-points">
			<h3>Key Takeaways</h3>
			<ul>
				<li>Gas turbines operate on the Brayton thermodynamic cycle</li>
				<li>Four continuous processes: compression, combustion, expansion, and exhaust</li>
				<li>Efficiency increases with pressure ratio (typically 11:1 to 30:1)</li>
				<li>Continuous flow design provides smooth power generation</li>
				<li>Higher pressure ratios lead to better thermal efficiency</li>
			</ul>
		</div>

		<nav class="section-nav">
			<button class="nav-button secondary" on:click={() => goto('/hangar-zone/module')}>
				← Back to Overview
			</button>
			<button class="nav-button primary" on:click={() => goto('/hangar-zone/module/components')}>
				Next: Components →
			</button>
		</nav>
	</article>
</div>

<style>
	.content-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
	}

	.breadcrumb button {
		background: none;
		border: none;
		color: #38C172;
		cursor: pointer;
		padding: 0.5rem;
		transition: color 0.3s ease;
	}

	.breadcrumb button:hover {
		color: #2da85f;
		text-decoration: underline;
	}

	.breadcrumb span {
		color: #999;
	}

	.breadcrumb .current {
		color: #223A5E;
		font-weight: 600;
	}

	.module-content {
		background: white;
		border-radius: 2rem;
		padding: 3rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 3px solid #38C172;
	}

	.section-header .icon {
		font-size: 5rem;
		margin-bottom: 1rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15px); }
	}

	.section-header h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-weight: 700;
	}

	.intro {
		font-family: 'Roboto', sans-serif;
		font-size: 1.3rem;
		color: #666;
		margin: 0;
	}

	.content-block {
		margin-bottom: 3rem;
	}

	.content-block h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.content-block p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.15rem;
		color: #555;
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.process-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.process-card {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		padding: 2rem;
		border-radius: 1rem;
		border-left: 5px solid #38C172;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.process-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(56, 193, 114, 0.2);
	}

	.process-number {
		background: #38C172;
		color: white;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.process-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.process-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	.highlight-block {
		background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
		padding: 2rem;
		border-radius: 1rem;
		border-left: 5px solid #38C172;
	}

	.formula-box {
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		margin-top: 1.5rem;
		text-align: center;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
	}

	.formula {
		font-family: 'Georgia', serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	.formula-description {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		font-style: italic;
		margin: 0;
	}

	.image-section {
		margin: 3rem 0;
		text-align: center;
	}

	.image-section img {
		width: 100%;
		max-width: 800px;
		border-radius: 1rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
		margin-bottom: 1rem;
	}

	.image-caption {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		font-style: italic;
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.key-points {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		margin-top: 3rem;
	}

	.key-points h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.key-points ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.key-points li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		padding: 0.75rem 0 0.75rem 2rem;
		position: relative;
		line-height: 1.6;
	}

	.key-points li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: #38C172;
		font-weight: bold;
		font-size: 1.3rem;
	}

	.section-nav {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 2px solid #e9ecef;
	}

	.nav-button {
		padding: 1rem 2rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
	}

	.nav-button.primary {
		background: linear-gradient(135deg, #38C172 0%, #2da85f 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(56, 193, 114, 0.3);
	}

	.nav-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(56, 193, 114, 0.4);
	}

	.nav-button.secondary {
		background: white;
		color: #223A5E;
		border: 2px solid #223A5E;
	}

	.nav-button.secondary:hover {
		background: #223A5E;
		color: white;
	}

	@media (max-width: 768px) {
		.module-content {
			padding: 2rem 1.5rem;
		}

		.process-grid {
			grid-template-columns: 1fr;
		}

		.section-nav {
			flex-direction: column;
		}

		.nav-button {
			width: 100%;
		}
	}
</style>
