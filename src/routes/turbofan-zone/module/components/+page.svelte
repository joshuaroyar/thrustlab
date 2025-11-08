<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';

	type ComponentData = {
		title: string;
		icon: string;
		description: string;
		details: string;
		color: string;
		specs?: Array<{ label: string; value: string }>;
		zones?: Array<{ name: string; purpose: string }>;
	};

	const components: Record<'inlet' | 'fan' | 'compressor' | 'combustor' | 'turbine' | 'nozzle', ComponentData> = {
		inlet: {
			title: 'Inlet',
			icon: '🌪️',
			description: 'The first component in the energy production cycle',
			details: 'Located at the very front of the engine, the inlet serves as the first component in the turbine\'s energy production cycle. The inlet uses either converging or diverging geometry depending on aircraft speed.',
			color: '#2196F3',
			specs: [
				{ label: 'Geometry', value: 'Converging (slow aircraft) or Diverging (fast aircraft)' },
				{ label: 'Target Speed', value: '0.5 Mach' },
				{ label: 'Features', value: 'Heating systems to prevent ice buildup' }
			]
		},
		fan: {
			title: 'Fan Rotor',
			icon: '⚙️',
			description: 'The first and very large rotor accelerating massive airflow',
			details: 'The fan rotor is the first and very large rotor in the compressor section, accelerating a massive flow of air through the bypass duct to provide the main thrust. It is driven by the low-pressure turbine via the low-pressure shaft.',
			color: '#4CAF50',
			specs: [
				{ label: 'Example: GE90', value: 'Fan blades 1.25 meters long, 25 kg each' },
				{ label: 'Drive System', value: 'Low-pressure turbine via LP shaft' },
				{ label: 'Modern Design', value: 'Geared turbofan for optimized speeds' }
			]
		},
		compressor: {
			title: 'Compressors',
			icon: '🔄',
			description: 'Multi-stage compression with LP and HP sections',
			details: 'The compressor section is composed of multiple stages with rotating blades (rotors) and stationary blades (stators). The LP compressor provides initial compression, while the HP compressor handles main compression using the innovative blisk principle.',
			color: '#FF9800',
			specs: [
				{ label: 'Materials', value: 'Titanium, aluminum, or steel' },
				{ label: 'Preferred Material', value: 'Titanium for lightweight and corrosion resistance' },
				{ label: 'Innovation', value: 'Blisk principle - blades and disk as single unit' },
				{ label: 'Function', value: 'Stators convert rotational energy to static pressure' }
			]
		},
		combustor: {
			title: 'Combustor',
			icon: '🔥',
			description: 'Where fuel combustion occurs at extreme temperatures',
			details: 'The combustor is where fuel combustion occurs. This is a highly complex component that must maintain stable combustion while air moves through at extremely fast rates.',
			color: '#f44336',
			zones: [
				{ name: 'Primary Zone', purpose: '20% of compressed air ignites with fuel at ~15:1 ratio, achieving stable combustion' },
				{ name: 'Intermediate Zone', purpose: 'Temperature control to complete combustion of unburned hydrocarbons' },
				{ name: 'Dilution Zone', purpose: 'Remaining air cools and mixes with combustion products' }
			],
			specs: [
				{ label: 'Temperature', value: 'Approximately 1,700°C' },
				{ label: 'Igniters', value: 'Typically two for reliable startup' },
				{ label: 'Features', value: 'Interconnectors allow flame propagation' }
			]
		},
		turbine: {
			title: 'Turbines',
			icon: '⚡',
			description: 'HP and LP turbines extracting energy from hot gases',
			details: 'The hot gases exiting the combustor flow through turbine sections containing multiple turbine wheels and numerous blades. The turbine blades spin as the exhaust gas stream passes through them, driving both the compressor and fan.',
			color: '#9C27B0',
			specs: [
				{ label: 'Material', value: 'Single nickel-based alloy crystals' },
				{ label: 'Purpose', value: 'Prevent creep at high temperatures' },
				{ label: 'Coating', value: 'Ceramic thermal barrier coatings' },
				{ label: 'Cooling', value: 'Internal air channels with surface holes' },
				{ label: 'Superalloy', value: 'Inconel - maintains integrity above 1,000°C' }
			]
		},
		nozzle: {
			title: 'Nozzles & Ducts',
			icon: '🚀',
			description: 'Bypass ducts and nozzles for thrust generation',
			details: 'Bypass ducts direct compressed bypass air around the engine core. The engine features multiple nozzles: the fan nozzle accelerates bypass airflow, while the core nozzle accelerates core exhaust gases.',
			color: '#00BCD4',
			specs: [
				{ label: 'Duct Materials', value: 'Lightweight aluminum or carbon fiber' },
				{ label: 'Fan Nozzle', value: 'Accelerates bypass airflow at exit' },
				{ label: 'Core Nozzle', value: 'Accelerates core exhaust gases' },
				{ label: 'Advanced Design', value: 'Streams can mix before combined nozzle' }
			]
		}
	};

	let selectedComponent: 'inlet' | 'fan' | 'compressor' | 'combustor' | 'turbine' | 'nozzle' = $state('inlet');
