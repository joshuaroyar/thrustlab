<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';

	let selectedConfig = $state<'turbojet' | 'turbofan' | 'turboprop' | 'turboshaft'>('turbojet');

	type ConfigData = {
		title: string;
		icon: string;
		description: string;
		details: string;
		color: string;
		bypassRatio?: string;
		application?: string;
		advantages?: string[];
		speedLimit?: string;
		types?: Array<{ name: string; bpr: string; use: string }>;
		example?: string;
	};

	const configurations: Record<'turbojet' | 'turbofan' | 'turboprop' | 'turboshaft', ConfigData> = {
		turbojet: {
			title: 'Turbojet Engines',
			icon: '✈️',
			description: 'The simplest gas turbine configuration, where all air passes through the core and thrust comes entirely from exhaust jet velocity.',
			details: 'While fuel-intensive, turbojets excel at high-speed flight and are used primarily in military applications.',
			bypassRatio: 'N/A (0:1)',
			application: 'Military aircraft, high-speed flight',
			advantages: ['Excellent high-speed performance', 'Simple design', 'Compact size', 'High thrust-to-weight ratio'],
			color: '#FF3C7E'
		},
		turbofan: {
			title: 'Turbofan Engines',
			icon: '🌀',
			description: 'Turbofans add a large fan at the front, driven by an additional turbine stage. A significant portion of air bypasses the core.',
			details: 'The fan produces thrust at lower velocity but higher efficiency, making turbofans the most common engine type for commercial aviation.',
			types: [
				{ name: 'Low Bypass', bpr: 'BPR < 2', use: 'Military fighters with afterburner' },
				{ name: 'Medium Bypass', bpr: 'BPR 2-4', use: 'Business jets, older commercial aircraft' },
				{ name: 'High Bypass', bpr: 'BPR 5-8', use: 'Modern commercial airliners' },
				{ name: 'Ultrahigh Bypass', bpr: 'BPR 9-15+', use: 'Latest generation fuel-efficient designs' }
			],
			example: 'General Electric GE90 for Boeing 777: fan blades 1.25m long, each weighing 25kg',
			color: '#38C172'
		},
		turboprop: {
			title: 'Turboprop Engines',
			icon: '🛩️',
			description: 'Gas turbines driving propellers through reduction gearboxes, achieving bypass ratios of 50-100.',
			details: 'Turboprops offer excellent efficiency at speeds below 400 knots but are limited by propeller tip speed constraints.',
			bypassRatio: '50-100:1',
			speedLimit: 'Below 400 knots',
			application: 'Regional aircraft, cargo planes, military transports',
			advantages: ['Superior fuel efficiency', 'Excellent low-speed performance', 'Short runway capability', 'Lower operating costs'],
			color: '#FFA726'
		},
		turboshaft: {
			title: 'Turboshaft Engines',
			icon: '🚁',
			description: 'Similar to turboprops but optimized for shaft power output rather than thrust.',
			details: 'Used in helicopters, ships, and industrial applications where rotational power is needed rather than forward thrust.',
			application: 'Helicopters, ships, industrial equipment',
			advantages: ['High power-to-weight ratio', 'Compact design', 'Flexible fuel options', 'Reliable operation'],
			color: '#223A5E'
		}
	};
</script>

<AnimatedBackground variant="magenta" />

