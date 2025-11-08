<script lang="ts">
	import { onMount } from 'svelte';
	import ParticleEffect from '$lib/components/ParticleEffect.svelte';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	
	let mouseX = $state(0);
	let mouseY = $state(0);
	let heroRef: HTMLElement;
	let isHovering = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Scroll-triggered animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Observe all elements with animate-on-scroll class
		setTimeout(() => {
			const animateElements = document.querySelectorAll('.animate-on-scroll');
			animateElements.forEach(el => observer.observe(el));
		}, 100);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			observer.disconnect();
		};
	});

	function handleParallax(depth: number) {
		if (!mounted) return '';
		const moveX = (mouseX - window.innerWidth / 2) * depth;
		const moveY = (mouseY - window.innerHeight / 2) * depth;
		return `transform: translate(${moveX}px, ${moveY}px)`;
	}

	const features = [
		{
			icon: '🎮',
			title: 'Interactive 3D Simulations',
			description: 'Manipulate and analyze engineering components in a real-time 3D environment.',
			color: '#38C172'
		},
		{
			icon: '📚',
			title: 'Educational Modules',
			description: 'Dive into detailed tutorials on Gas Turbine and Turbofan Engine systems.',
			color: '#FFA726'
		},
		{
			icon: '📊',
			title: 'Instant Assessments',
			description: 'Test your knowledge with integrated quizzes and track your performance over time.',
			color: '#FF3C7E'
		},
		{
			icon: '🤖',
			title: 'AI-Powered Assistance',
			description: 'Get expert guidance and technical support from our advanced AI assistant, JAJA.',
			color: '#38C172'
		}
	];

	const zones = [
		{
			title: 'Hangar Zone',
			description: 'Learn about Gas Turbine Engines with interactive tutorials',
			link: '/hangar-zone',
			icon: '🛩️',
			gradient: 'linear-gradient(135deg, #223A5E 0%, #38C172 100%)'
		},
		{
			title: 'Turbofan Zone',
			description: 'Explore insights into Turbofan Engine systems',
			link: '/turbofan-zone',
			icon: '✈️',
			gradient: 'linear-gradient(135deg, #38C172 0%, #FFA726 100%)'
		},
		{
			title: 'Overhaul Station',
			description: 'Interact with 3D models of engine assemblies',
			link: '/overhaul-station',
			icon: '🔧',
			gradient: 'linear-gradient(135deg, #FFA726 0%, #FF3C7E 100%)'
		},
		{
			title: 'JAJA AI Assistant',
			description: 'Get personalized support from our AI assistant',
			link: '/jaja',
			icon: '🤖',
			gradient: 'linear-gradient(135deg, #FF3C7E 0%, #223A5E 100%)'
		}
	];
</script>

<PageLoader />
<AnimatedBackground variant="default" />

