<script lang="ts">
	import { onMount } from 'svelte';
	import PageLoader from '$lib/components/ui/PageLoader.svelte';
	
	let heroRef: HTMLElement;
	let isHovering = $state(false);
	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let normalizedMouseX = $state(0); // -1 to 1
	let normalizedMouseY = $state(0); // -1 to 1

	// Canvas references for each layer - Morning (Hero section)
	let morningSkyCanvas: HTMLCanvasElement;
	let morningFarCloudsCanvas: HTMLCanvasElement;
	let morningMidCloudsCanvas: HTMLCanvasElement;
	let morningNearCloudsCanvas: HTMLCanvasElement;

	// Canvas references for each layer - Evening (Key Features section)
	let eveningSkyCanvas: HTMLCanvasElement;
	let eveningFarCloudsCanvas: HTMLCanvasElement;
	let eveningMidCloudsCanvas: HTMLCanvasElement;
	let eveningNearCloudsCanvas: HTMLCanvasElement;

	// Canvas references for each layer - Night (Learning Zones section)
	let nightSkyCanvas: HTMLCanvasElement;
	let nightFarCloudsCanvas: HTMLCanvasElement;
	let nightMidCloudsCanvas: HTMLCanvasElement;
	let nightNearCloudsCanvas: HTMLCanvasElement;

	// Animation frame for drift
	let driftOffset = $state(0);
	let animationFrameId: number;
	
	// Scroll-based transitions
	let morningOpacity = $state(1);    // Starts at 1, fades to 0
	let eveningOpacity = $state(0);    // Fades in at Key Features
	let nightOpacity = $state(0);      // Fades in at Learning Zones

	onMount(() => {
		mounted = true;

		// Generate all sky layers on canvases
		generateMorningSkyLayer();
		generateMorningFarClouds();
		generateMorningMidClouds();
		generateMorningNearClouds();

		generateEveningSkyLayer();
		generateEveningFarClouds();
		generateEveningMidClouds();
		generateEveningNearClouds();

		generateNightSkyLayer();
		generateNightFarClouds();
		generateNightMidClouds();
		generateNightNearClouds();

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			
			// Normalize to -1 to 1 range (center is 0)
			normalizedMouseX = (e.clientX / window.innerWidth) * 2 - 1;
			normalizedMouseY = (e.clientY / window.innerHeight) * 2 - 1;
		};

		const handleScroll = () => {
			const scrollY = window.scrollY;
			const viewportHeight = window.innerHeight;
			
			// Get section positions
			const featuresSection = document.querySelector('.features-section');
			const zonesSection = document.querySelector('.zones-section');
			const ctaSection = document.querySelector('.cta-section');
			
			const featuresTop = featuresSection ? featuresSection.getBoundingClientRect().top + scrollY : viewportHeight * 1.2;
			const zonesTop = zonesSection ? zonesSection.getBoundingClientRect().top + scrollY : viewportHeight * 2.5;
			const ctaTop = ctaSection ? ctaSection.getBoundingClientRect().top + scrollY : viewportHeight * 3.5;
			
			// Define smoother transition ranges with easing
			// Morning to Evening: smoother, longer transition
			const morningToEveningStart = featuresTop - viewportHeight * 0.5;
			const morningToEveningEnd = featuresTop + viewportHeight * 0.3;
			
			// Evening to Night: start transition earlier for smoother effect
			const eveningToNightStart = zonesTop - viewportHeight * 0.4;
			const eveningToNightEnd = zonesTop + viewportHeight * 0.5;
			
			// Easing function for smoother transitions (ease-in-out)
			const easeInOutCubic = (t: number) => {
				return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
			};
			
			// Calculate transition progress with easing
			if (scrollY < morningToEveningStart) {
				// Pure morning
				morningOpacity = 1;
				eveningOpacity = 0;
				nightOpacity = 0;
			} else if (scrollY < morningToEveningEnd) {
				// Transitioning from morning to evening with easing
				const rawProgress = (scrollY - morningToEveningStart) / (morningToEveningEnd - morningToEveningStart);
				const progress = easeInOutCubic(rawProgress);
				morningOpacity = 1 - progress;
				eveningOpacity = progress;
				nightOpacity = 0;
			} else if (scrollY < eveningToNightStart) {
				// Pure evening
				morningOpacity = 0;
				eveningOpacity = 1;
				nightOpacity = 0;
			} else if (scrollY < eveningToNightEnd) {
				// Transitioning from evening to night with easing
				const rawProgress = (scrollY - eveningToNightStart) / (eveningToNightEnd - eveningToNightStart);
				const progress = easeInOutCubic(rawProgress);
				morningOpacity = 0;
				eveningOpacity = 1 - progress;
				nightOpacity = progress;
			} else {
				// Pure night (extends through CTA section and beyond)
				morningOpacity = 0;
				eveningOpacity = 0;
				nightOpacity = 1;
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', handleScroll);

		// Continuous drift animation
		const animate = () => {
			driftOffset += 0.1; // Slow drift speed
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();

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
			cancelAnimationFrame(animationFrameId);
			observer.disconnect();
		};
	});

	// Generate static night sky gradient with stars
	function generateNightSkyLayer() {
		if (!nightSkyCanvas) return;
		const ctx = nightSkyCanvas.getContext('2d');
		if (!ctx) return;

		const width = nightSkyCanvas.width;
		const height = nightSkyCanvas.height;

		// Night sky gradient - deep blue to lighter blue
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, '#0a1628');    // Deep navy
		gradient.addColorStop(0.3, '#1a2847');  // Dark blue
		gradient.addColorStop(0.6, '#2d3f66');  // Medium blue
		gradient.addColorStop(1, '#4a5f8f');    // Lighter blue at bottom

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add stars
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		for (let i = 0; i < 150; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height * 0.6; // Stars in upper portion
			const radius = Math.random() * 1.5 + 0.5;
			
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}

		// Add moon
		const moonX = width * 0.85;
		const moonY = height * 0.15;
		const moonRadius = 50;

		// Moon glow
		const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3);
		moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
		moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
		ctx.fillStyle = moonGlow;
		ctx.fillRect(moonX - moonRadius * 3, moonY - moonRadius * 3, moonRadius * 6, moonRadius * 6);

		// Moon body
		const moonGradient = ctx.createRadialGradient(moonX - 15, moonY - 15, 10, moonX, moonY, moonRadius);
		moonGradient.addColorStop(0, '#fffef0');
		moonGradient.addColorStop(1, '#e8e6d5');
		ctx.fillStyle = moonGradient;
		ctx.beginPath();
		ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
		ctx.fill();

		// Moon craters (subtle)
		ctx.fillStyle = 'rgba(200, 200, 180, 0.3)';
		ctx.beginPath();
		ctx.arc(moonX - 10, moonY + 10, 12, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(moonX + 15, moonY - 5, 8, 0, Math.PI * 2);
		ctx.fill();
	}

	// Generate night far clouds (small, wispy, low opacity)
	function generateNightFarClouds() {
		if (!nightFarCloudsCanvas) return;
		const ctx = nightFarCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = nightFarCloudsCanvas.width;
		const height = nightFarCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Create 10-12 small wispy clouds with padding to prevent cutoff
		const cloudCount = 11;
		const padding = 150; // Extra padding to prevent edge cutoff
		for (let i = 0; i < cloudCount; i++) {
			const x = padding + ((width - padding * 2) / cloudCount) * i + Math.random() * 80;
			const y = Math.random() * height * 0.5 + height * 0.1;
			drawAnimeCloud(ctx, x, y, 80, 40, 'rgba(140, 165, 210, 0.65)', 4); // Crisp with texture
		}

		// Add extra clouds in the left-bottom region
		const leftBottomClouds = [
			{ x: width * 0.12, y: height * 0.65, w: 75, h: 38 },
			{ x: width * 0.05, y: height * 0.75, w: 70, h: 35 },
			{ x: width * 0.18, y: height * 0.80, w: 85, h: 42 },
			{ x: width * 0.08, y: height * 0.88, w: 65, h: 33 },
		];
		leftBottomClouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(140, 165, 210, 0.65)', 4);
		});
	}

	// Generate night mid clouds (medium, fluffy)
	function generateNightMidClouds() {
		if (!nightMidCloudsCanvas) return;
		const ctx = nightMidCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = nightMidCloudsCanvas.width;
		const height = nightMidCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Create 6-7 medium clouds with proper spacing
		const clouds = [
			{ x: width * 0.08, y: height * 0.25, w: 180, h: 80 },
			{ x: width * 0.25, y: height * 0.15, w: 200, h: 90 },
			{ x: width * 0.45, y: height * 0.3, w: 170, h: 75 },
			{ x: width * 0.60, y: height * 0.18, w: 190, h: 85 },
			{ x: width * 0.75, y: height * 0.55, w: 185, h: 80 },
			{ x: width * 0.90, y: height * 0.35, w: 175, h: 78 },
			// Additional clouds for left-bottom region
			{ x: width * 0.15, y: height * 0.68, w: 165, h: 73 },
			{ x: width * 0.05, y: height * 0.82, w: 155, h: 70 },
			{ x: width * 0.22, y: height * 0.88, w: 170, h: 75 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(160, 185, 230, 0.78)', 6); // Sharp with good texture
		});
	}

	// Generate night near clouds (large, prominent)
	function generateNightNearClouds() {
		if (!nightNearCloudsCanvas) return;
		const ctx = nightNearCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = nightNearCloudsCanvas.width;
		const height = nightNearCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Create 4 large foreground clouds with good spacing
		const clouds = [
			{ x: width * 0.08, y: height * 0.3, w: 280, h: 120 },
			{ x: width * 0.35, y: height * 0.5, w: 300, h: 130 },
			{ x: width * 0.60, y: height * 0.7, w: 260, h: 110 },
			{ x: width * 0.85, y: height * 0.4, w: 270, h: 115 },
			// Additional large clouds for left-bottom region
			{ x: width * 0.12, y: height * 0.75, w: 250, h: 108 },
			{ x: width * 0.02, y: height * 0.88, w: 240, h: 105 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(180, 200, 240, 0.88)', 8); // Very defined with rich texture
		});
	}

	// Draw anime-style fluffy cloud with texture and definition
	function drawAnimeCloud(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
		blur: number
	) {
		// Extract RGBA values from color string
		const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
		if (!rgbaMatch) return;
		
		const [, r, g, b, a = '1'] = rgbaMatch;
		const baseAlpha = parseFloat(a);

		// Create more detailed cloud structure with 8 puffs for better texture
		const puffs = [
			{ offsetX: 0, offsetY: 0, scale: 1.0, alpha: baseAlpha },
			{ offsetX: width * 0.35, offsetY: -height * 0.25, scale: 0.85, alpha: baseAlpha * 0.95 },
			{ offsetX: -width * 0.3, offsetY: -height * 0.2, scale: 0.75, alpha: baseAlpha * 0.9 },
			{ offsetX: width * 0.6, offsetY: 0, scale: 0.8, alpha: baseAlpha * 0.92 },
			{ offsetX: -width * 0.5, offsetY: 0.05, scale: 0.7, alpha: baseAlpha * 0.88 },
			{ offsetX: width * 0.45, offsetY: height * 0.15, scale: 0.65, alpha: baseAlpha * 0.85 },
			{ offsetX: -width * 0.35, offsetY: height * 0.12, scale: 0.6, alpha: baseAlpha * 0.8 },
			{ offsetX: width * 0.15, offsetY: -height * 0.15, scale: 0.55, alpha: baseAlpha * 0.75 },
		];

		// Draw cloud without blur first for sharp edges
		ctx.save();
		ctx.filter = 'none';
		
		puffs.forEach(puff => {
			// Create gradient for each puff to add depth
			const puffX = x + puff.offsetX;
			const puffY = y + puff.offsetY;
			const radiusX = (width * 0.4) * puff.scale;
			const radiusY = (height * 0.5) * puff.scale;
			
			const gradient = ctx.createRadialGradient(
				puffX, puffY, 0,
				puffX, puffY, Math.max(radiusX, radiusY)
			);
			
			// Add texture with gradient stops
			gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${puff.alpha})`);
			gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.8})`);
			gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.3})`);
			
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.ellipse(puffX, puffY, radiusX, radiusY, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.restore();

		// Add subtle blur layer on top for softness (much less than before)
		if (blur > 0) {
			ctx.save();
			ctx.filter = `blur(${blur * 0.4}px)`; // Reduced blur
			ctx.globalAlpha = 0.6;

			puffs.slice(0, 5).forEach(puff => {
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.ellipse(
					x + puff.offsetX,
					y + puff.offsetY,
					(width * 0.35) * puff.scale,
					(height * 0.45) * puff.scale,
					0,
					0,
					Math.PI * 2
				);
				ctx.fill();
			});

			ctx.restore();
		}

		// Add highlights for extra texture
		ctx.save();
		ctx.filter = 'none';
		ctx.globalAlpha = 0.3;
		
		const highlightGradient = ctx.createRadialGradient(
			x - width * 0.1, y - height * 0.15, 0,
			x - width * 0.1, y - height * 0.15, width * 0.3
		);
		highlightGradient.addColorStop(0, `rgba(255, 255, 255, 0.6)`);
		highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
		
		ctx.fillStyle = highlightGradient;
		ctx.beginPath();
		ctx.ellipse(x - width * 0.1, y - height * 0.15, width * 0.25, height * 0.2, 0, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.restore();
	}

	// ==================== MORNING SKY GENERATION ====================

	// Generate morning sky gradient with sun
	function generateMorningSkyLayer() {
		if (!morningSkyCanvas) return;
		const ctx = morningSkyCanvas.getContext('2d');
		if (!ctx) return;

		const width = morningSkyCanvas.width;
		const height = morningSkyCanvas.height;

		// Morning sky gradient - warm sunrise colors
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, '#87CEEB');    // Sky blue
		gradient.addColorStop(0.3, '#B0E0E6');  // Powder blue
		gradient.addColorStop(0.6, '#FFD6A5');  // Warm peach
		gradient.addColorStop(1, '#FFA07A');    // Light salmon at bottom

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add sun
		const sunX = width * 0.85;
		const sunY = height * 0.15;
		const sunRadius = 55;

		// Sun rays
		ctx.save();
		ctx.globalAlpha = 0.2;
		for (let i = 0; i < 12; i++) {
			const angle = (i * Math.PI * 2) / 12;
			const rayLength = 150;
			
			ctx.beginPath();
			ctx.strokeStyle = '#FFD700';
			ctx.lineWidth = 3;
			ctx.moveTo(sunX + Math.cos(angle) * sunRadius, sunY + Math.sin(angle) * sunRadius);
			ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + rayLength), sunY + Math.sin(angle) * (sunRadius + rayLength));
			ctx.stroke();
		}
		ctx.restore();

		// Sun glow
		const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 4);
		sunGlow.addColorStop(0, 'rgba(255, 223, 0, 0.4)');
		sunGlow.addColorStop(0.5, 'rgba(255, 165, 0, 0.2)');
		sunGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
		ctx.fillStyle = sunGlow;
		ctx.fillRect(sunX - sunRadius * 4, sunY - sunRadius * 4, sunRadius * 8, sunRadius * 8);

		// Sun body
		const sunGradient = ctx.createRadialGradient(sunX - 10, sunY - 10, 10, sunX, sunY, sunRadius);
		sunGradient.addColorStop(0, '#FFF8DC');
		sunGradient.addColorStop(0.5, '#FFD700');
		sunGradient.addColorStop(1, '#FFA500');
		ctx.fillStyle = sunGradient;
		ctx.beginPath();
		ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
		ctx.fill();

		// Add some birds (optional decorative element)
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.lineWidth = 2;
		const birds = [
			{ x: width * 0.3, y: height * 0.2 },
			{ x: width * 0.35, y: height * 0.25 },
			{ x: width * 0.6, y: height * 0.3 },
		];
		birds.forEach(bird => {
			// Simple V-shaped birds
			ctx.beginPath();
			ctx.moveTo(bird.x - 10, bird.y);
			ctx.lineTo(bird.x, bird.y - 5);
			ctx.lineTo(bird.x + 10, bird.y);
			ctx.stroke();
		});
	}

	// Generate morning far clouds (light and fluffy)
	function generateMorningFarClouds() {
		if (!morningFarCloudsCanvas) return;
		const ctx = morningFarCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = morningFarCloudsCanvas.width;
		const height = morningFarCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Create small morning clouds
		const cloudCount = 11;
		const padding = 150;
		for (let i = 0; i < cloudCount; i++) {
			const x = padding + ((width - padding * 2) / cloudCount) * i + Math.random() * 80;
			const y = Math.random() * height * 0.5 + height * 0.1;
			drawAnimeCloud(ctx, x, y, 80, 40, 'rgba(255, 255, 255, 0.7)', 4);
		}

		// Add extra clouds in the left-bottom region
		const leftBottomClouds = [
			{ x: width * 0.12, y: height * 0.65, w: 75, h: 38 },
			{ x: width * 0.05, y: height * 0.75, w: 70, h: 35 },
			{ x: width * 0.18, y: height * 0.80, w: 85, h: 42 },
			{ x: width * 0.08, y: height * 0.88, w: 65, h: 33 },
		];
		leftBottomClouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 255, 255, 0.7)', 4);
		});
	}

	// Generate morning mid clouds
	function generateMorningMidClouds() {
		if (!morningMidCloudsCanvas) return;
		const ctx = morningMidCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = morningMidCloudsCanvas.width;
		const height = morningMidCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.08, y: height * 0.25, w: 180, h: 80 },
			{ x: width * 0.25, y: height * 0.15, w: 200, h: 90 },
			{ x: width * 0.45, y: height * 0.3, w: 170, h: 75 },
			{ x: width * 0.60, y: height * 0.18, w: 190, h: 85 },
			{ x: width * 0.75, y: height * 0.55, w: 185, h: 80 },
			{ x: width * 0.90, y: height * 0.35, w: 175, h: 78 },
			// Additional clouds for left-bottom region
			{ x: width * 0.15, y: height * 0.68, w: 165, h: 73 },
			{ x: width * 0.05, y: height * 0.82, w: 155, h: 70 },
			{ x: width * 0.22, y: height * 0.88, w: 170, h: 75 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 255, 255, 0.85)', 6);
		});
	}

	// Generate morning near clouds
	function generateMorningNearClouds() {
		if (!morningNearCloudsCanvas) return;
		const ctx = morningNearCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = morningNearCloudsCanvas.width;
		const height = morningNearCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.08, y: height * 0.3, w: 280, h: 120 },
			{ x: width * 0.35, y: height * 0.5, w: 300, h: 130 },
			{ x: width * 0.60, y: height * 0.7, w: 260, h: 110 },
			{ x: width * 0.85, y: height * 0.4, w: 270, h: 115 },
			// Additional large clouds for left-bottom region
			{ x: width * 0.12, y: height * 0.75, w: 250, h: 108 },
			{ x: width * 0.02, y: height * 0.88, w: 240, h: 105 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 255, 255, 0.92)', 8);
		});
	}

	// ==================== EVENING SKY GENERATION ====================

	// Generate evening sky gradient with setting sun
	function generateEveningSkyLayer() {
		if (!eveningSkyCanvas) return;
		const ctx = eveningSkyCanvas.getContext('2d');
		if (!ctx) return;

		const width = eveningSkyCanvas.width;
		const height = eveningSkyCanvas.height;

		// Evening sky gradient - warm sunset colors
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, '#1e3a5f');    // Deep twilight blue
		gradient.addColorStop(0.3, '#4a5f8f');  // Medium blue
		gradient.addColorStop(0.5, '#e17055');  // Warm orange
		gradient.addColorStop(0.7, '#fab1a0');  // Soft peach
		gradient.addColorStop(1, '#ffeaa7');    // Golden yellow at bottom

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add setting sun (lower position than morning)
		const sunX = width * 0.15; // Left side for setting sun
		const sunY = height * 0.7;  // Lower position
		const sunRadius = 60;

		// Sun rays
		ctx.save();
		ctx.globalAlpha = 0.25;
		for (let i = 0; i < 16; i++) {
			const angle = (i * Math.PI * 2) / 16;
			const rayLength = 120;
			
			ctx.beginPath();
			ctx.strokeStyle = '#ff7675';
			ctx.lineWidth = 4;
			ctx.moveTo(sunX + Math.cos(angle) * sunRadius, sunY + Math.sin(angle) * sunRadius);
			ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + rayLength), sunY + Math.sin(angle) * (sunRadius + rayLength));
			ctx.stroke();
		}
		ctx.restore();

		// Sun glow - more dramatic for sunset
		const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 5);
		sunGlow.addColorStop(0, 'rgba(255, 107, 107, 0.5)');
		sunGlow.addColorStop(0.3, 'rgba(255, 165, 0, 0.3)');
		sunGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
		ctx.fillStyle = sunGlow;
		ctx.fillRect(sunX - sunRadius * 5, sunY - sunRadius * 5, sunRadius * 10, sunRadius * 10);

		// Sun body - warmer colors for evening
		const sunGradient = ctx.createRadialGradient(sunX - 10, sunY - 10, 10, sunX, sunY, sunRadius);
		sunGradient.addColorStop(0, '#ffe5b4');
		sunGradient.addColorStop(0.5, '#ff8c42');
		sunGradient.addColorStop(1, '#fd7272');
		ctx.fillStyle = sunGradient;
		ctx.beginPath();
		ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
		ctx.fill();

		// Add some stars starting to appear
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		for (let i = 0; i < 50; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height * 0.4; // Stars in upper portion
			const radius = Math.random() * 1 + 0.3;
			
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Generate evening far clouds
	function generateEveningFarClouds() {
		if (!eveningFarCloudsCanvas) return;
		const ctx = eveningFarCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = eveningFarCloudsCanvas.width;
		const height = eveningFarCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const cloudCount = 11;
		const padding = 150;
		for (let i = 0; i < cloudCount; i++) {
			const x = padding + ((width - padding * 2) / cloudCount) * i + Math.random() * 80;
			const y = Math.random() * height * 0.5 + height * 0.1;
			drawAnimeCloud(ctx, x, y, 80, 40, 'rgba(255, 180, 150, 0.6)', 4);
		}

		// Add extra clouds in the left-bottom region
		const leftBottomClouds = [
			{ x: width * 0.12, y: height * 0.65, w: 75, h: 38 },
			{ x: width * 0.05, y: height * 0.75, w: 70, h: 35 },
			{ x: width * 0.18, y: height * 0.80, w: 85, h: 42 },
			{ x: width * 0.08, y: height * 0.88, w: 65, h: 33 },
		];
		leftBottomClouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 180, 150, 0.6)', 4);
		});
	}

	// Generate evening mid clouds
	function generateEveningMidClouds() {
		if (!eveningMidCloudsCanvas) return;
		const ctx = eveningMidCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = eveningMidCloudsCanvas.width;
		const height = eveningMidCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.08, y: height * 0.25, w: 180, h: 80 },
			{ x: width * 0.25, y: height * 0.15, w: 200, h: 90 },
			{ x: width * 0.45, y: height * 0.3, w: 170, h: 75 },
			{ x: width * 0.60, y: height * 0.18, w: 190, h: 85 },
			{ x: width * 0.75, y: height * 0.55, w: 185, h: 80 },
			{ x: width * 0.90, y: height * 0.35, w: 175, h: 78 },
			// Additional clouds for left-bottom region
			{ x: width * 0.15, y: height * 0.68, w: 165, h: 73 },
			{ x: width * 0.05, y: height * 0.82, w: 155, h: 70 },
			{ x: width * 0.22, y: height * 0.88, w: 170, h: 75 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 200, 170, 0.75)', 6);
		});
	}

	// Generate evening near clouds
	function generateEveningNearClouds() {
		if (!eveningNearCloudsCanvas) return;
		const ctx = eveningNearCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = eveningNearCloudsCanvas.width;
		const height = eveningNearCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.08, y: height * 0.3, w: 280, h: 120 },
			{ x: width * 0.35, y: height * 0.5, w: 300, h: 130 },
			{ x: width * 0.60, y: height * 0.7, w: 260, h: 110 },
			{ x: width * 0.85, y: height * 0.4, w: 270, h: 115 },
			// Additional large clouds for left-bottom region
			{ x: width * 0.12, y: height * 0.75, w: 250, h: 108 },
			{ x: width * 0.02, y: height * 0.88, w: 240, h: 105 },
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, 'rgba(255, 210, 180, 0.85)', 8);
		});
	}

	// Calculate parallax transform with drift and cursor interaction
	function getParallaxStyle(layer: 'far' | 'mid' | 'near') {
		if (!mounted) return '';

		const speeds = {
			far: 0.5,   // Slowest movement
			mid: 1.2,   // Medium movement
			near: 2.0   // Fastest movement
		};

		const speed = speeds[layer];

		// Continuous left-to-right drift
		const drift = (driftOffset * speed) % window.innerWidth;

		// Improved cursor-based parallax with better responsiveness
		// Use actual pixel position instead of normalized for better control
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		
		// Calculate distance from center (in pixels)
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;
		
		// Apply parallax multiplier (negative so clouds move opposite to cursor)
		const parallaxMultiplier = {
			far: 15,   // Subtle movement
			mid: 35,   // Medium movement  
			near: 60   // Strong movement
		};
		
		const multiplier = parallaxMultiplier[layer];
		const cursorOffsetX = -(deltaX / centerX) * multiplier;
		const cursorOffsetY = -(deltaY / centerY) * multiplier * 0.6; // Less vertical movement

		return `transform: translate3d(${drift + cursorOffsetX}px, ${cursorOffsetY}px, 0);`;
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

<!-- Anime-Style Parallax Background System - Full Page Coverage -->
<div class="parallax-background-system">
	<!-- MORNING SKY LAYERS (Hero Section - Default) -->
	<canvas 
		bind:this={morningSkyCanvas}
		class="parallax-layer morning-sky-layer"
		width="2560"
		height="1440"
		style="opacity: {morningOpacity};"
	></canvas>

	<canvas 
		bind:this={morningFarCloudsCanvas}
		class="parallax-layer morning-far-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('far')} opacity: {morningOpacity};"
	></canvas>

	<canvas 
		bind:this={morningMidCloudsCanvas}
		class="parallax-layer morning-mid-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('mid')} opacity: {morningOpacity};"
	></canvas>

	<canvas 
		bind:this={morningNearCloudsCanvas}
		class="parallax-layer morning-near-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('near')} opacity: {morningOpacity};"
	></canvas>

	<!-- EVENING SKY LAYERS (Key Features Section) -->
	<canvas 
		bind:this={eveningSkyCanvas}
		class="parallax-layer evening-sky-layer"
		width="2560"
		height="1440"
		style="opacity: {eveningOpacity};"
	></canvas>

	<canvas 
		bind:this={eveningFarCloudsCanvas}
		class="parallax-layer evening-far-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('far')} opacity: {eveningOpacity};"
	></canvas>

	<canvas 
		bind:this={eveningMidCloudsCanvas}
		class="parallax-layer evening-mid-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('mid')} opacity: {eveningOpacity};"
	></canvas>

	<canvas 
		bind:this={eveningNearCloudsCanvas}
		class="parallax-layer evening-near-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('near')} opacity: {eveningOpacity};"
	></canvas>

	<!-- NIGHT SKY LAYERS (Learning Zones Section) -->
	<canvas 
		bind:this={nightSkyCanvas}
		class="parallax-layer night-sky-layer"
		width="2560"
		height="1440"
		style="opacity: {nightOpacity};"
	></canvas>

	<canvas 
		bind:this={nightFarCloudsCanvas}
		class="parallax-layer night-far-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('far')} opacity: {nightOpacity};"
	></canvas>

	<canvas 
		bind:this={nightMidCloudsCanvas}
		class="parallax-layer night-mid-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('mid')} opacity: {nightOpacity};"
	></canvas>

	<canvas 
		bind:this={nightNearCloudsCanvas}
		class="parallax-layer night-near-clouds-layer"
		width="2560"
		height="1440"
		style="{getParallaxStyle('near')} opacity: {nightOpacity};"
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
		background: transparent;
		position: relative;
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
	}

	/* Sky Layers - Static, no movement */
	.morning-sky-layer,
	.evening-sky-layer,
	.night-sky-layer {
		z-index: 1;
		transition: opacity 0.8s ease-in-out;
	}

	/* Far Clouds - Slowest parallax */
	.morning-far-clouds-layer,
	.evening-far-clouds-layer,
	.night-far-clouds-layer {
		z-index: 2;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out;
	}

	/* Mid Clouds - Medium parallax */
	.morning-mid-clouds-layer,
	.evening-mid-clouds-layer,
	.night-mid-clouds-layer {
		z-index: 3;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out;
	}

	/* Near Clouds - Fastest parallax */
	.morning-near-clouds-layer,
	.evening-near-clouds-layer,
	.night-near-clouds-layer {
		z-index: 4;
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out;
	}

	.hero-content {
		position: relative;
		z-index: 10;
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
		color: rgba(255, 255, 255, 0.8);
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
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 700;
		color: #FFFFFF;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		padding: 2.5rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.25);
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

	.feature-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
		background: rgba(255, 255, 255, 0.25);
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
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.feature-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #fff;
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		font-weight: 600;
	}

	.feature-card p {
		font-family: 'Roboto', sans-serif;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.6;
		margin: 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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
		background: transparent;
		position: relative;
		z-index: 1;
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
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.zone-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: inherit;
		opacity: 0.2;
		z-index: -1;
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

	.zone-card:hover::before {
		opacity: 0.35;
	}

	.zone-card:hover {
		transform: scale(1.05) translateY(-10px);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
	}

	.zone-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		transition: transform 0.4s ease;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
	}

	.zone-card:hover .zone-icon {
		transform: scale(1.2) rotate(10deg);
	}

	.zone-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		margin: 0 0 0.75rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
		font-weight: 600;
	}

	.zone-card p {
		font-family: 'Roboto', sans-serif;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		opacity: 0.95;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
		background: transparent;
		color: white;
		position: relative;
		z-index: 1;
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