<div class="content-container">
	<nav class="breadcrumb">
		<button onclick={() => goto('/hangar-zone')}>Hangar Zone</button>
		<span>›</span>
		<button onclick={() => goto('/hangar-zone/module')}>Module</button>
		<span>›</span>
		<span class="current">Configurations</span>
	</nav>

	<article class="module-content">
		<header class="section-header">
			<div class="icon">✈️</div>
			<h1>Engine Configurations</h1>
			<p class="intro">
				Understanding the different types of gas turbine engines and their applications
			</p>
		</header>

		<div class="config-selector">
			<button 
				class="selector-btn"
				class:active={selectedConfig === 'turbojet'}
				onclick={() => selectedConfig = 'turbojet'}
			>
				<span class="btn-icon">✈️</span>
				<span class="btn-text">Turbojet</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedConfig === 'turbofan'}
				onclick={() => selectedConfig = 'turbofan'}
			>
				<span class="btn-icon">🌀</span>
				<span class="btn-text">Turbofan</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedConfig === 'turboprop'}
				onclick={() => selectedConfig = 'turboprop'}
			>
				<span class="btn-icon">🛩️</span>
				<span class="btn-text">Turboprop</span>
			</button>
			<button 
				class="selector-btn"
				class:active={selectedConfig === 'turboshaft'}
				onclick={() => selectedConfig = 'turboshaft'}
			>
				<span class="btn-icon">🚁</span>
				<span class="btn-text">Turboshaft</span>
			</button>
		</div>

		<div class="config-details" style="--color: {configurations[selectedConfig].color}">
			<div class="details-header">
				<div class="details-icon">{configurations[selectedConfig].icon}</div>
				<h2>{configurations[selectedConfig].title}</h2>
			</div>

			<div class="details-content">
				<p class="description">{configurations[selectedConfig].description}</p>
				<p class="additional-details">{configurations[selectedConfig].details}</p>

				<div class="specs-section">
					{#if configurations[selectedConfig].bypassRatio}
						<div class="spec-item">
							<span class="spec-label">Bypass Ratio:</span>
							<span class="spec-value">{configurations[selectedConfig].bypassRatio}</span>
						</div>
					{/if}
					{#if configurations[selectedConfig].speedLimit}
						<div class="spec-item">
							<span class="spec-label">Speed Range:</span>
							<span class="spec-value">{configurations[selectedConfig].speedLimit}</span>
						</div>
					{/if}
					{#if configurations[selectedConfig].application}
						<div class="spec-item">
							<span class="spec-label">Applications:</span>
							<span class="spec-value">{configurations[selectedConfig].application}</span>
						</div>
					{/if}
				</div>

				{#if configurations[selectedConfig].types}
					<div class="types-section">
						<h3>Turbofan Types by Bypass Ratio</h3>
						<div class="types-grid">
							{#each configurations[selectedConfig].types as type}
								<div class="type-card">
									<h4>{type.name}</h4>
									<p class="type-bpr">{type.bpr}</p>
									<p class="type-use">{type.use}</p>
								</div>
							{/each}
						</div>
						{#if configurations[selectedConfig].example}
							<div class="example-box">
								<strong>Example:</strong> {configurations[selectedConfig].example}
							</div>
						{/if}
					</div>
				{/if}

				{#if configurations[selectedConfig].advantages}
					<div class="advantages-section">
						<h3>Key Advantages</h3>
						<ul>
							{#each configurations[selectedConfig].advantages as advantage}
								<li>{advantage}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<div class="comparison-section">
			<h2>Quick Comparison</h2>
			<div class="comparison-grid">
				<div class="comparison-card">
					<h3>Turbojet</h3>
					<div class="comparison-item">
						<span class="label">Speed:</span>
						<span class="value">⭐⭐⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Efficiency:</span>
						<span class="value">⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Complexity:</span>
						<span class="value">⭐⭐</span>
					</div>
				</div>

				<div class="comparison-card">
					<h3>Turbofan</h3>
					<div class="comparison-item">
						<span class="label">Speed:</span>
						<span class="value">⭐⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Efficiency:</span>
						<span class="value">⭐⭐⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Complexity:</span>
						<span class="value">⭐⭐⭐⭐</span>
					</div>
				</div>

				<div class="comparison-card">
					<h3>Turboprop</h3>
					<div class="comparison-item">
						<span class="label">Speed:</span>
						<span class="value">⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Efficiency:</span>
						<span class="value">⭐⭐⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Complexity:</span>
						<span class="value">⭐⭐⭐</span>
					</div>
				</div>

				<div class="comparison-card">
					<h3>Turboshaft</h3>
					<div class="comparison-item">
						<span class="label">Speed:</span>
						<span class="value">N/A</span>
					</div>
					<div class="comparison-item">
						<span class="label">Power Output:</span>
						<span class="value">⭐⭐⭐⭐⭐</span>
					</div>
					<div class="comparison-item">
						<span class="label">Complexity:</span>
						<span class="value">⭐⭐⭐</span>
					</div>
				</div>
			</div>
		</div>

		<div class="key-points">
			<h3>Key Takeaways</h3>
			<ul>
				<li>Turbojets are simple and fast but fuel-intensive</li>
				<li>Turbofans dominate commercial aviation with superior efficiency</li>
				<li>Higher bypass ratios provide better fuel efficiency</li>
				<li>Turboprops excel at lower speeds with excellent efficiency</li>
				<li>Turboshafts are optimized for rotational power output</li>
			</ul>
		</div>

		<nav class="section-nav">
			<button class="nav-button secondary" onclick={() => goto('/hangar-zone/module/components')}>
				← Previous: Components
			</button>
			<button class="nav-button primary" onclick={() => goto('/hangar-zone/module/materials')}>
				Next: Materials →
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
		border-bottom: 3px solid #FF3C7E;
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

	.config-selector {
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
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: white;
		border-color: #FF3C7E;
		box-shadow: 0 5px 20px rgba(255, 60, 126, 0.3);
	}

	.btn-icon {
		font-size: 1.5rem;
	}

	.config-details {
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

	.specs-section {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		margin: 2rem 0;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.spec-item {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem 0;
		border-bottom: 1px solid #e9ecef;
		font-family: 'Roboto', sans-serif;
	}

	.spec-item:last-child {
		border-bottom: none;
	}

	.spec-label {
		font-weight: 600;
		color: #666;
	}

	.spec-value {
		color: var(--color);
		font-weight: 600;
	}

	.types-section {
		margin: 2rem 0;
	}

	.types-section h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.types-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.type-card {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.type-card h4 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.3rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.type-bpr {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: var(--color);
		font-weight: 700;
		margin: 0 0 0.5rem 0;
	}

	.type-use {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		color: #666;
		margin: 0;
		line-height: 1.6;
	}

	.example-box {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		border-left: 4px solid var(--color);
		font-family: 'Roboto', sans-serif;
		font-size: 1.05rem;
		color: #555;
		line-height: 1.6;
	}

	.advantages-section {
		margin: 2rem 0;
	}

	.advantages-section h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.advantages-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.advantages-section li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #555;
		padding: 0.75rem 0 0.75rem 2rem;
		position: relative;
		line-height: 1.6;
	}

	.advantages-section li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color);
		font-weight: bold;
		font-size: 1.3rem;
	}

	.comparison-section {
		background: #f8f9fa;
		padding: 2.5rem;
		border-radius: 1.5rem;
		margin: 3rem 0;
	}

	.comparison-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 2rem 0;
		text-align: center;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.comparison-card {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.comparison-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
		text-align: center;
	}

	.comparison-item {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		font-family: 'Roboto', sans-serif;
	}

	.comparison-item .label {
		color: #666;
		font-weight: 600;
	}

	.comparison-item .value {
		color: #FFA726;
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

		.config-selector {
			flex-direction: column;
		}

		.selector-btn {
			width: 100%;
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