<div class="homepage">
	<!-- Particle Background -->
	<ParticleEffect />

	<!-- Hero Section -->
	<section class="hero" bind:this={heroRef}>
		<div class="hero-background">
			<div class="parallax-layer layer-1" style={handleParallax(0.02)}></div>
			<div class="parallax-layer layer-2" style={handleParallax(0.04)}></div>
			<div class="parallax-layer layer-3" style={handleParallax(0.06)}></div>
		</div>
		
		<div class="hero-content">
			<h1 class="hero-title animate-in">
				Welcome to <span class="gradient-text">ThrustLab</span>
			</h1>
			<p class="hero-subtitle animate-in delay-1">
				Your gateway to interactive 3D engineering education
			</p>
			<p class="hero-description animate-in delay-2">
				Explore real-time simulations, comprehensive tutorials, and instant assessments—all designed 
				to enhance your learning experience in gas turbine and turbofan engines.
			</p>
			<div class="hero-actions animate-in delay-3">
				<a 
					href="/sign-up" 
					class="cta-button primary"
					onmousemove={(e) => {
						const btn = e.currentTarget;
						const rect = btn.getBoundingClientRect();
						const x = e.clientX - rect.left - rect.width / 2;
						const y = e.clientY - rect.top - rect.height / 2;
						btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
					}}
					onmouseleave={(e) => {
						const btn = e.currentTarget;
						btn.style.transform = '';
					}}
				>
					Get Started
					<span class="button-shine"></span>
				</a>
				<a 
					href="/login" 
					class="cta-button secondary"
					onmousemove={(e) => {
						const btn = e.currentTarget;
						const rect = btn.getBoundingClientRect();
						const x = e.clientX - rect.left - rect.width / 2;
						const y = e.clientY - rect.top - rect.height / 2;
						btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
					}}
					onmouseleave={(e) => {
						const btn = e.currentTarget;
						btn.style.transform = '';
					}}
				>
					Log In
				</a>
			</div>
		</div>

		<div class="scroll-indicator animate-bounce">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M12 5v14M19 12l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features-section">
		<div class="container">
			<h2 class="section-title">Key Features</h2>
			<div class="features-grid">
				{#each features as feature, i}
					<div 
						class="feature-card animate-on-scroll"
						role="group"
						style="--delay: {i * 0.1}s; --accent-color: {feature.color}"
						onmouseenter={(e) => {
							isHovering = true;
							const card = e.currentTarget;
							card.style.setProperty('--mouse-x', '0');
							card.style.setProperty('--mouse-y', '0');
						}}
						onmousemove={(e) => {
							const card = e.currentTarget;
							const rect = card.getBoundingClientRect();
							const x = ((e.clientX - rect.left) / rect.width) * 100;
							const y = ((e.clientY - rect.top) / rect.height) * 100;
							card.style.setProperty('--mouse-x', `${x}%`);
							card.style.setProperty('--mouse-y', `${y}%`);
						}}
						onmouseleave={(e) => {
							isHovering = false;
							const card = e.currentTarget;
							card.style.setProperty('--mouse-x', '50%');
							card.style.setProperty('--mouse-y', '50%');
						}}
					>
						<div class="feature-icon">{feature.icon}</div>
						<h3>{feature.title}</h3>
						<p>{feature.description}</p>
						<div class="feature-glow"></div>
						<div class="card-spotlight"></div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Zones Section -->
	<section class="zones-section">
		<div class="container">
			<h2 class="section-title">Explore Our Learning Zones</h2>
			<div class="zones-grid">
				{#each zones as zone, i}
					<a 
						href={zone.link} 
						class="zone-card animate-on-scroll"
						style="--delay: {i * 0.15}s; background: {zone.gradient}"
					>
						<div class="zone-icon">{zone.icon}</div>
						<h3>{zone.title}</h3>
						<p>{zone.description}</p>
						<span class="zone-arrow">→</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta-section">
		<div class="container">
			<div class="cta-content animate-on-scroll">
				<h2>Ready to Transform Your Learning?</h2>
				<p>
					Join ThrustLab today and unlock access to a wealth of resources and tools 
					designed to enhance your understanding of gas turbine and turbofan engines.
				</p>
				<div class="cta-buttons">
					<a 
						href="/sign-up" 
						class="cta-button large primary"
						onmousemove={(e) => {
							const btn = e.currentTarget;
							const rect = btn.getBoundingClientRect();
							const x = e.clientX - rect.left - rect.width / 2;
							const y = e.clientY - rect.top - rect.height / 2;
							btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
						}}
						onmouseleave={(e) => {
							const btn = e.currentTarget;
							btn.style.transform = '';
						}}
					>
						Sign Up Now
						<span class="button-shine"></span>
					</a>
				</div>
				<p class="cta-note">
					Already have an account? <a href="/login" class="link-hover">Log in here</a>
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	.homepage {
		width: 100%;
		overflow-x: hidden;
	}

	/* Hero Section */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: #0a1628;
	}

	.hero-background {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.parallax-layer {
		position: absolute;
		inset: -10%;
		transition: transform 0.3s ease-out;
	}

	.layer-1 {
		background: radial-gradient(circle at 30% 50%, rgba(56, 193, 114, 0.15) 0%, transparent 50%);
	}

	.layer-2 {
		background: radial-gradient(circle at 70% 50%, rgba(255, 167, 38, 0.1) 0%, transparent 50%);
	}

	.layer-3 {
		background: radial-gradient(circle at 50% 80%, rgba(255, 60, 126, 0.1) 0%, transparent 50%);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 900px;
		padding: 2rem;
	}

	.hero-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 700;
		color: white;
		margin: 0 0 1rem 0;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(135deg, #38C172 0%, #FFA726 50%, #FF3C7E 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-shift 3s ease infinite;
		background-size: 200% 200%;
	}

	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.hero-subtitle {
		font-family: 'Roboto', sans-serif;
		font-size: clamp(1.2rem, 3vw, 1.8rem);
		color: #38C172;
		margin: 0 0 1.5rem 0;
		font-weight: 500;
	}

	.hero-description {
		font-family: 'Roboto', sans-serif;
		font-size: clamp(1rem, 2vw, 1.2rem);
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.8;
		margin: 0 0 2.5rem 0;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta-button {
		position: relative;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		padding: 1rem 2.5rem;
		border-radius: 50px;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		will-change: transform;
	}

	.cta-button.primary {
		background: linear-gradient(135deg, #38C172 0%, #2da85f 100%);
		color: white;
		box-shadow: 0 10px 30px rgba(56, 193, 114, 0.3);
	}

	.cta-button.primary:hover {
		box-shadow: 0 15px 40px rgba(56, 193, 114, 0.4);
	}

	.cta-button.secondary {
		background: transparent;
		color: white;
		border: 2px solid #38C172;
	}

	.cta-button.secondary:hover {
		background: rgba(56, 193, 114, 0.1);
	}

	.cta-button.large {
		font-size: 1.3rem;
		padding: 1.25rem 3rem;
	}

	.button-shine {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s ease;
	}

	.cta-button:hover .button-shine {
		left: 100%;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.6);
		z-index: 2;
	}

	/* Animations */
	.animate-in {
		opacity: 0;
		transform: translateY(30px);
		animation: fadeInUp 0.8s ease forwards;
	}

	.delay-1 { animation-delay: 0.2s; }
	.delay-2 { animation-delay: 0.4s; }
	.delay-3 { animation-delay: 0.6s; }

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes animate-bounce {
		0%, 100% { transform: translateX(-50%) translateY(0); }
		50% { transform: translateX(-50%) translateY(10px); }
	}

	.animate-bounce {
		animation: animate-bounce 2s ease-in-out infinite;
	}

	/* Features Section */
	.features-section {
		padding: 6rem 2rem;
		background: #F6F7FA;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 700;
		color: #223A5E;
		text-align: center;
		margin: 0 0 3rem 0;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		position: relative;
		background: white;
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		opacity: 0;
		transform: translateY(50px);
		will-change: transform;
	}

	.feature-card::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: radial-gradient(circle, var(--accent-color, #38C172) 0%, transparent 70%);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
		opacity: 0;
		pointer-events: none;
	}

	.feature-card:hover::after {
		width: 400px;
		height: 400px;
		opacity: 0.1;
	}

	:global(.feature-card.visible) {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.feature-card:hover {
		transform: translateY(-10px) scale(1.02);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
	}

	.feature-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.feature-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.feature-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	.feature-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at center, var(--accent-color, #38C172) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.feature-card:hover .feature-glow {
		opacity: 0.1;
	}

	.card-spotlight {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
			rgba(255, 255, 255, 0.15),
			transparent 40%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.feature-card:hover .card-spotlight {
		opacity: 1;
	}

	/* Zones Section */
	.zones-section {
		padding: 6rem 2rem;
		background: linear-gradient(180deg, #F6F7FA 0%, #E8EAF0 100%);
	}

	.zones-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.zone-card {
		position: relative;
		padding: 3rem 2rem;
		border-radius: 1.5rem;
		color: white;
		text-decoration: none;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0;
		transform: scale(0.9);
		will-change: transform;
	}

	.zone-card::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(
			45deg,
			transparent 30%,
			rgba(255, 255, 255, 0.1) 50%,
			transparent 70%
		);
		transform: rotate(45deg);
		transition: all 0.6s ease;
	}

	.zone-card:hover::after {
		left: 100%;
	}

	:global(.zone-card.visible) {
		opacity: 1;
		transform: scale(1);
		transition-delay: var(--delay, 0s);
	}

	.zone-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.2);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.zone-card:hover::before {
		opacity: 1;
	}

	.zone-card:hover {
		transform: scale(1.05) translateY(-10px);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
	}

	.zone-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		transition: transform 0.4s ease;
	}

	.zone-card:hover .zone-icon {
		transform: scale(1.2) rotate(10deg);
	}

	.zone-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		margin: 0 0 0.75rem 0;
	}

	.zone-card p {
		font-family: 'Roboto', sans-serif;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		opacity: 0.95;
	}

	.zone-arrow {
		position: absolute;
		bottom: 2rem;
		right: 2rem;
		font-size: 2rem;
		transition: transform 0.4s ease;
	}

	.zone-card:hover .zone-arrow {
		transform: translateX(10px);
	}

	/* CTA Section */
	.cta-section {
		padding: 6rem 2rem;
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		color: white;
	}

	.cta-content {
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
		opacity: 0;
		transform: translateY(30px);
	}

	:global(.cta-content.visible) {
		opacity: 1;
		transform: translateY(0);
		transition: all 0.8s ease;
	}

	.cta-content h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2rem, 4vw, 3rem);
		margin: 0 0 1.5rem 0;
	}

	.cta-content > p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		line-height: 1.8;
		margin: 0 0 2.5rem 0;
		opacity: 0.95;
	}

	.cta-buttons {
		margin-bottom: 1.5rem;
	}

	.cta-note {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		opacity: 0.8;
	}

	.link-hover {
		color: #FFA726;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.link-hover:hover {
		color: #FF3C7E;
		text-decoration: underline;
	}

	/* Scroll animations */
	.animate-on-scroll {
		opacity: 0;
		transform: translateY(50px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.animate-on-scroll.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.cta-button {
			width: 100%;
			justify-content: center;
		}

		.features-grid,
		.zones-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
