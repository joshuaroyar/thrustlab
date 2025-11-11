<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';
</script>

<AnimatedBackground variant="orange" />

<div class="content-container">
	<div class="breadcrumb">
		<button on:click={() => goto('/turbofan-zone')}>Turbofan Zone</button>
		<span>›</span>
		<button on:click={() => goto('/turbofan-zone/module')}>Module</button>
		<span>›</span>
		<span>Materials & Thermal Management</span>
	</div>

	<div class="module-content">
		<div class="section-header">
			<h1>🏭 Materials & Thermal Management</h1>
			<p>Advanced materials and cooling systems for extreme environments</p>
		</div>

	<div class="content-section">
		<h2>🔥 Extreme Operating Conditions</h2>
		<p>
			Turbofan engines operate in extreme environments, requiring sophisticated materials and 
			cooling strategies to withstand temperatures exceeding 1,700°C and enormous mechanical stresses.
		</p>

		<div class="stats-grid">
			<div class="stat-card temp">
				<div class="stat-icon">🌡️</div>
				<div class="stat-value">1,700°C</div>
				<div class="stat-label">Combustion Temperature</div>
			</div>
			<div class="stat-card pressure">
				<div class="stat-icon">💪</div>
				<div class="stat-value">1,000°C+</div>
				<div class="stat-label">Turbine Operating Temperature</div>
			</div>
			<div class="stat-card exhaust">
				<div class="stat-icon">🔥</div>
				<div class="stat-value">550-850°C</div>
				<div class="stat-label">Exhaust Temperature Range</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>⚙️ Materials by Component Section</h2>

		<div class="materials-grid">
			<div class="material-card">
				<h3>🌀 Inlet & Compressor Sections</h3>
				<div class="material-list">
					<div class="material-item">
						<strong>Titanium Alloys</strong>
						<p>Lightweight, excellent corrosion resistance, high strength-to-weight ratio</p>
					</div>
					<div class="material-item">
						<strong>Composite Materials</strong>
						<p>Advanced lightweight construction for optimal structural efficiency</p>
					</div>
					<div class="material-item">
						<strong>Aluminum</strong>
						<p>Traditional choice for compressor blades, balance of weight and performance</p>
					</div>
					<div class="material-item">
						<strong>Steel</strong>
						<p>Used in high-stress areas requiring maximum strength</p>
					</div>
				</div>
			</div>

			<div class="material-card">
				<h3>🔥 Hot Section (Turbines)</h3>
				<div class="material-list">
					<div class="material-item highlight">
						<strong>Nickel-Based Superalloys (Inconel)</strong>
						<p>Primary material for turbine blades, maintains integrity above 1,000°C</p>
					</div>
					<div class="material-item">
						<strong>Single Crystal Construction</strong>
						<p>Prevents creep - gradual deformation under sustained stress at high temperatures</p>
					</div>
					<div class="material-item">
						<strong>Ceramic Thermal Barrier Coatings</strong>
						<p>Prevents blade melting by providing insulation layer</p>
					</div>
				</div>
			</div>

			<div class="material-card">
				<h3>💨 Bypass Ducts & Nozzles</h3>
				<div class="material-list">
					<div class="material-item">
						<strong>Lightweight Aluminum</strong>
						<p>Reduces overall engine weight while maintaining structural integrity</p>
					</div>
					<div class="material-item">
						<strong>Carbon Fiber</strong>
						<p>Advanced composite for minimal weight, produced by laying materials in molds</p>
					</div>
					<div class="material-item">
						<strong>Nickel/Titanium Alloys</strong>
						<p>For exhaust nozzles withstanding 550-850°C exhaust gases</p>
					</div>
				</div>
			</div>

			<div class="material-card">
				<h3>🔩 Shafts & Mechanical Systems</h3>
				<div class="material-list">
					<div class="material-item">
						<strong>Heat-Treated Steel</strong>
						<p>Withstands extreme temperatures and torque loads</p>
					</div>
					<div class="material-item">
						<strong>Precision Engineering</strong>
						<p>Multiple shafts for different spool configurations rotating at optimal speeds</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>🛡️ Nickel-Based Superalloys: The Hot Section Hero</h2>
		<p>
			<strong>Nickel-based superalloys</strong> like Inconel are the material of choice for 
			turbine blades, maintaining mechanical integrity at temperatures exceeding 1,000°C.
		</p>

		<div class="superalloy-features">
			<div class="feature-box">
				<div class="feature-icon">💎</div>
				<h4>High-Temperature Strength</h4>
				<p>
					Creep resistance through the stable gamma prime (γ') phase microstructure, 
					preventing deformation under sustained stress
				</p>
			</div>
			<div class="feature-box">
				<div class="feature-icon">🛡️</div>
				<h4>Oxidation & Corrosion Resistance</h4>
				<p>
					Protective oxide layers containing chromium and aluminum shield against harsh 
					combustion environment
				</p>
			</div>
			<div class="feature-box">
				<div class="feature-icon">🔄</div>
				<h4>Thermal Stability & Fatigue Resistance</h4>
				<p>
					Endures rapid temperature fluctuations and cyclic stresses throughout engine 
					operation cycles
				</p>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>❄️ Thermal Management Systems</h2>
		<p>
			Sophisticated cooling strategies are essential to protect components from extreme temperatures 
			and ensure reliable operation.
		</p>

		<div class="cooling-systems">
			<div class="cooling-card">
				<div class="cooling-header">
					<div class="cooling-icon">🌀</div>
					<h3>Internal Air Cooling Passages</h3>
				</div>
				<p>
					Turbine blades feature intricate internal channels that allow cold air to circulate, 
					bleeding through surface holes to create a protective cool air boundary layer.
				</p>
			</div>

			<div class="cooling-card">
				<div class="cooling-header">
					<div class="cooling-icon">🎨</div>
					<h3>Thermal Barrier Coatings</h3>
				</div>
				<p>
					Ceramic coatings applied to turbine blades provide critical insulation, preventing 
					melting and extending component life by reducing thermal load.
				</p>
			</div>

			<div class="cooling-card">
				<div class="cooling-header">
					<div class="cooling-icon">💨</div>
					<h3>Bleed Air Systems</h3>
				</div>
				<p>
					Strategic bleed air systems draw cooler air from the compressor stages to actively 
					cool critical components throughout the hot section.
				</p>
			</div>
		</div>
	</div>

	<div class="content-section">
		<h2>📷 Turbine Blade Close-ups</h2>
		<div class="images-grid">
			<div class="image-item">
				<img 
					src="https://pplx-res.cloudinary.com/image/upload/v1756434440/pplx_project_search_images/4885a024bb77ae4c055f46e354f5f6d2c3af5091.png" 
					alt="Close-up of turbofan engine fans showcasing turbine blades"
					class="blade-image"
				/>
				<p class="image-caption">Turbofan engine fans showcasing turbine blades made from high-strength nickel alloys</p>
			</div>

			<div class="image-item">
				<img 
					src="https://pplx-res.cloudinary.com/image/upload/v1762625796/pplx_project_search_images/0229d4c71deef9b3194e53ac2e5c85d9d7c4b332.png" 
					alt="Close-up of turbofan engine fan blades"
					class="blade-image"
				/>
				<p class="image-caption">Fan blades made from nickel alloy, highlighting key structural components</p>
			</div>

			<div class="image-item">
				<img 
					src="https://pplx-res.cloudinary.com/image/upload/v1755691697/pplx_project_search_images/b8ad3ac06ca4c76802c1d99a0d42f605e8596879.png" 
					alt="Close-up of turbofan engine turbine blades"
					class="blade-image"
				/>
				<p class="image-caption">Metal turbine blades made from nickel-based superalloys</p>
			</div>
		</div>
	</div>

		<div class="section-nav">
			<button on:click={() => goto('/turbofan-zone/module/bypass-ratio')} class="nav-button secondary">
				← Back: Bypass Ratio
			</button>
			<button on:click={() => goto('/turbofan-zone/module/advantages')} class="nav-button primary">
				Next: Why Turbofans Are Superior →
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
		color: #FFA726;
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
		background: rgba(255, 167, 38, 0.1);
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
		border-bottom: 3px solid #FFA726;
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

	.subtitle {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin: 0;
	}

	.content-section {
		background: white;
		padding: 2.5rem;
		border-radius: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.stat-card {
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		color: white;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	.stat-card.temp {
		background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
	}

	.stat-card.pressure {
		background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
	}

	.stat-card.exhaust {
		background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
	}

	.stat-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.stat-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		opacity: 0.95;
	}

	.materials-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.material-card {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.material-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.4rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.material-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.material-item {
		background: white;
		padding: 1.25rem;
		border-radius: 0.75rem;
		border-left: 4px solid #FFA726;
	}

	.material-item.highlight {
		border-left-color: #f44336;
		background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
	}

	.material-item strong {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		display: block;
		margin-bottom: 0.5rem;
		font-size: 1.05rem;
	}

	.material-item p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.superalloy-features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.feature-box {
		background: linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 167, 38, 0.05) 100%);
		padding: 2rem;
		border-radius: 1rem;
		border: 2px solid #FFA726;
		text-align: center;
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-box h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.feature-box p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 1rem;
		margin: 0;
		line-height: 1.6;
	}

	.cooling-systems {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.cooling-card {
		background: white;
		border: 2px solid #2196F3;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 5px 15px rgba(33, 150, 243, 0.1);
	}

	.cooling-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.cooling-icon {
		font-size: 2.5rem;
		color: #2196F3;
	}

	.cooling-header h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #223A5E;
		margin: 0;
	}

	.cooling-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 1.05rem;
		margin: 0;
		line-height: 1.7;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.image-item {
		text-align: center;
	}

	.blade-image {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 1rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
		transition: transform 0.3s ease;
	}

	.blade-image:hover {
		transform: scale(1.05);
	}

	.image-caption {
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		color: #888;
		margin-top: 1rem;
		font-style: italic;
		line-height: 1.4;
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

		.materials-grid {
			grid-template-columns: 1fr;
		}

		.superalloy-features {
			grid-template-columns: 1fr;
		}

		.images-grid {
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