</script>

<AnimatedBackground variant="green" />

<div class="content-container">
	<div class="breadcrumb">
		<button onclick={() => goto('/turbofan-zone')}>Turbofan Zone</button>
		<span>›</span>
		<button onclick={() => goto('/turbofan-zone/module')}>Module</button>
		<span>›</span>
		<span>Major Components</span>
	</div>

	<div class="module-content">
		<div class="section-header">
			<h1>🔧 Major Engine Components</h1>
			<p>Explore the intricate components that make turbofan engines work</p>
		</div>

	<div class="component-selector">
		{#each Object.keys(components) as key}
			<button
				class="selector-btn"
				class:active={selectedComponent === key}
				onclick={() => selectedComponent = key as typeof selectedComponent}
			>
				<span class="btn-icon">{components[key as keyof typeof components].icon}</span>
				<span class="btn-text">{components[key as keyof typeof components].title}</span>
			</button>
		{/each}
	</div>

	<div class="component-detail" style="border-color: {components[selectedComponent].color}">
		<div class="detail-header" style="background: linear-gradient(135deg, {components[selectedComponent].color}22 0%, {components[selectedComponent].color}11 100%)">
			<div class="detail-icon" style="color: {components[selectedComponent].color}">
				{components[selectedComponent].icon}
			</div>
			<h2>{components[selectedComponent].title}</h2>
			<p class="component-description">{components[selectedComponent].description}</p>
		</div>

		<div class="detail-content">
			<p class="detail-text">{components[selectedComponent].details}</p>

			{#if components[selectedComponent].specs}
				<div class="specs-grid">
					<h3>📋 Specifications</h3>
					{#each components[selectedComponent].specs as spec}
						<div class="spec-item">
							<span class="spec-label">{spec.label}:</span>
							<span class="spec-value">{spec.value}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if components[selectedComponent].zones}
				<div class="zones-section">
					<h3>🎯 Combustion Zones</h3>
					{#each components[selectedComponent].zones as zone}
						<div class="zone-card">
							<h4>{zone.name}</h4>
							<p>{zone.purpose}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

		<div class="image-section">
			<h2>📷 Compressor Cross-Section</h2>
			<img 
				src="https://pplx-res.cloudinary.com/image/upload/v1755497900/pplx_project_search_images/6133665c025c707fbd5a5e53d7524ffb09c8cdb4.png" 
				alt="Detailed cross-sectional diagrams of single-spool and twin-spool axial flow compressors"
			/>
			<p class="image-caption">
				Detailed cross-sectional diagrams of single-spool and twin-spool axial flow compressors 
				in aircraft engines, showing key components and internal blade arrangements.
			</p>
		</div>

		<div class="section-nav">
			<button onclick={() => goto('/turbofan-zone/module/working-principles')} class="nav-button secondary">
				← Back: Working Principles
			</button>
			<button onclick={() => goto('/turbofan-zone/module/bypass-ratio')} class="nav-button primary">
				Next: Bypass Ratio →
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
		color: #4CAF50;
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
		background: rgba(76, 175, 80, 0.1);
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
		border-bottom: 3px solid #4CAF50;
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

	.component-selector {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.selector-btn {
		background: white;
		border: 2px solid #e0e0e0;
		padding: 1rem 1.5rem;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
	}

	.selector-btn:hover {
		border-color: #4CAF50;
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
	}

	.selector-btn.active {
		background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
		color: white;
		border-color: #4CAF50;
		box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
	}

	.btn-icon {
		font-size: 1.5rem;
	}

	.component-detail {
		background: white;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 3px solid;
		margin-bottom: 2rem;
	}

	.detail-header {
		padding: 2.5rem;
		text-align: center;
	}

	.detail-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.detail-header h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.component-description {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin: 0;
		font-style: italic;
	}

	.detail-content {
		padding: 2.5rem;
	}

	.detail-text {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #666;
		line-height: 1.8;
		margin-bottom: 2rem;
	}

	.specs-grid {
		margin-top: 2rem;
	}

	.specs-grid h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.6rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.spec-item {
		display: flex;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 0.5rem;
		margin-bottom: 0.75rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.spec-label {
		font-family: 'Roboto', sans-serif;
		font-weight: 600;
		color: #223A5E;
		min-width: 150px;
	}

	.spec-value {
		font-family: 'Roboto', sans-serif;
		color: #666;
		flex: 1;
	}

	.zones-section {
		margin-top: 2rem;
	}

	.zones-section h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.6rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.zone-card {
		background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
		padding: 1.5rem;
		border-radius: 1rem;
		margin-bottom: 1rem;
		border-left: 4px solid #f44336;
	}

	.zone-card h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.zone-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0;
		line-height: 1.6;
	}

	.image-section {
		margin: 3rem 0;
		text-align: center;
	}

	.image-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 2rem 0;
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
		background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
		color: white;
		box-shadow: 0 5px 20px rgba(76, 175, 80, 0.3);
	}

	.nav-button.primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4);
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
			justify-content: center;
		}

		.section-nav {
			flex-direction: column;
		}

		.nav-button {
			width: 100%;
		}
	}
</style>
