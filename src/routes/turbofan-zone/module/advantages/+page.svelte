<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="blue" />

<div class="content-container">
	<div class="breadcrumb">
		<button on:click={() => goto('/turbofan-zone')}>Turbofan Zone</button>
		<span>›</span>
		<button on:click={() => goto('/turbofan-zone/module')}>Module</button>
		<span>›</span>
		<span>Why Turbofans Are Superior</span>
	</div>

	<div class="module-content">
		<div class="section-header">
			<h1>🚀 Why Turbofans Are Superior</h1>
			<p>Understanding the dominance of turbofan engines in modern aviation</p>
		</div>

	<div class="content-section hero">
		<div class="hero-content">
			<h2>💡 The Revolutionary Design</h2>
			<p class="highlight-text">
				Turbofan engines dominate modern aviation because they generate <strong>significantly 
				more thrust</strong> than traditional turbojets while using <strong>nearly the same 
				fuel quantity</strong>, resulting in exceptional fuel efficiency.
			</p>
			<p>
				The separation of airflow allows most of the engine's mass flow to bypass the hot core, 
				reducing fuel consumption and environmental impact while maintaining the high thrust 
				required for commercial aviation.
			</p>
		</div>
		<div class="hero-icon">✈️</div>
	</div>

	<div class="content-section">
		<h2>🎯 Key Advantages</h2>

		<div class="advantages-grid">
			<div class="advantage-card fuel">
				<div class="card-header">
					<div class="card-icon">⛽</div>
					<h3>Exceptional Fuel Efficiency</h3>
				</div>
				<p>
					High bypass ratios allow turbofans to generate thrust more efficiently than turbojets. 
					Modern ultrahigh-bypass engines achieve up to 15% better fuel efficiency than previous 
					generations, dramatically reducing operating costs for airlines.
				</p>
				<div class="benefit-tag">💰 Lower Operating Costs</div>
			</div>

			<div class="advantage-card thrust">
				<div class="card-header">
					<div class="card-icon">💪</div>
					<h3>High Thrust Output</h3>
				</div>
				<p>
					The large fan accelerates massive volumes of air through the bypass duct, generating 
					the majority of the engine's thrust. This design produces more thrust for the same 
					core engine size compared to turbojets.
				</p>
				<div class="benefit-tag">🚀 Maximum Performance</div>
			</div>

			<div class="advantage-card noise">
				<div class="card-header">
					<div class="card-icon">🔇</div>
					<h3>Reduced Noise Levels</h3>
				</div>
				<p>
					Bypass air exits at lower velocities than core exhaust, significantly reducing jet 
					noise. This makes turbofans much quieter than turbojets, meeting stringent airport 
					noise regulations and improving passenger comfort.
				</p>
				<div class="benefit-tag">🏙️ Community Friendly</div>
			</div>

			<div class="advantage-card environment">
				<div class="card-header">
					<div class="card-icon">🌍</div>
					<h3>Environmental Benefits</h3>
				</div>
				<p>
					Lower fuel consumption directly translates to reduced carbon emissions. Modern 
					turbofans produce fewer pollutants and greenhouse gases per passenger-mile than 
					older engine technologies.
				</p>
				<div class="benefit-tag">♻️ Sustainable Aviation</div>
			</div>

			<div class="advantage-card reliability">
				<div class="card-header">
					<div class="card-icon">🛡️</div>
					<h3>Proven Reliability</h3>
				</div>
				<p>
					Decades of refinement have made turbofan engines exceptionally reliable. Modern 
					engines can operate for thousands of hours between major maintenance events, with 
					dispatch reliability exceeding 99.9%.
				</p>
				<div class="benefit-tag">✅ Industry Standard</div>
			</div>

			<div class="advantage-card range">
				<div class="card-header">
					<div class="card-icon">🌐</div>
					<h3>Extended Range Capability</h3>
				</div>
				<p>
					Superior fuel efficiency enables longer flight ranges without refueling. Modern 
					wide-body aircraft powered by high-bypass turbofans can fly non-stop for over 
					8,000 nautical miles.
				</p>
				<div class="benefit-tag">✈️ Global Connectivity</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>📊 Performance Comparison</h2>
		<p>How turbofans compare to traditional turbojet engines:</p>

		<div class="comparison-table">
			<div class="table-header">
				<div class="header-cell metric">Metric</div>
				<div class="header-cell turbojet">Turbojet</div>
				<div class="header-cell turbofan">Turbofan</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Fuel Efficiency</div>
				<div class="cell turbojet">⭐⭐⭐</div>
				<div class="cell turbofan winner">⭐⭐⭐⭐⭐</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Thrust at Subsonic Speeds</div>
				<div class="cell turbojet">⭐⭐⭐</div>
				<div class="cell turbofan winner">⭐⭐⭐⭐⭐</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Noise Level</div>
				<div class="cell turbojet">⭐⭐</div>
				<div class="cell turbofan winner">⭐⭐⭐⭐⭐</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Environmental Impact</div>
				<div class="cell turbojet">⭐⭐</div>
				<div class="cell turbofan winner">⭐⭐⭐⭐⭐</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Supersonic Performance</div>
				<div class="cell turbojet winner">⭐⭐⭐⭐⭐</div>
				<div class="cell turbofan">⭐⭐⭐</div>
			</div>

			<div class="table-row">
				<div class="cell metric">Engine Size/Weight</div>
				<div class="cell turbojet winner">⭐⭐⭐⭐</div>
				<div class="cell turbofan">⭐⭐⭐</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>🌟 Industry Adoption</h2>
		
		<div class="adoption-stats">
			<div class="stat-box">
				<div class="stat-number">~100%</div>
				<p>Of modern commercial aircraft use turbofan engines</p>
			</div>
			<div class="stat-box">
				<div class="stat-number">50+ years</div>
				<p>Of continuous development and refinement</p>
			</div>
			<div class="stat-box">
				<div class="stat-number">99.9%+</div>
				<p>Dispatch reliability for modern turbofans</p>
			</div>
		</div>

		<div class="info-callout">
			<h3>📈 The Future of Turbofan Technology</h3>
			<p>
				The aviation industry continues to push turbofan technology forward with innovations like 
				geared turbofans, open rotor designs, and hybrid-electric propulsion systems. Next-generation 
				engines promise even greater efficiency, lower emissions, and quieter operation as the industry 
				works toward sustainable aviation goals.
			</p>
		</div>
	</div>

		<div class="completion-section">
			<div class="completion-content">
				<div class="completion-icon">🎉</div>
				<h2>Congratulations!</h2>
				<p>
					You've completed the Turbofan Zone learning module! You now understand the working 
					principles, components, bypass ratios, materials, and advantages that make turbofan 
					engines the dominant propulsion system in modern aviation.
				</p>
				<div class="completion-actions">
					<button on:click={() => goto('/test-bay')} class="action-btn primary">
						Test Your Knowledge 🧪
					</button>
					<button on:click={() => goto('/turbofan-zone')} class="action-btn secondary">
						Return to Turbofan Zone
					</button>
				</div>
			</div>
		</div>

		<div class="section-nav">
			<button on:click={() => goto('/turbofan-zone/module/materials')} class="nav-button secondary">
				← Back: Materials & Thermal Management
			</button>
			<button on:click={() => goto('/turbofan-zone/module')} class="nav-button primary">
				Back to Module Overview
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
		color: #2196F3;
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
		background: rgba(33, 150, 243, 0.1);
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
		border-bottom: 3px solid #2196F3;
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

	.content-section.hero {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: white;
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.hero-content {
		flex: 1;
	}

	.hero-icon {
		font-size: 6rem;
		opacity: 0.3;
	}

	.content-section.hero h2 {
		color: white;
		margin-bottom: 1.5rem;
	}

	.content-section.hero p {
		color: rgba(255, 255, 255, 0.95);
		margin-bottom: 1rem;
	}

	.highlight-text {
		font-size: 1.2rem !important;
		line-height: 1.8 !important;
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

	.advantages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.advantage-card {
		padding: 2rem;
		border-radius: 1rem;
		border: 3px solid;
		background: white;
		transition: transform 0.3s ease;
	}

	.advantage-card:hover {
		transform: translateY(-5px);
	}

	.advantage-card.fuel { border-color: #4CAF50; }
	.advantage-card.thrust { border-color: #2196F3; }
	.advantage-card.noise { border-color: #9C27B0; }
	.advantage-card.environment { border-color: #00BCD4; }
	.advantage-card.reliability { border-color: #FF9800; }
	.advantage-card.range { border-color: #f44336; }

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.card-icon {
		font-size: 2.5rem;
	}

	.card-header h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0;
	}

	.advantage-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 1rem;
		margin: 0 0 1rem 0;
		line-height: 1.7;
	}

	.benefit-tag {
		display: inline-block;
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.comparison-table {
		margin-top: 2rem;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.table-header, .table-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 0.5rem;
	}

	.table-header {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: white;
		font-weight: bold;
	}

	.table-row {
		background: white;
		border-bottom: 1px solid #e0e0e0;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-row:nth-child(even) {
		background: #f5f5f5;
	}

	.header-cell, .cell {
		padding: 1rem;
		font-family: 'Roboto', sans-serif;
	}

	.cell.metric {
		font-weight: 600;
		color: #223A5E;
	}

	.cell.winner {
		background: rgba(76, 175, 80, 0.1);
		font-weight: bold;
	}

	.adoption-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.stat-box {
		text-align: center;
		padding: 2rem;
		background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
		border-radius: 1rem;
		border: 2px solid #2196F3;
	}

	.stat-number {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: bold;
		color: #2196F3;
		margin-bottom: 1rem;
	}

	.stat-box p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0;
		font-size: 1rem;
	}

	.info-callout {
		background: linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 167, 38, 0.05) 100%);
		padding: 2rem;
		border-radius: 1rem;
		border-left: 4px solid #FFA726;
		margin-top: 2rem;
	}

	.info-callout h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.6rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.info-callout p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0;
		line-height: 1.8;
	}

	.completion-section {
		background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
		padding: 3rem;
		border-radius: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
	}

	.completion-content {
		text-align: center;
		color: white;
	}

	.completion-icon {
		font-size: 5rem;
		margin-bottom: 1rem;
	}

	.completion-content h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: white;
		margin: 0 0 1rem 0;
	}

	.completion-content p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.95);
		max-width: 800px;
		margin: 0 auto 2rem auto;
		line-height: 1.8;
	}

	.completion-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.action-btn {
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
	}

	.action-btn.primary {
		background: white;
		color: #4CAF50;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	.action-btn.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
	}

	.action-btn.secondary {
		background: transparent;
		color: white;
		border: 2px solid white;
	}

	.action-btn.secondary:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-3px);
	}

	.navigation-buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
		flex-wrap: wrap;
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
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(33, 150, 243, 0.3);
	}

	.nav-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(33, 150, 243, 0.4);
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

		.content-section.hero {
			flex-direction: column;
			text-align: center;
		}

		.hero-icon {
			font-size: 4rem;
		}

		.advantages-grid {
			grid-template-columns: 1fr;
		}

		.table-header, .table-row {
			grid-template-columns: 2fr 1fr 1fr;
			font-size: 0.9rem;
		}

		.header-cell, .cell {
			padding: 0.75rem 0.5rem;
		}

		.adoption-stats {
			grid-template-columns: 1fr;
		}

		.completion-actions {
			flex-direction: column;
		}

		.action-btn {
			width: 100%;
		}

		.section-nav {
			flex-direction: column;
		}

		.nav-button {
			width: 100%;
		}
	}
</style>
