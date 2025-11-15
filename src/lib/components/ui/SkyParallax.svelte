<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/** Scroll-based transition progress (0 = day, 1 = midnight) */
		scrollProgress?: number;
		/** Enable mouse parallax effect */
		enableMouseParallax?: boolean;
		/** Enable continuous cloud drift animation */
		enableDrift?: boolean;
		/** Disable scroll-based sky transitions */
		staticSky?: boolean;
		/** Fixed sky mode (day, evening, night, midnight) */
		skyMode?: 'day' | 'evening' | 'night' | 'midnight';
	}

	let {
		scrollProgress = $bindable(0),
		enableMouseParallax = true,
		enableDrift = true,
		staticSky = false,
		skyMode = 'day'
	}: Props = $props();

	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	// Canvas references for each layer
	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	// Animation frame for drift
	let animationFrameId: number;

	// Cloud arrays for animation with proper wrapping
	interface Cloud {
		x: number;
		y: number;
		w: number;
		h: number;
		color: string;
		blur: number;
		speed: number;
	}

	let farClouds = $state<Cloud[]>([]);
	let midClouds = $state<Cloud[]>([]);
	let nearClouds = $state<Cloud[]>([]);

	onMount(() => {
		mounted = true;

		// Generate static sky layer
		generateSkyLayer();
		
		// Initialize cloud arrays with dynamic repositioning
		initializeFarClouds();
		initializeMidClouds();
		initializeNearClouds();

		const handleMouseMove = (e: MouseEvent) => {
			if (!enableMouseParallax) return;
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Scroll handler for background transition
		const handleScroll = () => {
			if (staticSky) return;
			const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
			const currentScroll = window.scrollY;
			scrollProgress = Math.min(currentScroll / scrollHeight, 1);
			generateSkyLayer();
		};

		if (!staticSky) {
			window.addEventListener('scroll', handleScroll);
			handleScroll();
		} else {
			// Generate sky based on fixed mode
			generateSkyLayer();
		}

		// Continuous drift animation with proper cloud wrapping
		if (enableDrift) {
			const animate = () => {
				animateCloudLayers();
				animationFrameId = requestAnimationFrame(animate);
			};
			animate();
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (!staticSky) {
				window.removeEventListener('scroll', handleScroll);
			}
			if (enableDrift) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	// Generate dynamic sky gradient with sun/moon based on scroll progress or fixed mode
	function generateSkyLayer() {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;

		const width = skyCanvas.width;
		const height = skyCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Determine effective scroll progress
		let effectiveProgress = scrollProgress;
		if (staticSky) {
			effectiveProgress = skyMode === 'day' ? 0 : 
							   skyMode === 'evening' ? 0.375 : 
							   skyMode === 'night' ? 0.625 : 0.875;
		}

		// Define color stops for day, evening, night, and midnight
		let topColor, midTopColor, midBottomColor, bottomColor;

		if (effectiveProgress < 0.25) {
			// Day (0 to 0.25)
			const t = effectiveProgress / 0.25;
			topColor = interpolateColor('#87CEEB', '#FF6B6B', t);
			midTopColor = interpolateColor('#8FB4D4', '#FF8C42', t);
			midBottomColor = interpolateColor('#BDDDF0', '#FFB347', t);
			bottomColor = interpolateColor('#D5E8F0', '#FFD700', t);
		} else if (effectiveProgress < 0.5) {
			// Evening (0.25 to 0.5)
			const t = (effectiveProgress - 0.25) / 0.25;
			topColor = interpolateColor('#FF6B6B', '#0a1628', t);
			midTopColor = interpolateColor('#FF8C42', '#1a2847', t);
			midBottomColor = interpolateColor('#FFB347', '#2d3f66', t);
			bottomColor = interpolateColor('#FFD700', '#4a5f8f', t);
		} else if (effectiveProgress < 0.75) {
			// Night (0.5 to 0.75)
			topColor = '#0a1628';
			midTopColor = '#1a2847';
			midBottomColor = '#2d3f66';
			bottomColor = '#4a5f8f';
		} else {
			// Midnight (0.75 to 1)
			const t = (effectiveProgress - 0.75) / 0.25;
			topColor = interpolateColor('#0a1628', '#000000', t);
			midTopColor = interpolateColor('#1a2847', '#0a0a0a', t);
			midBottomColor = interpolateColor('#2d3f66', '#1a1a1a', t);
			bottomColor = interpolateColor('#4a5f8f', '#2a2a2a', t);
		}

		// Create gradient
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, topColor);
		gradient.addColorStop(0.3, midTopColor);
		gradient.addColorStop(0.6, midBottomColor);
		gradient.addColorStop(1, bottomColor);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add morning sun (day)
		if (effectiveProgress < 0.25) {
			const sunOpacity = staticSky && skyMode === 'day' ? 1 : 1 - (effectiveProgress / 0.25); // Fade out sun as we scroll
			const sunX = width * 0.15; // Left area
			const sunY = height * 0.18; // Positioned below navbar
			const sunRadius = 60;

			// Sun glow
			const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 4);
			sunGlow.addColorStop(0, `rgba(255, 220, 100, ${sunOpacity * 0.3})`);
			sunGlow.addColorStop(0.5, `rgba(255, 200, 80, ${sunOpacity * 0.15})`);
			sunGlow.addColorStop(1, 'rgba(255, 180, 60, 0)');
			ctx.fillStyle = sunGlow;
			ctx.fillRect(sunX - sunRadius * 4, sunY - sunRadius * 4, sunRadius * 8, sunRadius * 8);

			// Sun body
			const sunGradient = ctx.createRadialGradient(sunX - 10, sunY - 10, 10, sunX, sunY, sunRadius);
			sunGradient.addColorStop(0, '#FFF4D6');
			sunGradient.addColorStop(0.6, '#FFE680');
			sunGradient.addColorStop(1, '#FFD740');
			ctx.globalAlpha = sunOpacity;
			ctx.fillStyle = sunGradient;
			ctx.beginPath();
			ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1; // Reset alpha
		}

		// Add evening/setting sun (only visible during evening - 0.25 to 0.5 scroll progress)
		if (effectiveProgress >= 0.25 && effectiveProgress < 0.5) {
			const t = (effectiveProgress - 0.25) / 0.25;
			const sunsetOpacity = staticSky && skyMode === 'evening' ? 1 : 1 - t; // Fade out as we transition to night
			const sunsetX = width * 0.12;
			const sunsetY = height * 0.65; // Lower position for setting sun
			const sunsetRadius = 70;

			// Sunset glow
			const sunsetGlow = ctx.createRadialGradient(sunsetX, sunsetY, sunsetRadius * 0.3, sunsetX, sunsetY, sunsetRadius * 5);
			sunsetGlow.addColorStop(0, `rgba(255, 120, 80, ${sunsetOpacity * 0.4})`);
			sunsetGlow.addColorStop(0.5, `rgba(255, 100, 60, ${sunsetOpacity * 0.2})`);
			sunsetGlow.addColorStop(1, 'rgba(255, 80, 40, 0)');
			ctx.fillStyle = sunsetGlow;
			ctx.fillRect(sunsetX - sunsetRadius * 5, sunsetY - sunsetRadius * 5, sunsetRadius * 10, sunsetRadius * 10);

			// Setting sun body
			const sunsetGradient = ctx.createRadialGradient(sunsetX - 15, sunsetY - 15, 10, sunsetX, sunsetY, sunsetRadius);
			sunsetGradient.addColorStop(0, '#FFEBB3');
			sunsetGradient.addColorStop(0.5, '#FFB366');
			sunsetGradient.addColorStop(1, '#FF8533');
			ctx.globalAlpha = sunsetOpacity;
			ctx.fillStyle = sunsetGradient;
			ctx.beginPath();
			ctx.arc(sunsetX, sunsetY, sunsetRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1; // Reset alpha
		}

		// Add stars (only visible at night - after 0.4 scroll progress)
		if (effectiveProgress > 0.4) {
			const starOpacity = staticSky ? 1 : Math.min((effectiveProgress - 0.4) / 0.3, 1); // Fade in stars
			
			// More stars in midnight mode
			const starCount = effectiveProgress > 0.75 ? 200 : 150;
			ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * 0.8})`;
			for (let i = 0; i < starCount; i++) {
				const x = Math.random() * width;
				const y = Math.random() * height * 0.6; // Stars in upper portion
				const radius = Math.random() * 1.5 + 0.5;
			
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			}

			// Regular moon (visible during night phase 0.5 - 0.75)
			if (effectiveProgress >= 0.5 && effectiveProgress < 0.75) {
				const moonOpacity = staticSky && skyMode === 'night' ? 1 : 
					effectiveProgress < 0.65 
					? Math.min((effectiveProgress - 0.5) / 0.15, 1) // Fade in
					: 1 - ((effectiveProgress - 0.65) / 0.1); // Start fading out at 0.65
				
				const moonX = width * 0.85;
				const moonY = height * 0.15;
				const moonRadius = 50;

				// Moon glow
				const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3);
				moonGlow.addColorStop(0, `rgba(255, 255, 255, ${moonOpacity * 0.1})`);
				moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
				ctx.fillStyle = moonGlow;
				ctx.fillRect(moonX - moonRadius * 3, moonY - moonRadius * 3, moonRadius * 6, moonRadius * 6);

				// Moon body
				const moonGradient = ctx.createRadialGradient(moonX - 15, moonY - 15, 10, moonX, moonY, moonRadius);
				moonGradient.addColorStop(0, '#fffef0');
				moonGradient.addColorStop(1, '#e8e6d5');
				ctx.globalAlpha = moonOpacity;
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
				ctx.globalAlpha = 1; // Reset alpha
			}

			// Bigger midnight moon (visible during midnight phase 0.75 - 1.0)
			// Moon grows and centers as user scrolls to end
			if (effectiveProgress >= 0.75) {
				const midnightMoonOpacity = staticSky && skyMode === 'midnight' ? 1 : Math.min((effectiveProgress - 0.75) / 0.1, 1); // Fade in
				
				// Center the moon
				const moonX = width * 0.5;
				const moonY = height * 0.4;
				
				// Moon grows from 80px to 200px as scroll progresses from 0.75 to 1.0
				const growthProgress = staticSky && skyMode === 'midnight' ? 1 : (effectiveProgress - 0.75) / 0.25; // 0 to 1
				const moonRadius = 80 + (120 * growthProgress); // Grows from 80 to 200

				// Enhanced moon glow with purple tint - grows with moon
				const glowSize = moonRadius * 4;
				const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, glowSize);
				moonGlow.addColorStop(0, `rgba(200, 180, 255, ${midnightMoonOpacity * 0.2})`);
				moonGlow.addColorStop(0.5, `rgba(180, 160, 255, ${midnightMoonOpacity * 0.12})`);
				moonGlow.addColorStop(1, 'rgba(160, 140, 255, 0)');
				ctx.fillStyle = moonGlow;
				ctx.fillRect(moonX - glowSize, moonY - glowSize, glowSize * 2, glowSize * 2);

				// Moon body with slight purple tint
				const moonGradient = ctx.createRadialGradient(
					moonX - moonRadius * 0.25, 
					moonY - moonRadius * 0.25, 
					moonRadius * 0.2, 
					moonX, 
					moonY, 
					moonRadius
				);
				moonGradient.addColorStop(0, '#fffef5');
				moonGradient.addColorStop(0.6, '#f0ebf0');
				moonGradient.addColorStop(1, '#e0d8e8');
				ctx.globalAlpha = midnightMoonOpacity;
				ctx.fillStyle = moonGradient;
				ctx.beginPath();
				ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
				ctx.fill();

				// Moon craters (scale with moon size)
				const craterScale = moonRadius / 80; // Scale factor based on growth
				ctx.fillStyle = 'rgba(190, 180, 200, 0.3)';
				ctx.beginPath();
				ctx.arc(moonX - 15 * craterScale, moonY + 15 * craterScale, 18 * craterScale, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(moonX + 25 * craterScale, moonY - 8 * craterScale, 12 * craterScale, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(moonX - 30 * craterScale, moonY - 20 * craterScale, 10 * craterScale, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(moonX + 10 * craterScale, moonY + 35 * craterScale, 8 * craterScale, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1; // Reset alpha
			}
		}
	}

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

	function initializeFarClouds() {
		if (!farCloudsCanvas) return;
		const width = farCloudsCanvas.width;
		const height = farCloudsCanvas.height;

		farClouds = [];
		
		// Generate clouds across the full canvas width
		const cloudCount = 19;
		const spacing = width / cloudCount;
		
		for (let i = 0; i < cloudCount; i++) {
			// Start some clouds off-screen to the left for seamless entry
			const x = (spacing * i) + (spacing / 2) + (Math.random() - 0.5) * 60 - (width * 0.1);
			const y = Math.random() * height * 0.6 + height * 0.1;
			farClouds.push({ 
				x, 
				y, 
				w: 85, 
				h: 42, 
				color: 'rgba(200, 215, 240, 0.75)', 
				blur: 2,
				speed: 0.3 + Math.random() * 0.2 // 0.3-0.5x base speed
			});
		}
		
		// Add additional scattered clouds
		for (let i = 0; i < 8; i++) {
			const x = Math.random() * width - (width * 0.1);
			const y = Math.random() * height * 0.5 + height * 0.15;
			farClouds.push({ 
				x, 
				y, 
				w: 75, 
				h: 38, 
				color: 'rgba(190, 210, 235, 0.7)', 
				blur: 2,
				speed: 0.3 + Math.random() * 0.2
			});
		}
	}

	function initializeMidClouds() {
		if (!midCloudsCanvas) return;
		const width = midCloudsCanvas.width;
		const height = midCloudsCanvas.height;

		// Generate clouds with negative starting positions for seamless entry
		midClouds = [
			{ x: width * 0.08 - (width * 0.1), y: height * 0.25, w: 180, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.20 - (width * 0.1), y: height * 0.15, w: 200, h: 90, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.33 - (width * 0.1), y: height * 0.35, w: 185, h: 82, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.45 - (width * 0.1), y: height * 0.22, w: 170, h: 75, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.57 - (width * 0.1), y: height * 0.42, w: 190, h: 85, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.68 - (width * 0.1), y: height * 0.18, w: 195, h: 88, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.78 - (width * 0.1), y: height * 0.55, w: 185, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.87 - (width * 0.1), y: height * 0.35, w: 175, h: 78, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.96 - (width * 0.1), y: height * 0.48, w: 180, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
			{ x: width * 0.12 - (width * 0.1), y: height * 0.58, w: 190, h: 84, color: 'rgba(210, 225, 245, 0.85)', blur: 3, speed: 0.7 + Math.random() * 0.5 },
		];
	}

	function initializeNearClouds() {
		if (!nearCloudsCanvas) return;
		const width = nearCloudsCanvas.width;
		const height = nearCloudsCanvas.height;

		// Generate clouds with negative starting positions for seamless entry
		nearClouds = [
			{ x: width * 0.08 - (width * 0.1), y: height * 0.3, w: 280, h: 120, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.26 - (width * 0.1), y: height * 0.5, w: 300, h: 130, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.42 - (width * 0.1), y: height * 0.25, w: 275, h: 118, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.57 - (width * 0.1), y: height * 0.65, w: 260, h: 110, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.71 - (width * 0.1), y: height * 0.42, w: 285, h: 122, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.86 - (width * 0.1), y: height * 0.55, w: 270, h: 115, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
			{ x: width * 0.16 - (width * 0.1), y: height * 0.72, w: 290, h: 125, color: 'rgba(220, 235, 250, 0.92)', blur: 4, speed: 1.2 + Math.random() * 0.8 },
		];
	}

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

		// Boost opacity for better visibility
		const boostedAlpha = Math.min(baseAlpha * 1.3, 0.95);

		// Create detailed cloud structure with multiple puffs
		const puffs = [
			{ offsetX: 0, offsetY: 0, scale: 1.0, alpha: boostedAlpha },
			{ offsetX: width * 0.35, offsetY: -height * 0.25, scale: 0.9, alpha: boostedAlpha * 0.98 },
			{ offsetX: -width * 0.3, offsetY: -height * 0.2, scale: 0.85, alpha: boostedAlpha * 0.96 },
			{ offsetX: width * 0.6, offsetY: 0, scale: 0.88, alpha: boostedAlpha * 0.97 },
			{ offsetX: -width * 0.5, offsetY: 0.05, scale: 0.8, alpha: boostedAlpha * 0.94 },
			{ offsetX: width * 0.45, offsetY: height * 0.15, scale: 0.75, alpha: boostedAlpha * 0.92 },
			{ offsetX: -width * 0.35, offsetY: height * 0.12, scale: 0.7, alpha: boostedAlpha * 0.9 },
			{ offsetX: width * 0.15, offsetY: -height * 0.15, scale: 0.65, alpha: boostedAlpha * 0.88 },
		];

		// Draw solid base cloud with sharp edges (no blur)
		ctx.save();
		ctx.filter = 'none';
		
		puffs.forEach(puff => {
			const puffX = x + puff.offsetX;
			const puffY = y + puff.offsetY;
			const radiusX = (width * 0.45) * puff.scale;
			const radiusY = (height * 0.55) * puff.scale;
			
			// Create sharper gradient with more defined edges
			const gradient = ctx.createRadialGradient(
				puffX, puffY, 0,
				puffX, puffY, Math.max(radiusX, radiusY)
			);
			
			// Sharper gradient stops for crisp edges
			gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${puff.alpha})`);
			gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.9})`);
			gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.6})`);
			gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
			
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.ellipse(puffX, puffY, radiusX, radiusY, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.restore();

		// Add very subtle blur only to edges (minimal blur for crispness)
		if (blur > 0) {
			ctx.save();
			ctx.filter = `blur(${blur * 0.2}px)`; // Very minimal blur
			ctx.globalAlpha = 0.3; // Reduced opacity for subtle effect

			// Only blur the outer puffs
			puffs.slice(0, 4).forEach(puff => {
				const puffX = x + puff.offsetX;
				const puffY = y + puff.offsetY;
				const radiusX = (width * 0.35) * puff.scale;
				const radiusY = (height * 0.45) * puff.scale;
				
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.ellipse(puffX, puffY, radiusX, radiusY, 0, 0, Math.PI * 2);
				ctx.fill();
			});

			ctx.restore();
		}

		// Add crisp white highlights for depth and shine
		ctx.save();
		ctx.filter = 'none';
		ctx.globalAlpha = 0.4; // Increased opacity for better visibility
		
		const highlightGradient = ctx.createRadialGradient(
			x - width * 0.12, y - height * 0.18, 0,
			x - width * 0.12, y - height * 0.18, width * 0.35
		);
		highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
		highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
		highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		
		ctx.fillStyle = highlightGradient;
		ctx.beginPath();
		ctx.ellipse(x - width * 0.12, y - height * 0.18, width * 0.3, height * 0.25, 0, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.restore();

		// Add secondary highlight for more depth
		ctx.save();
		ctx.filter = 'none';
		ctx.globalAlpha = 0.25;
		
		const highlight2 = ctx.createRadialGradient(
			x + width * 0.15, y - height * 0.1, 0,
			x + width * 0.15, y - height * 0.1, width * 0.25
		);
		highlight2.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
		highlight2.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
		highlight2.addColorStop(1, 'rgba(255, 255, 255, 0)');
		
		ctx.fillStyle = highlight2;
		ctx.beginPath();
		ctx.ellipse(x + width * 0.15, y - height * 0.1, width * 0.2, height * 0.15, 0, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.restore();
	}

	// Animation function with proper cloud wrapping
	const BASE_DRIFT_SPEED = 0.61; // Base speed (optimized from conversation history)

	function animateCloudLayers() {
		// Update far clouds
		if (farCloudsCanvas) {
			const ctx = farCloudsCanvas.getContext('2d');
			if (ctx) {
				const width = farCloudsCanvas.width;
				const height = farCloudsCanvas.height;
				ctx.clearRect(0, 0, width, height);

				// Calculate mouse parallax offset
				let mouseOffsetX = 0;
				let mouseOffsetY = 0;
				if (enableMouseParallax) {
					const centerX = window.innerWidth / 2;
					const centerY = window.innerHeight / 2;
					const deltaX = mouseX - centerX;
					const deltaY = mouseY - centerY;
					mouseOffsetX = -(deltaX / centerX) * 15;
					mouseOffsetY = -(deltaY / centerY) * 15 * 0.6;
				}

				farClouds.forEach(cloud => {
					cloud.x += BASE_DRIFT_SPEED * cloud.speed;
					
					// Wrap clouds when they move off-screen
					if (cloud.x - (cloud.w * 0.35) > width) {
						cloud.x = -(cloud.w * 0.35);
					}

					drawAnimeCloud(ctx, cloud.x + mouseOffsetX, cloud.y + mouseOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
				});
			}
		}

		// Update mid clouds
		if (midCloudsCanvas) {
			const ctx = midCloudsCanvas.getContext('2d');
			if (ctx) {
				const width = midCloudsCanvas.width;
				const height = midCloudsCanvas.height;
				ctx.clearRect(0, 0, width, height);

				let mouseOffsetX = 0;
				let mouseOffsetY = 0;
				if (enableMouseParallax) {
					const centerX = window.innerWidth / 2;
					const centerY = window.innerHeight / 2;
					const deltaX = mouseX - centerX;
					const deltaY = mouseY - centerY;
					mouseOffsetX = -(deltaX / centerX) * 35;
					mouseOffsetY = -(deltaY / centerY) * 35 * 0.6;
				}

				midClouds.forEach(cloud => {
					cloud.x += BASE_DRIFT_SPEED * cloud.speed;
					
					if (cloud.x - (cloud.w * 0.35) > width) {
						cloud.x = -(cloud.w * 0.35);
					}

					drawAnimeCloud(ctx, cloud.x + mouseOffsetX, cloud.y + mouseOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
				});
			}
		}

		// Update near clouds
		if (nearCloudsCanvas) {
			const ctx = nearCloudsCanvas.getContext('2d');
			if (ctx) {
				const width = nearCloudsCanvas.width;
				const height = nearCloudsCanvas.height;
				ctx.clearRect(0, 0, width, height);

				let mouseOffsetX = 0;
				let mouseOffsetY = 0;
				if (enableMouseParallax) {
					const centerX = window.innerWidth / 2;
					const centerY = window.innerHeight / 2;
					const deltaX = mouseX - centerX;
					const deltaY = mouseY - centerY;
					mouseOffsetX = -(deltaX / centerX) * 60;
					mouseOffsetY = -(deltaY / centerY) * 60 * 0.6;
				}

				nearClouds.forEach(cloud => {
					cloud.x += BASE_DRIFT_SPEED * cloud.speed;
					
					if (cloud.x - (cloud.w * 0.35) > width) {
						cloud.x = -(cloud.w * 0.35);
					}

					drawAnimeCloud(ctx, cloud.x + mouseOffsetX, cloud.y + mouseOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
				});
			}
		}
	}
</script>

<div class="parallax-background-system">
	<canvas 
		bind:this={skyCanvas}
		class="background-layer sky-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={farCloudsCanvas}
		class="background-layer far-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={midCloudsCanvas}
		class="background-layer mid-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={nearCloudsCanvas}
		class="background-layer near-clouds-layer"
		width="3200"
		height="1800"
	></canvas>
</div>

<style>
	.parallax-background-system {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}

	.background-layer {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 3200px;
		height: 100%;
		object-fit: cover;
	}

	.sky-layer {
		z-index: 1;
	}

	.far-clouds-layer {
		z-index: 2;
	}

	.mid-clouds-layer {
		z-index: 3;
	}

	.near-clouds-layer {
		z-index: 4;
	}
</style>
