<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';

	let selectedComponent = $state<'intake' | 'compressor' | 'combustion' | 'turbine' | 'exhaust'>('intake');

	type ComponentData = {
		title: string;
		icon: string;
		description: string;
		details: string;
		color: string;
		efficiency?: string;
		pressureRatio?: string;
		stages?: string;
		types?: string[];
		zones?: Array<{ name: string; airflow: string; purpose: string }>;
		inletTemp?: string;
		cooling?: string[];
	};

	const components: Record<'intake' | 'compressor' | 'combustion' | 'turbine' | 'exhaust', ComponentData> = {
		intake: {
			title: 'Air Intake',
			icon: '🌪️',
			description: 'The intake system captures atmospheric air and directs it smoothly into the engine. The inlet features a rounded lip design that ensures minimal flow distortion and provides the compressor with uniform airflow.',
			details: 'In aircraft applications, intake design varies significantly based on flight speed requirements, from simple cylindrical ducts for subsonic flight to complex variable-geometry systems for supersonic operation.',
			color: '#38C172'
		},
		compressor: {
			title: 'Compressor Section',
			icon: '🔄',
			description: 'The compressor is arguably the most complex component, responsible for raising air pressure before combustion. Modern gas turbines typically employ axial-flow compressors with 10-16 stages.',
			details: 'Each stage consists of rotating blades followed by stationary vanes (stators). Rotating blades increase both air pressure and velocity, while stationary vanes convert velocity increase into additional pressure rise. Overall pressure ratios reach 15:1 to 30:1 in advanced engines.',
			efficiency: '85-87%',
			pressureRatio: '15:1 to 30:1',
			stages: '10-16 stages',
			color: '#223A5E'
		},
		combustion: {
			title: 'Combustion Chamber',
			icon: '🔥',
			description: 'The combustion chamber is where fuel meets compressed air and undergoes continuous burning at temperatures exceeding 1,800-2,000°C.',
			details: 'Despite these extreme temperatures, the combustor must maintain stable, efficient combustion across a wide range of operating conditions.',
			types: ['Can-type: Multiple individual chambers', 'Annular: Single ring-shaped chamber', 'Can-annular: Hybrid design'],
			zones: [
				{ name: 'Primary zone', airflow: '20-30%', purpose: 'Fuel injection and ignition' },
				{ name: 'Secondary zone', airflow: '10-20%', purpose: 'Complete combustion' },
				{ name: 'Dilution zone', airflow: '50-60%', purpose: 'Temperature reduction to 1,100-1,500°C' }
			],
			color: '#FF3C7E'
		},
		turbine: {
			title: 'Turbine Section',
			icon: '⚡',
			description: 'The turbine extracts energy from hot, high-pressure gases to drive the compressor and produce useful work output.',
			details: 'Like the compressor, the turbine consists of alternating rows of stationary vanes (nozzle guide vanes) and rotating blades. In power generation, 60-70% of turbine power drives the compressor.',
			inletTemp: '1,500-1,850K',
			cooling: ['Internal cooling through blade passages', 'Film cooling with protective boundary layers', 'Impingement cooling at critical areas', 'Transpiration cooling through porous materials'],
			color: '#FFA726'
		},
		exhaust: {
			title: 'Exhaust System/Nozzle',
			icon: '💨',
			description: 'The exhaust section directs spent gases out of the engine. In aircraft applications, the nozzle plays a crucial role in thrust production.',
			details: 'The nozzle accelerates exhaust gases while maintaining proper back-pressure on the turbine to ensure optimal operation.',
			types: ['Convergent nozzles: For subsonic exhaust velocities', 'Convergent-divergent (C-D) nozzles: For supersonic exhaust expansion'],
			color: '#38C172'
		}
	};
</script>

<AnimatedBackground variant="blue" />

