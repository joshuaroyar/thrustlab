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
		<span class="current">Applications</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">🚀</div>
			<h1>Applications & Performance</h1>
			<p class="intro">
				Real-world applications and performance optimization techniques
			</p>
		</header>

		<div class="content-block">
			<h2>Aviation</h2>
			<div class="application-card primary">
				<div class="card-header">
					<span class="card-icon">✈️</span>
					<h3>The Most Important Application</h3>
				</div>
				<p>
					Gas turbines provide propulsion for <strong>commercial airliners, military aircraft, 
					helicopters, and business jets</strong>. Jet engines transformed aviation by enabling 
					long-range, high-speed flight that was impossible with piston engines.
				</p>
				<div class="stats-row">
					<div class="stat">
						<span class="stat-value">~40,000</span>
						<span class="stat-label">Commercial Aircraft Worldwide</span>
					</div>
					<div class="stat">
						<span class="stat-value">900+ km/h</span>
						<span class="stat-label">Typical Cruise Speed</span>
					</div>
					<div class="stat">
						<span class="stat-value">15,000+ km</span>
						<span class="stat-label">Maximum Range</span>
					</div>
				</div>
			</div>
		</div>

		<div class="applications-grid">
			<div class="app-card">
				<div class="app-icon">⚡</div>
				<h3>Power Generation</h3>
				<p>
					Gas turbines serve as <strong>peak-load power plants</strong> that can start within minutes, 
					complementing slower-starting steam plants. Combined-cycle configurations pairing gas turbines 
					with steam turbines achieve overall efficiencies <strong>exceeding 60%</strong>.
				</p>
				<div class="highlight-stat">60%+ Efficiency</div>
			</div>

			<div class="app-card">
				<div class="app-icon">🚢</div>
				<h3>Marine Propulsion</h3>
				<p>
					High power-to-weight ratios make gas turbines ideal for <strong>naval vessels, high-speed 
					ferries, and luxury yachts</strong>. They provide rapid acceleration and maneuverability 
					crucial for military applications.
				</p>
				<div class="highlight-stat">Quick Startup</div>
			</div>

			<div class="app-card">
				<div class="app-icon">🏭</div>
				<h3>Industrial Processes</h3>
				<p>
					Gas turbines drive <strong>compressors, pumps, and mechanical equipment</strong> in 
					refineries, petrochemical plants, and manufacturing facilities. Their reliability and 
					fuel flexibility make them invaluable.
				</p>
				<div class="highlight-stat">24/7 Operation</div>
			</div>
		</div>

		<div class="advantages-section">
			<h2>Key Advantages</h2>
			<div class="advantages-grid">
				<div class="advantage-card">
					<div class="advantage-icon">💪</div>
					<h4>High Power-to-Weight Ratio</h4>
					<p>Exceptional power output relative to engine weight</p>
				</div>
				<div class="advantage-card">
					<div class="advantage-icon">📦</div>
					<h4>Compact Size</h4>
					<p>Small footprint with quick startup capability</p>
				</div>
				<div class="advantage-card">
					<div class="advantage-icon">🎵</div>
					<h4>Smooth Operation</h4>
					<p>Vibration-free performance for comfort and reliability</p>
				</div>
				<div class="advantage-card">
					<div class="advantage-icon">🌱</div>
					<h4>Lower Emissions</h4>
					<p>Cleaner than coal-fired plants</p>
				</div>
				<div class="advantage-card">
					<div class="advantage-icon">⛽</div>
					<h4>Fuel Flexibility</h4>
					<p>Operates on natural gas, jet fuel, or diesel</p>
				</div>
			</div>
		</div>

		<div class="challenges-section">
			<h2>Challenges & Considerations</h2>
			<div class="challenges-list">
				<div class="challenge-item">
					<span class="challenge-icon">⚠️</span>
					<div class="challenge-content">
						<h4>Efficiency Trade-offs</h4>
						<p>Lower standalone efficiency (33-40% simple cycle) compared to diesel engines</p>
					</div>
				</div>
				<div class="challenge-item">
					<span class="challenge-icon">💰</span>
					<div class="challenge-content">
						<h4>High Initial Costs</h4>
						<p>Advanced designs require significant upfront investment</p>
					</div>
				</div>
				<div class="challenge-item">
					<span class="challenge-icon">🔥</span>
					<div class="challenge-content">
						<h4>Material Requirements</h4>
						<p>Stringent demands for high-temperature component materials</p>
					</div>
				</div>
				<div class="challenge-item">
					<span class="challenge-icon">🔊</span>
					<div class="challenge-content">
						<h4>Noise Generation</h4>
						<p>Significant noise levels in aviation applications</p>
					</div>
				</div>
				<div class="challenge-item">
					<span class="challenge-icon">🌡️</span>
					<div class="challenge-content">
						<h4>Environmental Sensitivity</h4>
						<p>Performance affected by inlet air temperature and humidity</p>
					</div>
				</div>
			</div>
		</div>

		<div class="optimization-section">
			<h2>Performance Optimization Technologies</h2>
			<p class="section-intro">
				Modern engines incorporate numerous technologies to maximize efficiency and performance:
			</p>

			<div class="optimization-grid">
				<div class="opt-card">
					<h3>❄️ Intercooling</h3>
					<p>Cooling air between compressor stages reduces compression work and improves overall cycle efficiency.</p>
				</div>
				<div class="opt-card">
					<h3>♻️ Regeneration</h3>
					<p>Recovering exhaust heat to preheat compressed air before combustion, reducing fuel consumption.</p>
				</div>
				<div class="opt-card">
					<h3>🔧 Variable Geometry</h3>
					<p>Adjustable stator vanes and nozzles optimize performance across operating ranges.</p>
				</div>
				<div class="opt-card">
					<h3>💨 Advanced Aerodynamics</h3>
					<p>Computational fluid dynamics enables highly efficient blade designs with minimal losses.</p>
				</div>
				<div class="opt-card">
					<h3>📊 Health Monitoring</h3>
					<p>Sensors track temperatures, pressures, and vibrations to enable predictive maintenance.</p>
				</div>
				<div class="opt-card">
					<h3>🎯 Precision Control</h3>
					<p>Advanced engine control systems optimize fuel flow and geometry in real-time.</p>
				</div>
			</div>
		</div>

		<div class="future-section">
			<h2>The Future of Gas Turbines</h2>
			<div class="future-content">
				<p>
					Gas turbine technology continues advancing through <strong>materials science breakthroughs, 
					improved cooling techniques, and aerodynamic refinements</strong>. The ongoing pursuit of higher 
					efficiency, reduced emissions, and improved reliability ensures gas turbines will remain central 
					to aviation and power generation for decades to come.
				</p>
				<div class="future-goals">
					<div class="goal-item">
						<div class="goal-icon">🎯</div>
						<div class="goal-text">
							<h4>Efficiency Goals</h4>
							<p>Combined-cycle plants targeting 65%+ efficiency</p>
						</div>
					</div>
					<div class="goal-item">
						<div class="goal-icon">🌍</div>
						<div class="goal-text">
							<h4>Environmental Impact</h4>
							<p>Reduced NOx emissions and sustainable aviation fuels</p>
						</div>
					</div>
					<div class="goal-item">
						<div class="goal-icon">🔬</div>
						<div class="goal-text">
							<h4>Material Innovation</h4>
							<p>Next-gen CMCs and advanced cooling systems</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="key-points">
			<h3>Key Takeaways</h3>
			<ul>
				<li>Aviation remains the most important application for gas turbines</li>
				<li>Combined-cycle power plants achieve 60%+ efficiency</li>
				<li>High power-to-weight ratio and compact size are key advantages</li>
				<li>Performance optimization through intercooling, regeneration, and variable geometry</li>
				<li>Continuous innovation drives improvements in efficiency and emissions</li>
			</ul>
		</div>

		<div class="completion-section">
			<h2>🎉 Module Complete!</h2>
			<p>
				Congratulations on completing the Gas Turbine Engines module. You've learned about the 
				fundamental principles, components, configurations, materials, and applications of these 
				remarkable machines that power our modern world.
			</p>
			<div class="completion-actions">
				<button class="action-button secondary" on:click={() => goto('/hangar-zone/module')}>
					← Back to Overview
				</button>
				<button class="action-button primary" on:click={() => goto('/test-bay')}>
					Test Your Knowledge →
				</button>
			</div>
		</div>

		<nav class="section-nav">
			<button class="nav-button secondary" on:click={() => goto('/hangar-zone/module/materials')}>
				← Previous: Materials
			</button>
			<button class="nav-button primary" on:click={() => goto('/hangar-zone')}>
				Return to Hangar Zone →
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

	.application-card {
		background: linear-gradient(135deg, #38C172 0%, #2da85f 100%);
		padding: 2.5rem;
		border-radius: 1.5rem;
		color: white;
		margin-bottom: 2rem;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.card-icon {
		font-size: 3rem;
	}

	.card-header h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		margin: 0;
	}

	.application-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.15rem;
		line-height: 1.8;
		margin-bottom: 2rem;
		opacity: 0.95;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.stat {
		background: rgba(255, 255, 255, 0.2);
		padding: 1.5rem;
		border-radius: 1rem;
		text-align: center;
		backdrop-filter: blur(10px);
	}

	.stat-value {
		display: block;
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		display: block;
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		opacity: 0.9;
	}

	.applications-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.app-card {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		border-left: 5px solid #38C172;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.app-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(56, 193, 114, 0.2);
	}

	.app-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.app-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.6rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.app-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.highlight-stat {
		background: #38C172;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1.1rem;
		display: inline-block;
	}

	.advantages-section {
		background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
		padding: 2.5rem;
		border-radius: 1.5rem;
		margin-bottom: 3rem;
	}

	.advantages-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 2rem 0;
		text-align: center;
	}

	.advantages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.advantage-card {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.advantage-icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
	}

	.advantage-card h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
		color: #223A5E;
		margin: 0 0 0.5rem 0;
	}

	.advantage-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}

	.challenges-section {
		margin-bottom: 3rem;
	}

	.challenges-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.challenges-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.challenge-item {
		display: flex;
		gap: 1.5rem;
		background: #fff3e0;
		padding: 1.5rem;
		border-radius: 1rem;
		border-left: 5px solid #FFA726;
	}

	.challenge-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.challenge-content h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.5rem 0;
	}

	.challenge-content p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		margin: 0;
		line-height: 1.6;
	}

	.optimization-section {
		margin-bottom: 3rem;
	}

	.optimization-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.section-intro {
		font-family: 'Roboto', sans-serif;
		font-size: 1.15rem;
		color: #555;
		line-height: 1.8;
		margin-bottom: 2rem;
	}

	.optimization-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.opt-card {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		border-top: 4px solid #38C172;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.opt-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(56, 193, 114, 0.2);
	}

	.opt-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.opt-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		margin: 0;
		line-height: 1.6;
	}

	.future-section {
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		padding: 3rem;
		border-radius: 1.5rem;
		color: white;
		margin-bottom: 3rem;
	}

	.future-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.future-content p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.15rem;
		line-height: 1.8;
		margin-bottom: 2rem;
		opacity: 0.95;
	}

	.future-goals {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.goal-item {
		display: flex;
		gap: 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 1.5rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
	}

	.goal-icon {
		font-size: 2.5rem;
		flex-shrink: 0;
	}

	.goal-text h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		margin: 0 0 0.5rem 0;
	}

	.goal-text p {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		margin: 0;
		opacity: 0.9;
		line-height: 1.5;
	}

	.key-points {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		margin-bottom: 3rem;
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

	.completion-section {
		background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
		padding: 3rem;
		border-radius: 1.5rem;
		text-align: center;
		margin-bottom: 3rem;
	}

	.completion-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.completion-section p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.15rem;
		color: #555;
		line-height: 1.8;
		max-width: 700px;
		margin: 0 auto 2rem auto;
	}

	.completion-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.action-button {
		padding: 1.25rem 2.5rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
	}

	.action-button.primary {
		background: linear-gradient(135deg, #38C172 0%, #2da85f 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(56, 193, 114, 0.3);
	}

	.action-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(56, 193, 114, 0.4);
	}

	.action-button.secondary {
		background: white;
		color: #223A5E;
		border: 2px solid #223A5E;
	}

	.action-button.secondary:hover {
		background: #223A5E;
		color: white;
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

		.section-nav, .completion-actions {
			flex-direction: column;
		}

		.nav-button, .action-button {
			width: 100%;
		}
	}
</style>
