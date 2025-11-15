<script lang="ts">
	import { onMount } from 'svelte';
	
	let heroRef: HTMLElement;
	let isHovering = $state(false);
	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	const BASE_DRIFT_SPEED = 0.61;

	// Canvas references for each layer
	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	let farClouds = $state([
		{ x: -200, y: 380, w: 350, h: 120, color: 'rgba(255, 255, 255, 0.5)' },
		{ x: 400, y: 480, w: 400, h: 140, color: 'rgba(255, 255, 255, 0.45)' },
		{ x: 1200, y: 430, w: 420, h: 150, color: 'rgba(255, 255, 255, 0.48)' },
		{ x: 2000, y: 360, w: 380, h: 130, color: 'rgba(255, 255, 255, 0.47)' }
	]);

	let midClouds = $state([
		{ x: -100, y: 580, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.65)' },
		{ x: 500, y: 680, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.62)' },
		{ x: 1200, y: 630, w: 340, h: 115, color: 'rgba(255, 255, 255, 0.64)' },
		{ x: 1900, y: 660, w: 310, h: 105, color: 'rgba(255, 255, 255, 0.63)' },
		{ x: 2600, y: 600, w: 330, h: 112, color: 'rgba(255, 255, 255, 0.62)' }
	]);

	let nearClouds = $state([
		{ x: -150, y: 880, w: 250, h: 80, color: 'rgba(255, 255, 255, 0.8)' },
		{ x: 400, y: 930, w: 270, h: 85, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 950, y: 980, w: 260, h: 82, color: 'rgba(255, 255, 255, 0.79)' },
		{ x: 1500, y: 900, w: 280, h: 87, color: 'rgba(255, 255, 255, 0.77)' },
		{ x: 2100, y: 960, w: 265, h: 84, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 2700, y: 920, w: 275, h: 86, color: 'rgba(255, 255, 255, 0.8)' }
	]);

	// Scroll-based background transition (REVERSED)
	let scrollProgress = $state(0); // 0 = midnight/night, 0.5 = evening, 1 = day

	// Throttle scroll handler
	let lastScrollProgress = -1;
	let scrollRafId: number | null = null;
	let skyRegenerationTimeout: number | null = null;

	onMount(() => {
		mounted = true;

		// Mouse tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Initialize sky
		initializeSkies();

		// Start continuous animation loop
		let animationId: number;
		const animate = () => {
			animateCloudLayers();
			animationId = requestAnimationFrame(animate);
		};
		animate();

		// Scroll handler for background transition
		const handleScroll = () => {
			if (scrollRafId !== null) return;
			
			scrollRafId = requestAnimationFrame(() => {
				const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
				const currentScroll = window.scrollY;
				const progress = Math.min(currentScroll / scrollHeight, 1);
				
				// Only update if progress changed by more than 1%
				if (Math.abs(progress - lastScrollProgress) > 0.01) {
					scrollProgress = progress;
					lastScrollProgress = progress;
					
					// Debounce expensive sky regeneration
					if (skyRegenerationTimeout !== null) {
						clearTimeout(skyRegenerationTimeout);
					}
					skyRegenerationTimeout = setTimeout(() => {
						initializeSkies();
						skyRegenerationTimeout = null;
					}, 100) as unknown as number;
				}
				
				scrollRafId = null;
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial call

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
			window.removeEventListener('scroll', handleScroll);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			observer.disconnect();
			
			if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
			if (skyRegenerationTimeout !== null) clearTimeout(skyRegenerationTimeout);
		};
	});

	// Initialize sky with dynamic gradient based on scroll progress
	function initializeSkies() {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;

		const width = skyCanvas.width;
		const height = skyCanvas.height;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Define color stops for midnight, night, evening, and day (REVERSED)
		let topColor, midTopColor, midBottomColor, bottomColor;

		if (scrollProgress < 0.25) {
			// Midnight (0 to 0.25) - Black gradient
			const t = scrollProgress / 0.25; // Normalize to 0-1
			topColor = interpolateColor('#000000', '#0a1628', t);       // Pure black → Deep navy
			midTopColor = interpolateColor('#0a0a0a', '#1a2847', t);    // Near black → Dark blue
			midBottomColor = interpolateColor('#1a1a1a', '#2d3f66', t); // Dark gray → Medium blue
			bottomColor = interpolateColor('#2a2a2a', '#4a5f8f', t);    // Charcoal → Lighter blue
		} else if (scrollProgress < 0.5) {
			// Night (0.25 to 0.5)
			const t = (scrollProgress - 0.25) / 0.25; // Normalize to 0-1
			topColor = interpolateColor('#0a1628', '#FF6B6B', t);       // Deep navy → Orange
			midTopColor = interpolateColor('#1a2847', '#FF8C42', t);    // Dark blue → Light orange
			midBottomColor = interpolateColor('#2d3f66', '#FFB347', t); // Medium blue → Peach
			bottomColor = interpolateColor('#4a5f8f', '#FFD700', t);    // Lighter blue → Gold
		} else if (scrollProgress < 0.75) {
			// Evening (0.5 to 0.75)
			const t = (scrollProgress - 0.5) / 0.25; // Normalize to 0-1
			topColor = interpolateColor('#FF6B6B', '#87CEEB', t);       // Orange → Sky blue
			midTopColor = interpolateColor('#FF8C42', '#8FB4D4', t);    // Light orange → Softer blue
			midBottomColor = interpolateColor('#FFB347', '#BDDDF0', t); // Peach → Muted light blue
			bottomColor = interpolateColor('#FFD700', '#D5E8F0', t);    // Gold → Softer blue
		} else {
			// Day (0.75 to 1) - Full daylight
			topColor = '#87CEEB';      // Sky blue
			midTopColor = '#8FB4D4';   // Softer blue
			midBottomColor = '#BDDDF0'; // Muted light blue
			bottomColor = '#D5E8F0';    // Softer blue
		}

		// Create gradient with interpolated colors
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, topColor);
		gradient.addColorStop(0.3, midTopColor);
		gradient.addColorStop(0.6, midBottomColor);
		gradient.addColorStop(1, bottomColor);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add stars (only visible at night - before 0.6 scroll progress)
		if (scrollProgress < 0.6) {
			const starOpacity = scrollProgress < 0.25 
				? 0.8 // Full stars in midnight
				: 1 - ((scrollProgress - 0.25) / 0.35); // Fade out as we approach day
			
			const starCount = scrollProgress < 0.25 ? 100 : 75;
			ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * 0.8})`;
			
			// Batch render stars for better performance
			ctx.beginPath();
			for (let i = 0; i < starCount; i++) {
				const x = Math.random() * width;
				const y = Math.random() * height * 0.6; // Stars in upper portion
				const radius = Math.random() * 1.5 + 0.5;
				
				ctx.moveTo(x + radius, y);
				ctx.arc(x, y, radius, 0, Math.PI * 2);
			}
			ctx.fill();
		}

		// Add a simple moon (visible during night phases - before 0.6 scroll progress)
		if (scrollProgress < 0.6) {
			const moonOpacity = scrollProgress < 0.25 
				? 0.9 // Full moon in midnight
				: scrollProgress < 0.5
					? 0.85 // Slightly dimmer in night phase
					: 1 - ((scrollProgress - 0.5) / 0.1); // Fade out in evening
			
			const moonX = width * 0.85; // Right side of sky
			const moonY = height * 0.2; // Upper portion
			const moonRadius = 40; // Simple, modest size

			// Subtle moon glow
			const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2.5);
			moonGlow.addColorStop(0, `rgba(255, 255, 245, ${moonOpacity * 0.15})`);
			moonGlow.addColorStop(1, 'rgba(255, 255, 245, 0)');
			ctx.fillStyle = moonGlow;
			ctx.fillRect(moonX - moonRadius * 2.5, moonY - moonRadius * 2.5, moonRadius * 5, moonRadius * 5);

			// Simple moon body
			const moonGradient = ctx.createRadialGradient(
				moonX - moonRadius * 0.3, 
				moonY - moonRadius * 0.3, 
				moonRadius * 0.2, 
				moonX, 
				moonY, 
				moonRadius
			);
			moonGradient.addColorStop(0, '#fffef5');
			moonGradient.addColorStop(0.7, '#f5f3e8');
			moonGradient.addColorStop(1, '#e8e6d8');
			
			ctx.globalAlpha = moonOpacity;
			ctx.fillStyle = moonGradient;
			ctx.beginPath();
			ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
			ctx.fill();
			
			// Add subtle craters for realism
			ctx.fillStyle = 'rgba(220, 218, 210, 0.3)';
			ctx.beginPath();
			ctx.arc(moonX - 10, moonY + 8, 8, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(moonX + 12, moonY - 5, 6, 0, Math.PI * 2);
			ctx.fill();
			
			ctx.globalAlpha = 1; // Reset alpha
		}

		// Add a simple sun (visible during day phase - after 0.75 scroll progress)
		if (scrollProgress >= 0.75) {
			const sunOpacity = Math.min((scrollProgress - 0.75) / 0.15, 1); // Fade in smoothly
			
			const sunX = width * 0.2; // Left side of sky
			const sunY = height * 0.18; // Upper portion
			const sunRadius = 50; // Simple, modest size

			// Warm sun glow
			const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 3);
			sunGlow.addColorStop(0, `rgba(255, 220, 100, ${sunOpacity * 0.3})`);
			sunGlow.addColorStop(0.5, `rgba(255, 200, 80, ${sunOpacity * 0.15})`);
			sunGlow.addColorStop(1, 'rgba(255, 180, 60, 0)');
			ctx.fillStyle = sunGlow;
			ctx.fillRect(sunX - sunRadius * 3, sunY - sunRadius * 3, sunRadius * 6, sunRadius * 6);

			// Simple sun body
			const sunGradient = ctx.createRadialGradient(
				sunX - sunRadius * 0.2, 
				sunY - sunRadius * 0.2, 
				sunRadius * 0.2, 
				sunX, 
				sunY, 
				sunRadius
			);
			sunGradient.addColorStop(0, '#FFF9E6');
			sunGradient.addColorStop(0.6, '#FFE87C');
			sunGradient.addColorStop(1, '#FFD54F');
			
			ctx.globalAlpha = sunOpacity;
			ctx.fillStyle = sunGradient;
			ctx.beginPath();
			ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
			ctx.fill();
			
			ctx.globalAlpha = 1; // Reset alpha
		}
	}

	// Helper function to interpolate between two hex colors
	function interpolateColor(color1: string, color2: string, t: number): string {
		const c1 = parseInt(color1.slice(1), 16);
		const c2 = parseInt(color2.slice(1), 16);
		
		const r1 = (c1 >> 16) & 255;
		const g1 = (c1 >> 8) & 255;
		const b1 = c1 & 255;
		
		const r2 = (c2 >> 16) & 255;
		const g2 = (c2 >> 8) & 255;
		const b2 = c2 & 255;
		
		const r = Math.round(r1 + (r2 - r1) * t);
		const g = Math.round(g1 + (g2 - g1) * t);
		const b = Math.round(b1 + (b2 - b1) * t);
		
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	function animateCloudLayers() {
		if (!farCloudsCanvas || !midCloudsCanvas || !nearCloudsCanvas) return;

		const farCtx = farCloudsCanvas.getContext('2d');
		const midCtx = midCloudsCanvas.getContext('2d');
		const nearCtx = nearCloudsCanvas.getContext('2d');

		if (!farCtx || !midCtx || !nearCtx) return;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;

		// Far clouds
		const farLayerSpeed = 0.3;
		const farMouseMultiplier = 15;
		const farCursorOffsetX = -(deltaX / centerX) * farMouseMultiplier;
		const farCursorOffsetY = -(deltaY / centerY) * farMouseMultiplier * 0.5;

		farCtx.clearRect(0, 0, farCloudsCanvas.width, farCloudsCanvas.height);
		
		for (const cloud of farClouds) {
			cloud.x += BASE_DRIFT_SPEED * farLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > farCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(farCtx, cloud.x + farCursorOffsetX, cloud.y + farCursorOffsetY, cloud.w, cloud.h, cloud.color, 20);
		}

		// Mid clouds
		const midLayerSpeed = 0.7;
		const midMouseMultiplier = 30;
		const midCursorOffsetX = -(deltaX / centerX) * midMouseMultiplier;
		const midCursorOffsetY = -(deltaY / centerY) * midMouseMultiplier * 0.5;

		midCtx.clearRect(0, 0, midCloudsCanvas.width, midCloudsCanvas.height);
		
		for (const cloud of midClouds) {
			cloud.x += BASE_DRIFT_SPEED * midLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > midCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(midCtx, cloud.x + midCursorOffsetX, cloud.y + midCursorOffsetY, cloud.w, cloud.h, cloud.color, 20);
		}

		// Near clouds
		const nearLayerSpeed = 1.2;
		const nearMouseMultiplier = 50;
		const nearCursorOffsetX = -(deltaX / centerX) * nearMouseMultiplier;
		const nearCursorOffsetY = -(deltaY / centerY) * nearMouseMultiplier * 0.5;

		nearCtx.clearRect(0, 0, nearCloudsCanvas.width, nearCloudsCanvas.height);
		
		for (const cloud of nearClouds) {
			cloud.x += BASE_DRIFT_SPEED * nearLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > nearCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(nearCtx, cloud.x + nearCursorOffsetX, cloud.y + nearCursorOffsetY, cloud.w, cloud.h, cloud.color, 20);
		}
	}

	function drawEnhancedCloud(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
		blur: number
	) {
		const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
		if (!rgbaMatch) return;
		
		const [, r, g, b, a = '1'] = rgbaMatch;
		const baseAlpha = parseFloat(a);
		const boostedAlpha = Math.min(baseAlpha * 1.3, 0.95);

		const puffs = [
			{ x: x, y: y, radiusX: width * 0.35, radiusY: height * 0.5 },
			{ x: x - width * 0.25, y: y + height * 0.1, radiusX: width * 0.28, radiusY: height * 0.42 },
			{ x: x + width * 0.25, y: y + height * 0.15, radiusX: width * 0.3, radiusY: height * 0.45 },
			{ x: x - width * 0.1, y: y - height * 0.2, radiusX: width * 0.25, radiusY: height * 0.38 },
			{ x: x + width * 0.15, y: y - height * 0.15, radiusX: width * 0.22, radiusY: height * 0.35 }
		];

		ctx.save();
		ctx.filter = 'none';
		
		puffs.forEach(puff => {
			const puffGradient = ctx.createRadialGradient(
				puff.x - puff.radiusX * 0.2,
				puff.y - puff.radiusY * 0.2,
				0,
				puff.x,
				puff.y,
				Math.max(puff.radiusX, puff.radiusY)
			);
			puffGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${boostedAlpha})`);
			puffGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${boostedAlpha * 0.8})`);
			puffGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${boostedAlpha * 0.3})`);
			
			ctx.fillStyle = puffGradient;
			ctx.beginPath();
			ctx.ellipse(puff.x, puff.y, puff.radiusX, puff.radiusY, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.restore();

		// Add highlights
		ctx.save();
		ctx.filter = 'none';
		ctx.globalAlpha = 0.4;
		
		const highlightGradient = ctx.createRadialGradient(
			x - width * 0.12, y - height * 0.18, 0,
			x - width * 0.12, y - height * 0.18, width * 0.3
		);
		highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
		highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
		highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		
		ctx.fillStyle = highlightGradient;
		ctx.beginPath();
		ctx.ellipse(x - width * 0.12, y - height * 0.18, width * 0.3, height * 0.25, 0, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.restore();
	}

	const features = [
		{
			icon: '🎮',
			title: 'Interactive 3D Simulations',
			description: 'Manipulate and analyze engineering components in a real-time 3D environment.',
			color: '#FFD966'
		},
		{
			icon: '📚',
			title: 'Educational Modules',
			description: 'Dive into detailed tutorials on Gas Turbine and Turbofan Engine systems.',
			color: '#87CEEB'
		},
		{
			icon: '📊',
			title: 'Instant Assessments',
			description: 'Test your knowledge with integrated quizzes and track your performance over time.',
			color: '#00CED1'
		},
		{
			icon: '🤖',
			title: 'AI-Powered Assistance',
			description: 'Get expert guidance and technical support from our advanced AI assistant, JAJA.',
			color: '#4CAF50'
		}
	];

	const zones = [
		{
			title: 'HANGAR ZONE',
			description: 'A learning space where students explore the history and evolution of gas turbine engines, including their types and developments over time.',
			link: '/hangar-zone',
			icon: '/icons/hangar-zone.png',
			gradient: 'linear-gradient(135deg, #223A5E 0%, #74B3D4 100%)'
		},
		{
			title: 'TURBOFAN ZONE',
			description: 'An immersive hub where students explore a fully rotatable 3D turbofan engine, interact with its components, and discover each section that powers modern flight.',
			link: '/turbofan-zone',
			icon: '/icons/turbofan-engine.png',
			gradient: 'linear-gradient(135deg, #74B3D4 0%, #D75E2E 100%)'
		},
		{
			title: 'OVERHAUL STATION',
			description: 'A hands-on virtual workshop where students experience the assembly and disassembly of turbofan engine parts while learning the fundamentals of gas turbine engine overhaul.',
			link: '/overhaul-station',
			icon: '/icons/overhaul-station.png',
			gradient: 'linear-gradient(135deg, #D75E2E 0%, #9B8AA4 100%)'
		},
		{
			title: 'TEST BAY',
			description: 'A checkpoint where students test their knowledge from the Hangar Zone, Turbofan Engine, and Overhaul Bay—time to prove your skills!',
			link: '/test-bay',
			icon: '/icons/test-bay.png',
			gradient: 'linear-gradient(135deg, #9B8AA4 0%, #223A5E 100%)'
		},
		{
			title: 'JAJA AI-ASSISTANT',
			description: 'Your co-engineer specialized in turbofan engines—ready to answer your questions, guide your learning, and keep your curiosity soaring!',
			link: '/jaja',
			icon: '/icons/jaja.png',
			gradient: 'linear-gradient(135deg, #223A5E 0%, #74B3D4 100%)'
		}
	];
</script>

<!-- Anime-Style Parallax Background System - Full Page Coverage -->
<div class="parallax-background-system">
	<!-- Static Sky Layer with Stars -->
	<canvas 
		bind:this={skyCanvas}
		class="parallax-layer sky-layer"
		width="3200"
		height="1800"
	></canvas>

	<!-- Far Clouds Layer (slowest parallax) -->
	<canvas 
		bind:this={farCloudsCanvas}
		class="parallax-layer far-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<!-- Mid Clouds Layer (medium parallax) -->
	<canvas 
		bind:this={midCloudsCanvas}
		class="parallax-layer mid-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<!-- Near Clouds Layer (fastest parallax) -->
	<canvas 
		bind:this={nearCloudsCanvas}
		class="parallax-layer near-clouds-layer"
		width="3200"
		height="1800"
	></canvas>
</div>

<div class="homepage">
	<!-- Hero Section -->
	<section class="hero" bind:this={heroRef}>
		
		<div class="hero-content">
			<h1 class="hero-title animate-in">
				Welcome to <span class="gradient-text">ThrustLab</span>
			</h1>
			<p class="hero-subtitle animate-in delay-1">
				Experience Learning at Full Thrust
			</p>
			<p class="hero-description animate-in delay-2">
				Step inside a virtual hangar where learning takes flight — explore, build, and understand turbofan engines through immersive 3D interaction and real-time AI support.
			</p>
			<div class="hero-actions animate-in delay-3">
				<a 
					href="/sign-up" 
					class="cta-button primary"
				>
					Get Started
					<span class="button-shine"></span>
				</a>
				<a 
					href="/login" 
					class="cta-button secondary"
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
			<h2 class="section-title">Overview</h2>
			<div class="overview-content animate-on-scroll">
				<p>
					The researchers developed a web-based interactive 3D simulator equipped with AI-integrated assistance to teach third-year Aeronautical Engineering students the fundamental concepts and operational principles of gas turbine (turbofan) engines. The simulator aimed to provide an engaging, hands-on virtual environment where learners could explore, assemble, and disassemble engine components while receiving optional real-time AI-guided explanations. In addition, the system featured a quiz-type assessment designed to measure and reinforce students' learning retention after interacting with the simulator.
				</p>
			</div>
			<div class="features-grid" style="display: none;">
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
						<div class="zone-icon">
							<img src={zone.icon} alt={zone.title} />
						</div>
						<h3>{zone.title}</h3>
						<p>{zone.description}</p>
						<span class="zone-arrow">→</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Researchers Section -->
	<section class="researchers-section">
		<div class="container">
			<!-- Section Header -->
			<div class="section-header animate-on-scroll">
				<div class="header-line"></div>
				<h2 class="section-title">Meet the Researchers</h2>
			</div>

			<!-- Researchers Cards -->
			<div class="researchers-container animate-on-scroll">
				<div class="researcher-card" style="--delay: 0s">
					<div class="card-inner">
						<div class="card-front">
							<div class="photo-wrapper">
								<div class="photo-glow"></div>
								<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Cpath fill='%23b0b0b0' d='M100 95c13.8 0 25-11.2 25-25s-11.2-25-25-25-25 11.2-25 25 11.2 25 25 25zm0 12.5c-16.7 0-50 8.4-50 25v18.8c0 3.4 2.8 6.2 6.2 6.2h87.5c3.4 0 6.2-2.8 6.2-6.2v-18.8c0-16.6-33.2-25-49.9-25z'/%3E%3C/svg%3E" alt="Jannah Michellaine C. Cristobal" />
							</div>
							<div class="card-info">
								<h3>Jannah Michellaine C. Cristobal</h3>
								<div class="role-badge">Researcher</div>
							</div>
						</div>
					</div>
				</div>

				<div class="researcher-card" style="--delay: 0.1s">
					<div class="card-inner">
						<div class="card-front">
							<div class="photo-wrapper">
								<div class="photo-glow"></div>
								<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Cpath fill='%23b0b0b0' d='M100 95c13.8 0 25-11.2 25-25s-11.2-25-25-25-25 11.2-25 25 11.2 25 25 25zm0 12.5c-16.7 0-50 8.4-50 25v18.8c0 3.4 2.8 6.2 6.2 6.2h87.5c3.4 0 6.2-2.8 6.2-6.2v-18.8c0-16.6-33.2-25-49.9-25z'/%3E%3C/svg%3E" alt="Alfred Rupert D. De Guzman" />
							</div>
							<div class="card-info">
								<h3>Alfred Rupert D. De Guzman</h3>
								<div class="role-badge">Researcher</div>
							</div>
						</div>
					</div>
				</div>

				<div class="researcher-card" style="--delay: 0.2s">
					<div class="card-inner">
						<div class="card-front">
							<div class="photo-wrapper">
								<div class="photo-glow"></div>
								<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Cpath fill='%23b0b0b0' d='M100 95c13.8 0 25-11.2 25-25s-11.2-25-25-25-25 11.2-25 25 11.2 25 25 25zm0 12.5c-16.7 0-50 8.4-50 25v18.8c0 3.4 2.8 6.2 6.2 6.2h87.5c3.4 0 6.2-2.8 6.2-6.2v-18.8c0-16.6-33.2-25-49.9-25z'/%3E%3C/svg%3E" alt="Janssen M. Palac" />
							</div>
							<div class="card-info">
								<h3>Janssen M. Palac</h3>
								<div class="role-badge">Researcher</div>
							</div>
						</div>
					</div>
				</div>

				<div class="researcher-card" style="--delay: 0.3s">
					<div class="card-inner">
						<div class="card-front">
							<div class="photo-wrapper">
								<div class="photo-glow"></div>
								<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Cpath fill='%23b0b0b0' d='M100 95c13.8 0 25-11.2 25-25s-11.2-25-25-25-25 11.2-25 25 11.2 25 25 25zm0 12.5c-16.7 0-50 8.4-50 25v18.8c0 3.4 2.8 6.2 6.2 6.2h87.5c3.4 0 6.2-2.8 6.2-6.2v-18.8c0-16.6-33.2-25-49.9-25z'/%3E%3C/svg%3E" alt="Marc Ashriel V. San Pedro" />
							</div>
							<div class="card-info">
								<h3>Marc Ashriel V. San Pedro</h3>
								<div class="role-badge">Researcher</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Bottom Info Bar -->
			<div class="info-bar animate-on-scroll">
				<div class="info-item">
					<div class="info-icon">🎓</div>
					<div class="info-text">
						<span class="info-label">Academic Year</span>
						<span class="info-value">2025-2026</span>
					</div>
				</div>
				<div class="info-divider"></div>
				<div class="info-item">
					<div class="info-icon">👨‍🏫</div>
					<div class="info-text">
						<span class="info-label">Research Adviser</span>
						<span class="info-value">Engr. Johannah Marie T. Reynaldo</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	/* Removed scroll-behavior: smooth from html for better scroll performance */
	/* Smooth scrolling adds significant overhead when combined with canvas animations */

	.homepage {
		width: 100%;
		overflow-x: hidden;
		background: transparent;
		position: relative;
		/* Performance: Use CSS containment to isolate layout/paint work */
		contain: layout style paint;
	}

	/* Hero Section */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* ===== ANIME-STYLE PARALLAX BACKGROUND SYSTEM ===== */
	.parallax-background-system {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
	}

	/* Add gradient mask at bottom to fade into CTA section */
	.parallax-background-system::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(34, 58, 94, 0.5) 50%,
			rgba(34, 58, 94, 0.9) 100%
		);
		z-index: 10;
		pointer-events: none;
	}

	.parallax-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		will-change: transform;
		pointer-events: none;
		/* Enable seamless wrapping by allowing canvas to extend beyond viewport */
		transform-origin: center center;
		/* Performance: Force GPU acceleration */
		transform: translateZ(0);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	/* Sky Layer - Static, no movement */
	.sky-layer {
		z-index: 1;
		/* No transform, stays fixed */
	}

	/* Far Clouds - Slowest parallax with seamless wrapping */
	.far-clouds-layer {
		z-index: 2;
		/* Reduced transition duration for snappier scroll response */
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
		will-change: transform;
	}

	/* Mid Clouds - Medium parallax with seamless wrapping */
	.mid-clouds-layer {
		z-index: 3;
		/* Reduced transition duration for snappier scroll response */
		transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
		will-change: transform;
	}

	/* Near Clouds - Fastest parallax with seamless wrapping */
	.near-clouds-layer {
		z-index: 4;
		/* Reduced transition duration for snappier scroll response */
		transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
		will-change: transform;
	}



	.hero-content {
		position: relative;
		z-index: 10;
		text-align: center;
		max-width: 900px;
		padding: 2rem;
	}

	/* Unified Animated Gradient for All Main Headings */
	@keyframes gradient-flash {
		0%, 100% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 50% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		75% {
			background-position: 50% 50%;
		}
	}

	.hero-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		margin: 0 0 1rem 0;
		line-height: 1.2;
		color: white;
		text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0, 0, 0, 0.8);
	}

	.gradient-text {
		color: var(--ui-yellow);
		text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0, 0, 0, 0.8);
	}

	.hero-subtitle {
		font-family: var(--font-special);
		font-size: clamp(1.2rem, 3vw, 1.8rem);
		margin: 0 0 1.5rem 0;
		font-weight: 400;
		color: var(--ui-yellow);
		text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0, 0, 0, 0.8);
	}

	.hero-description {
		font-family: var(--font-body);
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		color: #FFFFFF;
		line-height: 1.8;
		margin: 0 0 2.5rem 0;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
		font-weight: 500;
		text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0, 0, 0, 0.8);
	}

	.hero-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta-button {
		position: relative;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 700;
		padding: 1.25rem 3rem;
		border-radius: 50px;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		will-change: transform;
		cursor: pointer;
	}

	.cta-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
		pointer-events: none;
	}

	.cta-button:hover::before {
		width: 400px;
		height: 400px;
	}

	.cta-button.primary {
		background: linear-gradient(135deg, var(--ui-yellow) 0%, #FFE66D 100%);
		color: #000000;
		border: 3px solid var(--ui-yellow);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.5), 0 0 40px rgba(255, 217, 102, 0.2);
		font-weight: 700;
	}

	.cta-button.primary:hover {
		background: linear-gradient(135deg, #FFE66D 0%, var(--ui-yellow) 100%);
		transform: translateY(-5px) scale(1.05);
		box-shadow: 0 12px 35px rgba(255, 217, 102, 0.7), 0 0 60px rgba(255, 217, 102, 0.4);
		border-color: #FFE66D;
	}

	.cta-button.secondary {
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--font-secondary);
		border: 3px solid rgba(135, 206, 235, 0.5);
		box-shadow: 0 4px 15px rgba(135, 206, 235, 0.3);
	}

	.cta-button.secondary:hover {
		background: rgba(135, 206, 235, 0.3);
		border-color: var(--ui-light-blue);
		transform: translateY(-5px) scale(1.05);
		box-shadow: 0 8px 25px rgba(135, 206, 235, 0.5), 0 0 40px rgba(135, 206, 235, 0.3);
	}

	.button-shine {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
		transition: left 0.6s ease;
		pointer-events: none;
	}

	.cta-button:hover .button-shine {
		left: 100%;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		color: var(--font-secondary);
		z-index: 10;
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
		background: transparent;
		position: relative;
		z-index: 1;
		/* Performance: Use CSS containment to isolate rendering work */
		contain: layout style paint;
		content-visibility: auto; /* Only render when visible in viewport */
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 900;
		text-align: center;
		margin: 0 0 3rem 0;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 25%,
			var(--ui-light-blue) 50%,
			var(--font-accent-cyan) 75%,
			var(--ui-yellow) 100%
		);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 4s ease-in-out infinite;
		filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 217, 102, 0.3));
		/* Performance: Isolate this expensive animation */
		will-change: background-position;
		contain: paint;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		position: relative;
		/* Glassmorphism / Liquid Glass Effect with UI colors */
		background: rgba(10, 47, 53, 0.4); /* Dark Teal with transparency */
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(135, 206, 235, 0.3); /* Light Blue border */
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		opacity: 0;
		transform: translateY(50px);
		will-change: transform;
		/* Performance: GPU acceleration and containment */
		transform: translate3d(0, 50px, 0);
		contain: layout style paint;
	}

	.feature-card::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: radial-gradient(circle, var(--accent-color, #FFD966) 0%, transparent 70%);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
		opacity: 0;
		pointer-events: none;
	}

	.feature-card:hover {
		/* Performance: Use translate3d for GPU acceleration */
		transform: translate3d(0, -10px, 0);
		box-shadow: 0 15px 50px rgba(0, 206, 209, 0.3); /* Cyan glow */
		background: rgba(28, 62, 74, 0.5); /* Darker on hover */
		border: 1px solid var(--font-accent-cyan);
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
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 900;
		margin: 0 0 1rem 0;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 50%,
			var(--ui-yellow) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 3.5s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
	}

	.feature-card p {
		font-family: var(--font-body);
		color: var(--font-secondary);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
		line-height: 1.6;
		margin: 0;
	}

	.feature-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at center, var(--accent-color, #FFD966) 0%, transparent 70%);
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
			rgba(255, 217, 102, 0.2),
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
		background: transparent;
		position: relative;
		z-index: 1;
		/* Performance: Use CSS containment to isolate rendering work */
		contain: layout style paint;
		content-visibility: auto; /* Only render when visible in viewport */
	}

	.zones-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
		max-width: 100%;
		overflow: visible;
	}

	.zone-card {
		position: relative;
		padding: 2rem 1.5rem;
		border-radius: 1.5rem;
		color: var(--font-primary);
		text-decoration: none;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0;
		transform: scale(0.9);
		will-change: transform;
		/* Glassmorphism Effect */
		background: rgba(10, 47, 53, 0.4) !important;
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.18);
		display: flex;
		flex-direction: column;
		min-height: 380px;
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
		box-shadow: 0 12px 40px rgba(255, 217, 102, 0.4); /* Yellow glow */
		background: rgba(28, 46, 58, 0.6) !important;
		border: 1px solid var(--ui-yellow);
	}

	.zone-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		transition: transform 0.4s ease;
		flex-shrink: 0;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
	}

	.zone-card:hover .zone-icon {
		transform: scale(1.2) rotate(10deg);
		filter: drop-shadow(0 4px 12px rgba(255, 217, 102, 0.6));
	}

	.zone-card h3 {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 900;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-yellow) 50%,
			var(--ui-yellow) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 3s ease-in-out infinite;
		filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8));
	}

	.zone-card p {
		font-family: var(--font-body);
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0 0 1.5rem 0;
		color: var(--font-secondary);
		flex-grow: 1;
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
	/* Researchers Section */
	.researchers-section {
		padding: 10rem 2rem 8rem;
		background: transparent;
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		align-items: center;
		/* Performance: Use CSS containment to isolate rendering work */
		contain: layout style paint;
		content-visibility: auto; /* Only render when visible in viewport */
	}

	/* Section Header */
	.section-header {
		text-align: center;
		margin-bottom: 6rem;
		position: relative;
	}

	.header-line {
		width: 100px;
		height: 4px;
		background: linear-gradient(90deg, transparent, var(--ui-yellow), transparent);
		margin: 0 auto 2rem;
		border-radius: 2px;
		animation: pulse-glow 2s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%, 100% {
			opacity: 0.5;
			transform: scaleX(1);
		}
		50% {
			opacity: 1;
			transform: scaleX(1.2);
		}
	}

	.researchers-section .section-title {
		font-size: clamp(3rem, 6vw, 5rem);
		letter-spacing: -2px;
	}

	/* Overview Content */
	.overview-content {
		max-width: 1000px;
		margin: 0 auto;
		padding: 3rem;
		text-align: center;
		/* Glassmorphism Effect with UI colors */
		background: rgba(10, 47, 53, 0.5); /* Dark Teal */
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(135, 206, 235, 0.3);
	}

	.overview-content p {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--font-secondary);
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
		margin: 0;
	}

	/* Zone Icon Images */
	.zone-icon img {
		width: 60px;
		height: 60px;
		object-fit: contain;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	/* Researchers Container */
	.researchers-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 2.5rem;
		max-width: 1200px;
		margin: 0 auto 5rem;
		padding: 0 1rem;
	}

	/* Researcher Card */
	.researcher-card {
		position: relative;
		height: 360px;
		perspective: 1000px;
		animation: fadeInUp 0.8s ease forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.researcher-card:hover .card-inner {
		transform: translateY(-15px);
	}

	.card-front {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
		border-radius: 20px;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.2);
		transition: all 0.4s ease;
		overflow: hidden;
	}

	.card-front::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 217, 102, 0.1) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.researcher-card:hover .card-front {
		border-color: var(--ui-yellow);
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
		box-shadow: 0 20px 60px rgba(255, 217, 102, 0.3), 0 0 80px rgba(135, 206, 235, 0.2);
	}

	.researcher-card:hover .card-front::before {
		opacity: 1;
	}

	/* Photo Wrapper */
	.photo-wrapper {
		position: relative;
		width: 160px;
		height: 160px;
		border-radius: 50%;
	}

	.photo-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--ui-yellow) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
		z-index: 0;
	}

	.researcher-card:hover .photo-glow {
		opacity: 0.3;
		animation: pulse-ring 2s ease-in-out infinite;
	}

	@keyframes pulse-ring {
		0%, 100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.3;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 0.5;
		}
	}

	.photo-wrapper img {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
		transition: all 0.4s ease;
		z-index: 1;
	}

	.researcher-card:hover .photo-wrapper img {
		border-color: var(--ui-yellow);
		box-shadow: 0 12px 50px rgba(255, 217, 102, 0.5), 0 0 60px rgba(255, 217, 102, 0.3);
		transform: scale(1.05);
	}

	/* Card Info */
	.card-info {
		text-align: center;
		z-index: 2;
	}

	.card-info h3 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 800;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
		transition: all 0.3s ease;
		background: linear-gradient(
			90deg,
			#FFFFFF 0%,
			var(--ui-light-blue) 50%,
			#FFFFFF 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 4s ease-in-out infinite;
		filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.8));
	}

	.researcher-card:hover .card-info h3 {
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-yellow) 50%,
			var(--ui-yellow) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 2.5s ease-in-out infinite;
		filter: drop-shadow(0 2px 10px rgba(255, 217, 102, 0.6)) drop-shadow(0 0 20px rgba(255, 217, 102, 0.4));
	}

	.role-badge {
		display: inline-block;
		padding: 0.5rem 1.5rem;
		background: rgba(135, 206, 235, 0.2);
		border: 1px solid rgba(135, 206, 235, 0.4);
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ui-light-blue);
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.3s ease;
	}

	.researcher-card:hover .role-badge {
		background: rgba(255, 217, 102, 0.2);
		border-color: var(--ui-yellow);
		color: var(--ui-yellow);
		box-shadow: 0 0 20px rgba(255, 217, 102, 0.3);
	}

	/* Info Bar */
	.info-bar {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		padding: 2rem 3rem;
		background: rgba(0, 0, 0, 0.3);
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 100px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.info-icon {
		font-size: 2.5rem;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
	}

	.info-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.info-label {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--ui-light-blue);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.info-value {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 700;
		background: linear-gradient(
			90deg,
			#FFFFFF 0%,
			var(--font-accent-cyan) 50%,
			#FFFFFF 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 3.5s ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
	}

	.info-divider {
		width: 2px;
		height: 60px;
		background: linear-gradient(180deg, transparent, rgba(135, 206, 235, 0.5), transparent);
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

	@media (max-width: 1400px) {
		.zones-grid {
			grid-template-columns: repeat(3, 1fr);
		}
		
		.zone-card {
			min-height: 360px;
		}
	}

	@media (max-width: 1200px) {
		.researchers-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}
	}

	@media (max-width: 900px) {
		.zones-grid {
			grid-template-columns: repeat(2, 1fr);
		}
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

		.features-grid {
			grid-template-columns: 1fr;
		}

		.zones-grid {
			grid-template-columns: 1fr;
		}

		.researchers-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}

		.researcher-card {
			height: 340px;
		}

		.overview-content {
			padding: 2rem 1.5rem;
		}

		.overview-content p {
			font-size: 1rem;
		}

		.researchers-section {
			padding: 8rem 2rem 6rem;
		}

		.section-header {
			margin-bottom: 4rem;
		}

		.info-bar {
			flex-direction: column;
			gap: 2rem;
			padding: 2rem;
			border-radius: 30px;
		}

		.info-divider {
			width: 80%;
			height: 2px;
			background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.5), transparent);
		}

		.info-item {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.info-text {
			align-items: center;
		}
		
		.zone-card {
			min-height: auto;
			padding: 2.5rem 2rem;
		}
		
		.zone-icon {
			font-size: 3.5rem;
		}
		
		.zone-icon img {
			width: 70px;
			height: 70px;
		}
		
		.zone-card h3 {
			font-size: 1.6rem;
		}
		
		.zone-card p {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.researchers-container {
			grid-template-columns: 1fr;
		}

		.researcher-card {
			height: 360px;
		}

		.section-title {
			font-size: 2.5rem;
		}

		.photo-wrapper {
			width: 140px;
			height: 140px;
		}

		.photo-wrapper img {
			width: 140px;
			height: 140px;
		}

		.info-icon {
			font-size: 2rem;
		}
	}
</style>