<div class="content-container">
	<nav class="breadcrumb">
		<button onclick={() => goto('/hangar-zone')}>Hangar Zone</button>
		<span>›</span>
		<button onclick={() => goto('/hangar-zone/module')}>Module</button>
		<span>›</span>
		<span class="current">Components</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">🔧</div>
			<h1>Major Components</h1>
			<p class="intro">
				Exploring the five critical components that make gas turbine engines work
			</p>
		</header>

		<div class="component-selector">
			<button 
				class="selector-btn"
				class:active={selectedComponent === 'intake'}
				onclick={() => selectedComponent = 'intake'}
			>
				<span class="btn-icon">🌪️</span>
				<span class="btn-text">Intake</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedComponent === 'compressor'}
				onclick={() => selectedComponent = 'compressor'}
			>
				<span class="btn-icon">🔄</span>
				<span class="btn-text">Compressor</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedComponent === 'combustion'}
				onclick={() => selectedComponent = 'combustion'}
			>
				<span class="btn-icon">🔥</span>
				<span class="btn-text">Combustion</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedComponent === 'turbine'}
				onclick={() => selectedComponent = 'turbine'}
			>
				<span class="btn-icon">⚡</span>
				<span class="btn-text">Turbine</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedComponent === 'exhaust'}
				onclick={() => selectedComponent = 'exhaust'}
			>
				<span class="btn-icon">💨</span>
				<span class="btn-text">Exhaust</span>
			</button>
		</div>

		<div class="component-details" style="--color: {components[selectedComponent].color}">
			<div class="details-header">
				<div class="details-icon">{components[selectedComponent].icon}</div>
				<h2>{components[selectedComponent].title}</h2>
			</div>

			<div class="details-content">
				<p class="description">{components[selectedComponent].description}</p>
				<p class="additional-details">{components[selectedComponent].details}</p>

				{#if components[selectedComponent].efficiency}
					<div class="specs-grid">
						<div class="spec-card">
							<div class="spec-label">Efficiency</div>
							<div class="spec-value">{components[selectedComponent].efficiency}</div>
						</div>
						<div class="spec-card">
							<div class="spec-label">Pressure Ratio</div>
							<div class="spec-value">{components[selectedComponent].pressureRatio}</div>
						</div>
						<div class="spec-card">
							<div class="spec-label">Stages</div>
							<div class="spec-value">{components[selectedComponent].stages}</div>
						</div>
					</div>
				{/if}

				{#if components[selectedComponent].types}
					<div class="info-section">
						<h3>Types</h3>
						<ul>
							{#each components[selectedComponent].types as type}
								<li>{type}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if components[selectedComponent].zones}
					<div class="info-section">
						<h3>Combustion Zones</h3>
						<div class="zones-grid">
							{#each components[selectedComponent].zones as zone}
								<div class="zone-card">
									<h4>{zone.name}</h4>
									<p class="zone-airflow">{zone.airflow} of airflow</p>
									<p class="zone-purpose">{zone.purpose}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if components[selectedComponent].inletTemp}
					<div class="specs-grid">
						<div class="spec-card wide">
							<div class="spec-label">Turbine Inlet Temperature</div>
							<div class="spec-value">{components[selectedComponent].inletTemp}</div>
						</div>
					</div>
				{/if}

				{#if components[selectedComponent].cooling}
					<div class="info-section">
						<h3>Cooling Systems</h3>
						<ul>
							{#each components[selectedComponent].cooling as method}
								<li>{method}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<div class="image-section">
			<img 
				src="https://pplx-res.cloudinary.com/image/upload/v1754647115/pplx_project_search_images/82fea881d51015ec68b4016fb5fc75c05431d226.png"
				alt="Labeled diagram of a gas turbine engine"
			/>
			<p class="image-caption">
				Labeled diagram of a gas turbine engine showing airflow, components, sections, and energy 
				distribution during engine operation.
			</p>
		</div>

		<div class="key-points">
			<h3>Key Takeaways</h3>
			<ul>
				<li>Air intake captures and directs atmospheric air smoothly into the engine</li>
				<li>Compressor raises air pressure through 10-16 stages with 85-87% efficiency</li>
				<li>Combustion chamber burns fuel at 1,800-2,000°C in three distinct zones</li>
				<li>Turbine extracts energy from hot gases to drive the compressor</li>
				<li>Exhaust nozzle accelerates spent gases for thrust production</li>
			</ul>
		</div>

		<nav class="section-nav">
			<button class="nav-button secondary" onclick={() => goto('/hangar-zone/module/fundamentals')}>
				← Previous: Fundamentals
			</button>
			<button class="nav-button primary" onclick={() => goto('/hangar-zone/module/configurations')}>
				Next: Configurations →
			</button>
		</nav>
	</article>
</div>

<style>
	.content-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		max-width: 1400px;
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
		border-bottom: 3px solid #223A5E;
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

	.component-selector {
		display: flex;
		gap: 1rem;
		margin-bottom: 3rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.selector-btn {
		background: #f8f9fa;
		border: 2px solid #e9ecef;
		border-radius: 50px;
		padding: 1rem 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.selector-btn:hover {
		background: #e9ecef;
		transform: translateY(-2px);
	}

	.selector-btn.active {
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		color: white;
		border-color: #223A5E;
		box-shadow: 0 5px 20px rgba(34, 58, 94, 0.3);
	}

	.btn-icon {
		font-size: 1.5rem;
	}

	.component-details {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-radius: 1.5rem;
		padding: 2.5rem;
		border-left: 5px solid var(--color);
		margin-bottom: 3rem;
		animation: fadeIn 0.5s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.details-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.details-icon {
		font-size: 4rem;
	}

	.details-header h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0;
	}

	.details-content .description {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #333;
		line-height: 1.8;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.details-content .additional-details {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		line-height: 1.8;
		margin-bottom: 2rem;
	}

	.specs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.spec-card {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.spec-card.wide {
		grid-column: 1 / -1;
	}

	.spec-label {
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		color: #666;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.spec-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: var(--color);
		font-weight: 700;
	}

	.info-section {
		margin: 2rem 0;
	}

	.info-section h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.info-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-section li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		padding: 0.75rem 0 0.75rem 2rem;
		position: relative;
		line-height: 1.6;
	}

	.info-section li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color);
		font-weight: bold;
		font-size: 1.3rem;
	}

	.zones-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.zone-card {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.zone-card h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.zone-airflow {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: var(--color);
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.zone-purpose {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		margin: 0;
		line-height: 1.6;
	}

	.image-section {
		margin: 3rem 0;
		text-align: center;
	}

	.image-section img {
		width: 100%;
		max-width: 900px;
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

		.component-selector {
			flex-direction: column;
		}

		.selector-btn {
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
