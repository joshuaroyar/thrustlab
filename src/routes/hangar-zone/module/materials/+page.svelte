<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="orange" />

<div class="content-container">
	<nav class="breadcrumb">
		<button on:click={() => goto('/hangar-zone')}>Hangar Zone</button>
		<span>›</span>
		<button on:click={() => goto('/hangar-zone/module')}>Module</button>
		<span>›</span>
		<span class="current">Materials</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">🏭</div>
			<h1>Materials & Manufacturing</h1>
			<p class="intro">
				Advanced materials and cutting-edge manufacturing techniques
			</p>
		</header>

		<div class="content-block">
			<h2>Superalloys</h2>
			<p>
				<strong>Superalloys</strong> form the backbone of modern turbine engine construction. These 
				remarkable materials maintain their strength and resist deformation even at extreme 
				temperatures.
			</p>

			<div class="material-card highlight">
				<h3>Nickel-Based Superalloys</h3>
				<p>
					The primary material for high-temperature applications, nickel-based superalloys incorporate 
					chromium, cobalt, and rhenium. They dominate turbine blade manufacturing due to their 
					exceptional <strong>creep resistance</strong> and high-temperature strength.
				</p>
				<div class="properties-grid">
					<div class="property-item">
						<span class="property-label">Key Elements</span>
						<span class="property-value">Ni, Cr, Co, Re</span>
					</div>
					<div class="property-item">
						<span class="property-label">Max Temperature</span>
						<span class="property-value">~1,850K</span>
					</div>
					<div class="property-item">
						<span class="property-label">Primary Use</span>
						<span class="property-value">Turbine blades</span>
					</div>
				</div>
			</div>

			<div class="material-card">
				<h3>Single-Crystal Casting</h3>
				<p>
					Modern manufacturing employs <strong>single-crystal casting techniques</strong> that 
					eliminate grain boundaries entirely. This revolutionary approach dramatically improves 
					high-temperature performance by removing weak points where cracks typically initiate.
				</p>
				<ul>
					<li>Eliminates grain boundaries (traditional weak points)</li>
					<li>Allows turbine inlet temperatures approaching 1,850K</li>
					<li>Increases blade lifespan and reliability</li>
					<li>Enables higher operating temperatures for improved efficiency</li>
				</ul>
			</div>
		</div>

		<div class="content-block">
			<h2>Advanced Ceramics</h2>
			<p>
				Next-generation engines are turning to <strong>ceramic materials</strong> that can tolerate 
				even higher temperatures than metal superalloys.
			</p>

			<div class="ceramic-grid">
				<div class="ceramic-card">
					<h3>🔷 Silicon Carbide (SiC)</h3>
					<p>Exceptional hardness and thermal conductivity, resistant to oxidation at high temperatures.</p>
				</div>
				<div class="ceramic-card">
					<h3>🔶 Silicon Nitride (Si₃N₄)</h3>
					<p>High strength and thermal shock resistance, excellent for extreme temperature variations.</p>
				</div>
				<div class="ceramic-card">
					<h3>💎 Ceramic Matrix Composites (CMCs)</h3>
					<p>Combining ceramic fibers with ceramic matrices, offering 1-3% efficiency improvements.</p>
				</div>
			</div>

			<div class="benefit-box">
				<h4>Benefits of CMCs</h4>
				<ul>
					<li>Increased performance at higher temperatures</li>
					<li>Extended component life (2-3x longer)</li>
					<li>Overall efficiency improvements of 1-3%</li>
					<li>Reduced cooling air requirements</li>
				</ul>
			</div>
		</div>

		<div class="content-block">
			<h2>Manufacturing Techniques</h2>

			<div class="manufacturing-grid">
				<div class="technique-card">
					<div class="technique-icon">🎯</div>
					<h3>Precision Casting</h3>
					<p>
						Investment casting creates complex internal cooling passages within turbine blades. 
						Wax patterns form intricate geometries that would be impossible to machine.
					</p>
				</div>

				<div class="technique-card">
					<div class="technique-icon">⚙️</div>
					<h3>Advanced Machining</h3>
					<p>
						5-axis CNC machining produces <strong>blisks</strong> (integrated blade-disk components) 
						from single forgings, eliminating joints and improving reliability.
					</p>
				</div>

				<div class="technique-card">
					<div class="technique-icon">🌡️</div>
					<h3>Thermal Barrier Coatings</h3>
					<p>
						Ceramic coatings applied to metal surfaces provide thermal insulation, allowing higher 
						operating temperatures while protecting the base metal.
					</p>
				</div>

				<div class="technique-card">
					<div class="technique-icon">🔬</div>
					<h3>Additive Manufacturing</h3>
					<p>
						3D printing enables complex cooling geometries and rapid prototyping, revolutionizing 
						the design and production of engine components.
					</p>
				</div>
			</div>
		</div>

		<div class="timeline-section">
			<h2>Evolution of Materials</h2>
			<div class="timeline">
				<div class="timeline-item">
					<div class="timeline-year">1940s</div>
					<div class="timeline-content">
						<h4>Early Nickel Alloys</h4>
						<p>First generation superalloys, limited temperature capability</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-year">1970s</div>
					<div class="timeline-content">
						<h4>Directional Solidification</h4>
						<p>Controlled grain structure, improved high-temperature performance</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-year">1990s</div>
					<div class="timeline-content">
						<h4>Single-Crystal Blades</h4>
						<p>Grain boundary elimination, major performance breakthrough</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-year">2010s</div>
					<div class="timeline-content">
						<h4>Ceramic Matrix Composites</h4>
						<p>Next-generation materials, 1-3% efficiency gains</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-year">Future</div>
					<div class="timeline-content">
						<h4>Advanced CMCs & Nanomaterials</h4>
						<p>Pushing temperature limits even higher for maximum efficiency</p>
					</div>
				</div>
			</div>
		</div>

		<div class="key-points">
			<h3>Key Takeaways</h3>
			<ul>
				<li>Nickel-based superalloys are essential for high-temperature components</li>
				<li>Single-crystal casting eliminates grain boundaries, improving performance</li>
				<li>Ceramic matrix composites enable 1-3% efficiency improvements</li>
				<li>Thermal barrier coatings protect metal surfaces from extreme heat</li>
				<li>Advanced manufacturing techniques enable complex cooling geometries</li>
			</ul>
		</div>

		<nav class="section-nav">
			<button class="nav-button secondary" on:click={() => goto('/hangar-zone/module/configurations')}>
				← Previous: Configurations
			</button>
			<button class="nav-button primary" on:click={() => goto('/hangar-zone/module/applications')}>
				Next: Applications →
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

	.material-card {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		margin-bottom: 1.5rem;
		border-left: 5px solid #FFA726;
	}

	.material-card.highlight {
		background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
	}

	.material-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.6rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.material-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		line-height: 1.8;
		margin-bottom: 1rem;
	}

	.material-card ul {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0 0;
	}

	.material-card li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		padding: 0.5rem 0 0.5rem 2rem;
		position: relative;
		line-height: 1.6;
	}

	.material-card li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: #FFA726;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.properties-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.property-item {
		background: white;
		padding: 1rem;
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
	}

	.property-label {
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.property-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #FFA726;
		font-weight: 700;
	}

	.ceramic-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.ceramic-card {
		background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
		padding: 2rem;
		border-radius: 1rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.ceramic-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
	}

	.ceramic-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.ceramic-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		line-height: 1.6;
		margin: 0;
	}

	.benefit-box {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		border: 2px solid #FFA726;
		margin-top: 2rem;
	}

	.benefit-box h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.benefit-box ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.benefit-box li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		padding: 0.5rem 0 0.5rem 2rem;
		position: relative;
		line-height: 1.6;
	}

	.benefit-box li::before {
		content: '⭐';
		position: absolute;
		left: 0;
		font-size: 1.2rem;
	}

	.manufacturing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.technique-card {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 2px solid #e9ecef;
	}

	.technique-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(255, 167, 38, 0.2);
		border-color: #FFA726;
	}

	.technique-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.technique-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.technique-card p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		line-height: 1.6;
		margin: 0;
	}

	.timeline-section {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		padding: 3rem 2rem;
		border-radius: 1.5rem;
		margin: 3rem 0;
	}

	.timeline-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 2rem 0;
		text-align: center;
	}

	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 80px;
		top: 0;
		bottom: 0;
		width: 3px;
		background: #FFA726;
	}

	.timeline-item {
		position: relative;
		padding-left: 140px;
		margin-bottom: 2rem;
	}

	.timeline-year {
		position: absolute;
		left: 0;
		top: 0;
		width: 100px;
		height: 50px;
		background: #FFA726;
		color: white;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1.1rem;
	}

	.timeline-content {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.timeline-content h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.5rem 0;
	}

	.timeline-content p {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		margin: 0;
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

		.timeline::before {
			left: 20px;
		}

		.timeline-item {
			padding-left: 60px;
		}

		.timeline-year {
			width: 70px;
			height: 40px;
			font-size: 0.9rem;
		}

		.section-nav {
			flex-direction: column;
		}

		.nav-button {
			width: 100%;
		}
	}
</style>
