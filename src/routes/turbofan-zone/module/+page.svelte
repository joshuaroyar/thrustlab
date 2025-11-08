<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { goto } from '$app/navigation';

	const sections = [
		{
			id: 'working-principles',
			title: 'Working Principles',
			icon: '⚙️',
			description: 'Learn how turbofan engines work, bypass design, and two-spool configuration',
			color: '#FFA726'
		},
		{
			id: 'components',
			title: 'Major Components',
			icon: '🔧',
			description: 'Explore inlet, fan, compressors, combustor, turbines, and nozzles',
			color: '#223A5E'
		},
		{
			id: 'bypass-ratio',
			title: 'Bypass Ratio',
			icon: '📊',
			description: 'Understand bypass ratios and engine classifications',
			color: '#E91E63'
		},
		{
			id: 'materials',
			title: 'Materials & Thermal Management',
			icon: '🏭',
			description: 'Advanced materials, superalloys, and cooling systems',
			color: '#2196F3'
		},
		{
			id: 'advantages',
			title: 'Why Turbofans Are Superior',
			icon: '🚀',
			description: 'Discover the advantages that make turbofans dominate modern aviation',
			color: '#4CAF50'
		}
	];

	function navigateToSection(sectionId: string) {
		goto(`/turbofan-zone/module/${sectionId}`);
	}
</script>

<AnimatedBackground variant="orange" />

<div class="module-container">
	<div class="header-section animate-on-scroll">
		<button class="back-button" on:click={() => goto('/turbofan-zone')}>
			← Back to Turbofan Zone
		</button>
		<h1>✈️ Turbofan Engines</h1>
		<p class="subtitle">
			Comprehensive learning module covering the most advanced variation of gas turbine engines that power nearly all modern commercial aircraft
		</p>
	</div>

	<div class="intro-section animate-on-scroll">
		<h2>About This Module</h2>
		<p>
			Turbofan engines are the most advanced variation of gas turbine engines and power nearly all modern commercial aircraft. 
			They are preferred for their exceptional fuel efficiency and high thrust output, making them the industry standard for 
			passenger jets worldwide. This module explores the fundamental working principles, bypass design, major components, 
			materials science, and the key advantages that make turbofans dominate modern aviation.
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
				<div class="stat-number">~40</div>
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
		background: rgba(255, 167, 38, 0.1);
		color: #FFA726;
		border: 2px solid #FFA726;
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
		background: #FFA726;
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
		background: linear-gradient(135deg, #FFA726 0%, #ff9800 100%);
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
