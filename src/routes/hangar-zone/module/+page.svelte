<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';

	const sections = [
		{
			id: 'fundamentals',
			title: 'Fundamental Working Principle',
			icon: '⚙️',
			description: 'Learn about the Brayton cycle and the four main processes of gas turbine operation',
			color: '#38C172'
		},
		{
			id: 'components',
			title: 'Major Components',
			icon: '🔧',
			description: 'Explore the five critical components: Intake, Compressor, Combustion Chamber, Turbine, and Exhaust',
			color: '#223A5E'
		},
		{
			id: 'configurations',
			title: 'Engine Configurations',
			icon: '✈️',
			description: 'Discover different types: Turbojet, Turbofan, Turboprop, and Turboshaft engines',
			color: '#FF3C7E'
		},
		{
			id: 'materials',
			title: 'Materials & Manufacturing',
			icon: '🏭',
			description: 'Understanding superalloys, ceramics, and advanced manufacturing techniques',
			color: '#FFA726'
		},
		{
			id: 'applications',
			title: 'Applications & Performance',
			icon: '🚀',
			description: 'Real-world applications in aviation, power generation, marine, and industrial processes',
			color: '#38C172'
		}
	];

	function navigateToSection(sectionId: string) {
		goto(`/hangar-zone/module/${sectionId}`);
	}
</script>

<AnimatedBackground variant="blue" />

<div class="module-container">
	<div class="header-section animate-on-scroll">
		<button class="back-button" on:click={() => goto('/hangar-zone')}>
			← Back to Hangar Zone
		</button>
		<h1>🛩️ Gas Turbine Engines</h1>
		<p class="subtitle">
			Comprehensive learning module covering the fundamentals, components, and applications of gas turbine engines
		</p>
	</div>

	<div class="intro-section animate-on-scroll">
		<h2>About This Module</h2>
		<p>
			Gas turbine engines are sophisticated internal combustion engines that harness the energy of burning 
			fuel to produce mechanical power. These remarkable machines have revolutionized aviation, power generation, 
			and numerous industrial applications since their development in the early 20th century. Unlike piston 
			engines where combustion occurs intermittently in cylinders, gas turbines operate as continuous flow 
			engines where intake, compression, combustion, and exhaust all happen simultaneously in different 
			sections of the engine.
		</p>
	</div>

	<div class="sections-grid">
		{#each sections as section, index}
			<div 
				class="section-card animate-slide-up" 
				style="--delay: {index * 0.1}s; --color: {section.color}"
				on:click={() => navigateToSection(section.id)}
				on:keydown={(e) => e.key === 'Enter' && navigateToSection(section.id)}
				role="button"
				tabindex="0"
			>
				<div class="card-icon">{section.icon}</div>
				<h3>{section.title}</h3>
				<p>{section.description}</p>
				<div class="card-arrow">→</div>
			</div>
		{/each}
	</div>

	<div class="progress-section animate-on-scroll">
		<h2>Your Learning Journey</h2>
		<div class="progress-stats">
			<div class="stat-card">
				<div class="stat-number">5</div>
				<div class="stat-label">Sections</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">~45</div>
				<div class="stat-label">Minutes</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">0%</div>
				<div class="stat-label">Complete</div>
			</div>
		</div>
	</div>
</div>

<style>
	.module-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.header-section {
		text-align: center;
		padding: 3rem 2rem;
		margin-bottom: 3rem;
	}

	.back-button {
		background: rgba(34, 58, 94, 0.1);
		color: #223A5E;
		border: 2px solid #223A5E;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-bottom: 2rem;
	}

	.back-button:hover {
		background: #223A5E;
		color: white;
		transform: translateX(-5px);
	}

	.header-section h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-weight: 700;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		color: #666;
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.intro-section {
		background: white;
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		margin-bottom: 3rem;
	}

	.intro-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		color: #223A5E;
		margin: 0 0 1.5rem 0;
	}

	.intro-section p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		color: #666;
		line-height: 1.8;
		margin: 0;
	}

	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.section-card {
		background: white;
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		border-left: 5px solid var(--color);
	}

	.section-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 5px;
		background: var(--color);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s ease;
	}

	.section-card:hover::before {
		transform: scaleX(1);
	}

	.section-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
	}

	.card-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.section-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.section-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		line-height: 1.8;
		margin: 0 0 1.5rem 0;
		font-size: 1.05rem;
	}

	.card-arrow {
		font-size: 2rem;
		color: var(--color);
		transition: transform 0.3s ease;
	}

	.section-card:hover .card-arrow {
		transform: translateX(10px);
	}

	.progress-section {
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		padding: 3rem 2rem;
		border-radius: 1.5rem;
		text-align: center;
		color: white;
	}

	.progress-section h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		margin: 0 0 2rem 0;
	}

	.progress-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.stat-number {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		opacity: 0.9;
	}

	/* Animations */
	.animate-on-scroll {
		opacity: 0;
		animation: fadeInUp 0.8s ease forwards;
	}

	.animate-slide-up {
		opacity: 0;
		animation: slideUp 0.6s ease forwards;
		animation-delay: var(--delay, 0s);
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.sections-grid {
			grid-template-columns: 1fr;
		}

		.progress-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
