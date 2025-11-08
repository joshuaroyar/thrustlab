<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="orange" />

<div class="content-container">
	<nav class="breadcrumb">
		<button onclick={() => goto('/turbofan-zone')}>Turbofan Zone</button>
		<span>›</span>
		<button onclick={() => goto('/turbofan-zone/module')}>Module</button>
		<span>›</span>
		<span class="current">Working Principles</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">⚙️</div>
			<h1>Working Principles</h1>
			<p class="intro">Understanding how turbofan engines generate thrust through bypass design</p>
		</header>

		<div class="content-block">
			<h2>🔄 How Turbofan Engines Work</h2>
			<p>
				The fundamental operation of a turbofan engine follows the principle of 
				<strong>air intake, compression, combustion, and expulsion</strong>. However, what 
				distinguishes turbofans from traditional turbojet engines is their unique 
				<strong>bypass design</strong>.
			</p>
			<p>
				The incoming air is separated into two streams behind the fan rotor: a small portion 
				enters the <strong>core engine</strong> while the majority bypasses the core, traveling 
				around the outside of the engine.
			</p>

			<div class="process-grid">
			<div class="process-card">
				<div class="process-number">1</div>
				<h3>Intake</h3>
				<p>Air enters through the inlet, where a rounded lip ensures smooth, undistorted airflow</p>
			</div>
			<div class="process-card">
				<div class="process-number">2</div>
				<h3>Compression</h3>
				<p>Air is compressed in stages, with the bypass air producing the majority of the engine's thrust</p>
			</div>
			<div class="process-card">
				<div class="process-number">3</div>
				<h3>Combustion</h3>
				<p>The core air is further compressed and mixed with fuel, combusting at approximately 1,700°C</p>
			</div>
			<div class="process-card">
				<div class="process-number">4</div>
				<h3>Expansion</h3>
				<p>Hot gases expand through turbines, expending up to 60% of their energy to drive the compressor and fan</p>
			</div>
			<div class="process-card">
				<div class="process-number">5</div>
				<h3>Thrust Generation</h3>
				<p>Both the core exhaust and bypass airflow contribute to forward thrust</p>
			</div>
			</div>
		</div>

		<div class="content-block">
			<h2>🔩 The Two-Spool Configuration</h2>
			<p>
				Turbofan engines employ a <strong>two-spool architecture</strong>, where the core engine 
				is surrounded by a fan in the front and an additional turbine at the rear.
			</p>

			<div class="spool-diagram">
			<div class="spool-box lp-spool">
				<h3>Low-Pressure (LP) Spool</h3>
				<p>Connects the large fan to the low-pressure turbine</p>
				<div class="spool-icon">🔄</div>
			</div>
			<div class="spool-box hp-spool">
				<h3>High-Pressure (HP) Spool</h3>
				<p>Connects the high-pressure compressor to the high-pressure turbine</p>
				<div class="spool-icon">⚡</div>
			</div>
		</div>

			<div class="info-callout">
				<h3>💡 Key Insight</h3>
				<p>
					The fan shaft passes through the core shaft for mechanical reasons, allowing each spool 
					to rotate at different speeds for optimal efficiency. Modern advanced engines have 
					additional spools for even higher performance.
				</p>
			</div>
		</div>

		<div class="image-section">
			<img 
				src="https://pplx-res.cloudinary.com/image/upload/v1755096969/pplx_project_search_images/b7eae9f963151267f92aef91343a4514f5e27064.png" 
				alt="Turbofan engine schematic showing fan, compressor, combustor, turbine, and mixer/nozzle"
				class="diagram-image"
			/>
				<p class="image-caption">
					A labeled schematic diagram illustrating the main parts of a turbofan engine including 
					fan, compressor, combustor, turbine, and mixer/nozzle.
				</p>
			</div>

		<nav class="section-nav">
			<button class="nav-button secondary" onclick={() => goto('/turbofan-zone/module')}>
				← Back to Overview
			</button>
			<button class="nav-button primary" onclick={() => goto('/turbofan-zone/module/components')}>
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
		color: #FFA726;
		cursor: pointer;
		padding: 0.5rem;
		transition: color 0.3s ease;
	}

	.breadcrumb button:hover {
		color: #ff9800;
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
		border-bottom: 3px solid #FFA726;
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
		border-left: 5px solid #FFA726;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.process-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(255, 167, 38, 0.2);
	}

	.process-number {
		background: #FFA726;
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

	.spool-diagram {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.spool-box {
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.lp-spool {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.hp-spool {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
	}

	.spool-box h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
	}

	.spool-box p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		margin: 0 0 1rem 0;
		color: rgba(255, 255, 255, 0.95);
	}

	.spool-icon {
		font-size: 3rem;
		margin-top: 1rem;
	}

	.info-callout {
		background: linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 167, 38, 0.05) 100%);
		padding: 2rem;
		border-radius: 1rem;
		border-left: 5px solid #FFA726;
		margin-top: 2rem;
	}

	.info-callout h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.info-callout p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #666;
		margin: 0;
		line-height: 1.8;
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
		background: linear-gradient(135deg, #FFA726 0%, #ff9800 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(255, 167, 38, 0.3);
	}

	.nav-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(255, 167, 38, 0.4);
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

		.spool-diagram {
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
