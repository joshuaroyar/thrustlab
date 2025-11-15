<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="magenta" />

<div class="content-container">
	<div class="breadcrumb">
		<button on:click={() => goto('/turbofan-zone')}>Turbofan Zone</button>
		<span>›</span>
		<button on:click={() => goto('/turbofan-zone/module')}>Module</button>
		<span>›</span>
		<span>Bypass Ratio</span>
	</div>

	<div class="module-content">
		<div class="section-header">
			<h1>📊 Bypass Ratio</h1>
			<p>Understanding the key design parameter that defines turbofan performance</p>
		</div>

	<div class="content-section">
		<h2>🎯 What is Bypass Ratio?</h2>
		<p>
			The <strong>bypass ratio (BPR)</strong> represents the ratio of mass airflow through the 
			bypass duct to mass airflow entering the core.
		</p>
		<div class="example-box">
			<h3>💡 Example</h3>
			<p>
				A <strong>10:1 bypass ratio</strong> means 10 kg of air bypasses the core for every 1 kg entering it.
			</p>
			<div class="ratio-visual">
				<div class="bypass-flow">
					<div class="flow-label">Bypass Air</div>
					<div class="flow-amount">10 kg</div>
				</div>
				<div class="ratio-symbol">:</div>
				<div class="core-flow">
					<div class="flow-label">Core Air</div>
					<div class="flow-amount">1 kg</div>
				</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>🏷️ Engine Classifications</h2>
		<p>Turbofan engines are classified based on their bypass ratio:</p>

		<div class="classification-grid">
			<div class="class-card low">
				<div class="class-header">
					<div class="class-icon">⚔️</div>
					<h3>Low-Bypass</h3>
				</div>
				<div class="bpr-badge">BPR 2-4</div>
				<p class="class-desc">
					Used in combat aircraft requiring high power-to-weight ratios and supersonic capability
				</p>
				<div class="features">
					<h4>Key Features:</h4>
					<ul>
						<li>High thrust-to-weight ratio</li>
						<li>Supersonic performance</li>
						<li>Military applications</li>
						<li>Compact design</li>
					</ul>
				</div>
			</div>

			<div class="class-card medium">
				<div class="class-header">
					<div class="class-icon">✈️</div>
					<h3>Medium-Bypass</h3>
				</div>
				<div class="bpr-badge">BPR 2-4</div>
				<p class="class-desc">
					Used in business jets balancing performance and efficiency
				</p>
				<div class="features">
					<h4>Key Features:</h4>
					<ul>
						<li>Balanced performance</li>
						<li>Business aviation</li>
						<li>Regional aircraft</li>
						<li>Moderate efficiency</li>
					</ul>
				</div>
			</div>

			<div class="class-card high">
				<div class="class-header">
					<div class="class-icon">🛫</div>
					<h3>High-Bypass</h3>
				</div>
				<div class="bpr-badge">BPR 5-8</div>
				<p class="class-desc">
					Standard for commercial passenger aircraft with excellent fuel efficiency
				</p>
				<div class="features">
					<h4>Key Features:</h4>
					<ul>
						<li>Excellent fuel efficiency</li>
						<li>Commercial aviation standard</li>
						<li>Lower noise levels</li>
						<li>Long-range capability</li>
					</ul>
				</div>
			</div>

			<div class="class-card ultrahigh">
				<div class="class-header">
					<div class="class-icon">🚀</div>
					<h3>Ultrahigh-Bypass</h3>
				</div>
				<div class="bpr-badge">BPR 9-15+</div>
				<p class="class-desc">
					Newest generation for maximum fuel efficiency with very large fan diameters
				</p>
				<div class="features">
					<h4>Key Features:</h4>
					<ul>
						<li>Maximum fuel efficiency</li>
						<li>Very large fan diameter</li>
						<li>Latest technology</li>
						<li>Environmental benefits</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>⚖️ Trade-offs and Considerations</h2>
		
		<div class="comparison-grid">
			<div class="comparison-card advantages">
				<h3>✅ Higher Bypass Ratio Advantages</h3>
				<ul>
					<li><strong>Lower fuel consumption</strong> for the same thrust</li>
					<li><strong>Reduced noise</strong> due to slower exhaust velocity</li>
					<li><strong>Better propulsive efficiency</strong></li>
					<li><strong>Critical for commercial aviation</strong> economics</li>
					<li><strong>Environmental benefits</strong> - reduced emissions</li>
				</ul>
			</div>

			<div class="comparison-card challenges">
				<h3>⚠️ Higher Bypass Ratio Challenges</h3>
				<ul>
					<li><strong>Larger, heavier components</strong> required</li>
					<li><strong>Increased engine diameter</strong> - ground clearance issues</li>
					<li><strong>More complex thrust-reversal systems</strong></li>
					<li><strong>Higher manufacturing costs</strong></li>
					<li><strong>Installation constraints</strong> on aircraft design</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>🔬 Impact on Performance</h2>
		<div class="performance-visual">
			<div class="performance-item">
				<div class="perf-icon">⛽</div>
				<h4>Fuel Efficiency</h4>
				<div class="perf-bar">
					<div class="perf-fill" style="width: 90%; background: #4CAF50;"></div>
				</div>
				<p>Ultrahigh-bypass engines achieve up to 15% better fuel efficiency</p>
			</div>

			<div class="performance-item">
				<div class="perf-icon">🔊</div>
				<h4>Noise Reduction</h4>
				<div class="perf-bar">
					<div class="perf-fill" style="width: 85%; background: #2196F3;"></div>
				</div>
				<p>Higher bypass ratios significantly reduce engine noise</p>
			</div>

			<div class="performance-item">
				<div class="perf-icon">💨</div>
				<h4>Thrust Output</h4>
				<div class="perf-bar">
					<div class="perf-fill" style="width: 95%; background: #FF9800;"></div>
				</div>
				<p>Maintains high thrust while improving overall efficiency</p>
			</div>
		</div>
	</div>

		<div class="section-nav">
			<button on:click={() => goto('/turbofan-zone/module/components')} class="nav-button secondary">
				← Back: Major Components
			</button>
			<button on:click={() => goto('/turbofan-zone/module/materials')} class="nav-button primary">
				Next: Materials & Thermal Management →
			</button>
		</div>
	</div>
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
		flex-wrap: wrap;
	}

	.breadcrumb button {
		color: #E91E63;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
	}

	.breadcrumb button:hover {
		background: rgba(233, 30, 99, 0.1);
	}

	.breadcrumb span {
		color: #666;
	}

	.module-content {
		background: white;
		border-radius: 2rem;
		padding: 3rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
	}

	.section-header {
		text-align: center;
		padding-bottom: 2rem;
		border-bottom: 3px solid #E91E63;
		margin-bottom: 3rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.section-header h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-weight: 700;
	}

	.section-header p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin: 0;
	}

	.content-section {
		margin-bottom: 3rem;
	}

	.content-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.content-section p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #666;
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.example-box {
		background: linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(233, 30, 99, 0.05) 100%);
		padding: 2rem;
		border-radius: 1rem;
		border-left: 4px solid #E91E63;
		margin-top: 2rem;
	}

	.example-box h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.example-box p {
		margin-bottom: 1.5rem;
	}

	.ratio-visual {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	.bypass-flow, .core-flow {
		background: white;
		padding: 1.5rem 2rem;
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.bypass-flow {
		border: 3px solid #4CAF50;
	}

	.core-flow {
		border: 3px solid #FF9800;
	}

	.flow-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.flow-amount {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		font-weight: bold;
		color: #223A5E;
	}

	.ratio-symbol {
		font-size: 3rem;
		font-weight: bold;
		color: #E91E63;
	}

	.classification-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.class-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		border: 3px solid;
	}

	.class-card:hover {
		transform: translateY(-5px);
	}

	.class-card.low {
		border-color: #f44336;
	}

	.class-card.medium {
		border-color: #FF9800;
	}

	.class-card.high {
		border-color: #4CAF50;
	}

	.class-card.ultrahigh {
		border-color: #9C27B0;
	}

	.class-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.class-icon {
		font-size: 2.5rem;
	}

	.class-header h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0;
	}

	.bpr-badge {
		display: inline-block;
		background: #E91E63;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-family: 'Montserrat', sans-serif;
		font-weight: bold;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.class-desc {
		font-family: 'Roboto', sans-serif;
		color: #666;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.features h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.features ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features li {
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		color: #666;
		padding: 0.4rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.features li::before {
		content: '▸';
		position: absolute;
		left: 0;
		color: #E91E63;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.comparison-card {
		padding: 2rem;
		border-radius: 1rem;
		border: 2px solid;
	}

	.comparison-card.advantages {
		background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
		border-color: #4CAF50;
	}

	.comparison-card.challenges {
		background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
		border-color: #FF9800;
	}

	.comparison-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.comparison-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.comparison-card li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #666;
		padding: 0.75rem 0;
		line-height: 1.6;
	}

	.performance-visual {
		margin-top: 2rem;
	}

	.performance-item {
		margin-bottom: 2rem;
	}

	.performance-item:last-child {
		margin-bottom: 0;
	}

	.perf-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.performance-item h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.perf-bar {
		width: 100%;
		height: 30px;
		background: #f0f0f0;
		border-radius: 15px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.perf-fill {
		height: 100%;
		border-radius: 15px;
		transition: width 1s ease;
	}

	.performance-item p {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		margin: 0;
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
		background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(233, 30, 99, 0.3);
	}

	.nav-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(233, 30, 99, 0.4);
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

		.classification-grid {
			grid-template-columns: 1fr;
		}

		.comparison-grid {
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
