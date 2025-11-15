<script lang="ts">
	import { onMount } from 'svelte';
	
	let heroRef: HTMLElement;
	let isHovering = $state(false);
	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let normalizedMouseX = $state(0); // -1 to 1
	let normalizedMouseY = $state(0); // -1 to 1

	// Canvas references for each layer
	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	const BASE_DRIFT_SPEED = 0.21; // Increased by 20% + 30% + 30% (total 103% faster)

	// Cloud data arrays with $state for reactivity
	let farClouds = $state<Array<{x: number, y: number, w: number, h: number, color: string, blur: number}>>([]);
	let midClouds = $state<Array<{x: number, y: number, w: number, h: number, color: string, blur: number}>>([]);
	let nearClouds = $state<Array<{x: number, y: number, w: number, h: number, color: string, blur: number}>>([]);

	// Animation frame for drift
	let animationFrameId: number;

	// Scroll-based background transition (REVERSED)
	let scrollProgress = $state(0); // 0 = midnight/night, 0.5 = evening, 1 = day

	onMount(() => {
		mounted = true;

		// Initialize cloud arrays
		initializeFarClouds();
		initializeMidClouds();
		initializeNearClouds();

		// Generate sky layer
		generateSkyLayer();

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			
			// Normalize to -1 to 1 range (center is 0)
			normalizedMouseX = (e.clientX / window.innerWidth) * 2 - 1;
			normalizedMouseY = (e.clientY / window.innerHeight) * 2 - 1;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Scroll handler for background transition
		const handleScroll = () => {
			const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
			const currentScroll = window.scrollY;
			// Calculate scroll progress (0 to 1)
			const progress = Math.min(currentScroll / scrollHeight, 1);
			scrollProgress = progress;
			
			// Regenerate sky based on scroll progress
			generateSkyLayer();
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial call

		// Continuous drift animation
		const animate = () => {
			animateCloudLayers();
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

	// Generate dynamic sky gradient with stars based on scroll progress
	// Reversed: 0 = midnight/night, 1 = day
	function generateSkyLayer() {
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

		// Add stars (only visible at night - before 0.6 scroll progress - REVERSED)
		if (scrollProgress < 0.6) {
			const starOpacity = scrollProgress < 0.25 
				? 0.8 // Full stars in midnight
				: 1 - ((scrollProgress - 0.25) / 0.35); // Fade out as we approach day
			
			// More stars in midnight mode
			const starCount = scrollProgress < 0.25 ? 200 : 150;
			ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * 0.8})`;
			for (let i = 0; i < starCount; i++) {
				const x = Math.random() * width;
				const y = Math.random() * height * 0.6; // Stars in upper portion
				const radius = Math.random() * 1.5 + 0.5;
			
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// Moon (visible during night phase 0.25 - 0.5 - REVERSED)
		if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
			const moonOpacity = scrollProgress < 0.35 
				? Math.min((scrollProgress - 0.25) / 0.1, 1) // Fade in
				: 1 - ((scrollProgress - 0.35) / 0.15); // Start fading out
			
			const moonX = width * 0.85;
			const moonY = height * 0.15;
			const moonRadius = 30; // Reduced by 40% (was 50)

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

		// Bigger midnight moon (visible during midnight phase 0 - 0.25 - REVERSED)
		// Moon positioned in top left at the beginning
		if (scrollProgress < 0.25) {
			const midnightMoonOpacity = 1 - (scrollProgress / 0.25); // Fade out as we scroll
			
			// Position moon in top left
			const moonX = width * 0.15;
			const moonY = height * 0.2;
			
			// Moon shrinks from 120px to 48px as scroll progresses from 0 to 0.25 (40% smaller)
			const growthProgress = scrollProgress / 0.25; // 0 to 1
			const moonRadius = 120 - (72 * growthProgress); // Shrinks from 120 to 48

			// Enhanced moon glow with purple tint - shrinks with moon
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
			const craterScale = moonRadius / 80; // Scale factor based on size
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

		// Evening/Rising sun (visible during evening - 0.5 to 0.75 - REVERSED)
		if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
			const t = (scrollProgress - 0.5) / 0.25;
			const sunsetOpacity = t; // Fade in as we approach day
			const sunsetX = width * 0.12;
			const sunsetY = height * 0.65; // Lower position for rising sun
			const sunsetRadius = 70;

			// Sunset glow
			const sunsetGlow = ctx.createRadialGradient(sunsetX, sunsetY, sunsetRadius * 0.3, sunsetX, sunsetY, sunsetRadius * 5);
			sunsetGlow.addColorStop(0, `rgba(255, 120, 80, ${sunsetOpacity * 0.4})`);
			sunsetGlow.addColorStop(0.5, `rgba(255, 100, 60, ${sunsetOpacity * 0.2})`);
			sunsetGlow.addColorStop(1, 'rgba(255, 80, 40, 0)');
			ctx.fillStyle = sunsetGlow;
			ctx.fillRect(sunsetX - sunsetRadius * 5, sunsetY - sunsetRadius * 5, sunsetRadius * 10, sunsetRadius * 10);

			// Rising sun body
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

		// Morning sun (visible during day - after 0.75 scroll progress - REVERSED)
		if (scrollProgress >= 0.75) {
			const sunOpacity = (scrollProgress - 0.75) / 0.25; // Fade in sun as we scroll
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

	// Initialize far clouds array
	function initializeFarClouds() {
		if (!farCloudsCanvas) return;
		const width = farCloudsCanvas.width;
		const height = farCloudsCanvas.height;

		const cloudData: Array<{x: number, y: number, w: number, h: number, color: string, blur: number}> = [];

		// Generate clouds across the full canvas width
		const cloudCount = 19;
		const spacing = width / cloudCount;
		
		for (let i = 0; i < cloudCount; i++) {
			const x = (spacing * i) + (spacing / 2) + (Math.random() - 0.5) * 60;
			const y = Math.random() * height * 0.6 + height * 0.1;
			cloudData.push({ x, y, w: 85, h: 42, color: 'rgba(200, 215, 240, 0.75)', blur: 2 });
		}
		
		// Add additional scattered clouds with some starting at negative X
		cloudData.push({ x: -100, y: height * 0.25, w: 75, h: 38, color: 'rgba(190, 210, 235, 0.7)', blur: 2 });
		cloudData.push({ x: -200, y: height * 0.4, w: 75, h: 38, color: 'rgba(190, 210, 235, 0.7)', blur: 2 });
		
		for (let i = 0; i < 6; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height * 0.5 + height * 0.15;
			cloudData.push({ x, y, w: 75, h: 38, color: 'rgba(190, 210, 235, 0.7)', blur: 2 });
		}

		farClouds = cloudData;
	}

	// Initialize mid clouds array
	function initializeMidClouds() {
		if (!midCloudsCanvas) return;
		const width = midCloudsCanvas.width;
		const height = midCloudsCanvas.height;

		midClouds = [
			{ x: -150, y: height * 0.25, w: 180, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.08, y: height * 0.25, w: 180, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.20, y: height * 0.15, w: 200, h: 90, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.33, y: height * 0.35, w: 185, h: 82, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.45, y: height * 0.22, w: 170, h: 75, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.57, y: height * 0.42, w: 190, h: 85, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.68, y: height * 0.18, w: 195, h: 88, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.78, y: height * 0.55, w: 185, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.87, y: height * 0.35, w: 175, h: 78, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.96, y: height * 0.48, w: 180, h: 80, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
			{ x: width * 0.12, y: height * 0.58, w: 190, h: 84, color: 'rgba(210, 225, 245, 0.85)', blur: 3 },
		];
	}

	// Initialize near clouds array
	function initializeNearClouds() {
		if (!nearCloudsCanvas) return;
		const width = nearCloudsCanvas.width;
		const height = nearCloudsCanvas.height;

		nearClouds = [
			{ x: -180, y: height * 0.3, w: 280, h: 120, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.08, y: height * 0.3, w: 280, h: 120, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.26, y: height * 0.5, w: 300, h: 130, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.42, y: height * 0.25, w: 275, h: 118, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.57, y: height * 0.65, w: 260, h: 110, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.71, y: height * 0.42, w: 285, h: 122, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.86, y: height * 0.55, w: 270, h: 115, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
			{ x: width * 0.16, y: height * 0.72, w: 290, h: 125, color: 'rgba(220, 235, 250, 0.92)', blur: 4 },
		];
	}

	// Animate cloud layers with seamless wrapping
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
		const farLayerSpeed = 0.5;
		const farMouseMultiplier = 15;
		const farCursorOffsetX = -(deltaX / centerX) * farMouseMultiplier;
		const farCursorOffsetY = -(deltaY / centerY) * farMouseMultiplier * 0.5;

		farCtx.clearRect(0, 0, farCloudsCanvas.width, farCloudsCanvas.height);
		for (const cloud of farClouds) {
			cloud.x += BASE_DRIFT_SPEED * farLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > farCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawAnimeCloud(farCtx, cloud.x + farCursorOffsetX, cloud.y + farCursorOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
		}

		// Mid clouds
		const midLayerSpeed = 1.2;
		const midMouseMultiplier = 35;
		const midCursorOffsetX = -(deltaX / centerX) * midMouseMultiplier;
		const midCursorOffsetY = -(deltaY / centerY) * midMouseMultiplier * 0.5;

		midCtx.clearRect(0, 0, midCloudsCanvas.width, midCloudsCanvas.height);
		for (const cloud of midClouds) {
			cloud.x += BASE_DRIFT_SPEED * midLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > midCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawAnimeCloud(midCtx, cloud.x + midCursorOffsetX, cloud.y + midCursorOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
		}

		// Near clouds
		const nearLayerSpeed = 2.0;
		const nearMouseMultiplier = 60;
		const nearCursorOffsetX = -(deltaX / centerX) * nearMouseMultiplier;
		const nearCursorOffsetY = -(deltaY / centerY) * nearMouseMultiplier * 0.5;

		nearCtx.clearRect(0, 0, nearCloudsCanvas.width, nearCloudsCanvas.height);
		for (const cloud of nearClouds) {
			cloud.x += BASE_DRIFT_SPEED * nearLayerSpeed;
			if (cloud.x - (cloud.w * 0.35) > nearCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawAnimeCloud(nearCtx, cloud.x + nearCursorOffsetX, cloud.y + nearCursorOffsetY, cloud.w, cloud.h, cloud.color, cloud.blur);
		}
	}

	// Draw anime-style fluffy cloud with crisp definition and texture
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
	<!-- Static Sky Layer with Stars & Moon -->
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
		/* Enable seamless wrapping by allowing canvas to extend beyond viewport */
		transform-origin: center center;
	}

	/* Sky Layer - Static, no movement */
	.sky-layer {
		z-index: 1;
		/* No transform, stays fixed */
	}

	/* Far Clouds - Slowest parallax with seamless wrapping */
	.far-clouds-layer {
		z-index: 2;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
	}

	/* Mid Clouds - Medium parallax with seamless wrapping */
	.mid-clouds-layer {
		z-index: 3;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
	}

	/* Near Clouds - Fastest parallax with seamless wrapping */
	.near-clouds-layer {
		z-index: 4;
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
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
		transform: translateY(-10px);
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
