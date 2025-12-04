<script lang="ts">
	import { onMount } from 'svelte';

	let { day = false, evening = false, night = false, dawn = false, useRealTime = false } = $props<{ day?: boolean; evening?: boolean; night?: boolean; dawn?: boolean; useRealTime?: boolean }>();

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;
	
	let mouseX = $state(0);
	let mouseY = $state(0);
	const BASE_DRIFT_SPEED = 0.61;

	let farClouds = $state([
		{ x: -200, y: 200, w: 350, h: 120, color: 'rgba(255, 255, 255, 0.5)' },
		{ x: 400, y: 300, w: 400, h: 140, color: 'rgba(255, 255, 255, 0.45)' },
		{ x: 1200, y: 250, w: 420, h: 150, color: 'rgba(255, 255, 255, 0.48)' },
		{ x: 2000, y: 180, w: 380, h: 130, color: 'rgba(255, 255, 255, 0.47)' }
	]);

	let midClouds = $state([
		{ x: -100, y: 400, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.65)' },
		{ x: 500, y: 500, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.62)' },
		{ x: 1200, y: 450, w: 340, h: 115, color: 'rgba(255, 255, 255, 0.64)' },
		{ x: 1900, y: 480, w: 310, h: 105, color: 'rgba(255, 255, 255, 0.63)' },
		{ x: 2600, y: 420, w: 330, h: 112, color: 'rgba(255, 255, 255, 0.62)' }
	]);

	let nearClouds = $state([
		{ x: -150, y: 700, w: 250, h: 80, color: 'rgba(255, 255, 255, 0.8)' },
		{ x: 400, y: 750, w: 270, h: 85, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 950, y: 800, w: 260, h: 82, color: 'rgba(255, 255, 255, 0.79)' },
		{ x: 1500, y: 720, w: 280, h: 87, color: 'rgba(255, 255, 255, 0.77)' },
		{ x: 2100, y: 780, w: 265, h: 84, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 2700, y: 740, w: 275, h: 86, color: 'rgba(255, 255, 255, 0.8)' }
	]);

	// Day/Night Cycle State
	let time = $state(24); // Start at Night
	let stars: { x: number; y: number; size: number; alpha: number }[] = [];

	onMount(() => {
		// Generate stars
		stars = Array.from({ length: 100 }, () => ({
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			size: Math.random() * 2 + 0.5,
			alpha: Math.random()
		}));

		// Mouse tracking for parallax
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		window.addEventListener('mousemove', handleMouseMove);

		// Start continuous animation loop
		let animationId: number;
		const animate = () => {
			// Time is now controlled by scroll
			updateSky();
			animateCloudLayers();
			animationId = requestAnimationFrame(animate);
		};
		animate();

		let timeInterval: number;

		// Scroll handler for time-of-day animation
		const handleScroll = () => {
			if (day) {
				time = 12;
				return;
			}
			if (evening) {
				time = 17.5;
				return;
			}
			if (night) {
				time = 24;
				return;
			}
			if (dawn) {
				time = 6.5;
				return;
			}

			if (useRealTime) {
				const updateTime = () => {
					const now = new Date();
					time = now.getHours() + now.getMinutes() / 60;
				};
				updateTime();
				return;
			}

			const currentScroll = window.scrollY;

			// Update time based on scroll position
			const maxScroll = document.body.scrollHeight - window.innerHeight;
			const scrollRatio = Math.min(Math.max(currentScroll / maxScroll, 0), 1);

			// Map scroll (0 to 1) to time (24 down to 6.5)
			// 0 -> 24 (Night)
			// 0.33 -> ~18 (Evening)
			// 0.66 -> ~12 (Day)
			// 1.0 -> 6.5 (Dawn)
			time = 24 - scrollRatio * 17.5;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial call

		if (useRealTime) {
			timeInterval = window.setInterval(() => {
				const now = new Date();
				time = now.getHours() + now.getMinutes() / 60;
			}, 60000);
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			if (timeInterval) {
				clearInterval(timeInterval);
			}
		};
	});

	function updateSky() {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;

		const w = skyCanvas.width;
		const h = skyCanvas.height;

		// Clear canvas
		ctx.clearRect(0, 0, w, h);

		// Sky Gradient Interpolation
		let topColor: number[], bottomColor: number[];

		if (time >= 5 && time < 8) {
			// Sunrise (5-8) - Dawn (Purple)
			const t = (time - 5) / 3;
			// Transition from Purple (at time=5) to Day Blue (at time=8)
			topColor = interpolateColor([45, 27, 78], [135, 206, 235], t); // Deep Purple to Day Blue
			bottomColor = interpolateColor([255, 168, 213], [255, 223, 186], t); // Pink to Peach
		} else if (time >= 8 && time < 16) {
			// Day (8-16)
			topColor = [135, 206, 235]; // Sky Blue
			bottomColor = [255, 255, 255]; // White/Light Blue
		} else if (time >= 16 && time < 19) {
			// Sunset (16-19)
			const t = (time - 16) / 3;
			topColor = interpolateColor([135, 206, 235], [25, 25, 112], t); // Day Blue to Midnight Blue
			bottomColor = interpolateColor([255, 255, 255], [255, 140, 0], t); // White to Orange
		} else {
			// Night (19-5)
			topColor = [10, 10, 30];
			bottomColor = [20, 20, 60];
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, h);
		gradient.addColorStop(0, `rgb(${topColor.join(',')})`);
		gradient.addColorStop(1, `rgb(${bottomColor.join(',')})`);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, w, h);

		// Draw Stars (Night only)
		if (time < 6 || time > 18) {
			const opacity =
				time > 18 && time < 20 ? (time - 18) / 2 : time > 4 && time < 6 ? (6 - time) / 2 : 1;
			drawStars(ctx, w, h, opacity);
		}

		// Draw Sun (Day)
		if (time > 4 && time < 20) {
			const sunProgress = (time - 4) / 16; // 0 to 1 across the sky
			const sunX = w * sunProgress;
			const sunY = h * 0.8 - Math.sin(sunProgress * Math.PI) * (h * 0.6);
			drawSun(ctx, sunX, sunY);
		}

		// Draw Moon (Night)
		if (time < 6 || time > 18) {
			// Normalize time for moon path: 18->24->6 becomes 0->1
			let moonProgress;
			if (time > 18) moonProgress = (time - 18) / 12;
			else moonProgress = (time + 6) / 12;

			const moonX = w * moonProgress;
			const moonY = h * 0.8 - Math.sin(moonProgress * Math.PI) * (h * 0.6);
			drawMoon(ctx, moonX, moonY);
		}
	}

	function interpolateColor(c1: number[], c2: number[], t: number) {
		return c1.map((c, i) => Math.round(c + (c2[i] - c) * t));
	}

	function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
		ctx.save();
		ctx.globalAlpha = opacity;
		ctx.fillStyle = 'white';
		stars.forEach((star) => {
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			ctx.fill();
		});
		ctx.restore();
	}

	function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number) {
		const sunRadius = 70;

		// Soft glow around sun
		const sunGlow = ctx.createRadialGradient(x, y, sunRadius * 0.3, x, y, sunRadius * 2.5);
		sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.5)');
		sunGlow.addColorStop(0.5, 'rgba(255, 230, 150, 0.2)');
		sunGlow.addColorStop(1, 'rgba(255, 220, 130, 0)');
		ctx.fillStyle = sunGlow;
		ctx.fillRect(x - sunRadius * 2.5, y - sunRadius * 2.5, sunRadius * 5, sunRadius * 5);

		// Main sun body with gradient
		const sunGradient = ctx.createRadialGradient(x, y, 0, x, y, sunRadius);
		sunGradient.addColorStop(0, '#FFFEF0'); // Bright cream center
		sunGradient.addColorStop(0.4, '#FFF4C4'); // Light golden
		sunGradient.addColorStop(0.8, '#FFE680'); // Golden yellow
		sunGradient.addColorStop(1, '#FFD54F'); // Darker golden edge
		ctx.fillStyle = sunGradient;
		ctx.beginPath();
		ctx.arc(x, y, sunRadius, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number) {
		const moonRadius = 50;

		// Moon Glow
		const moonGlow = ctx.createRadialGradient(x, y, moonRadius * 0.5, x, y, moonRadius * 3);
		moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
		moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
		ctx.fillStyle = moonGlow;
		ctx.beginPath();
		ctx.arc(x, y, moonRadius * 3, 0, Math.PI * 2);
		ctx.fill();

		// Moon Body
		ctx.fillStyle = '#F4F6F0';
		ctx.beginPath();
		ctx.arc(x, y, moonRadius, 0, Math.PI * 2);
		ctx.fill();

		// Craters
		ctx.fillStyle = '#E6E6E6';
		ctx.beginPath();
		ctx.arc(x - 15, y - 10, 8, 0, Math.PI * 2);
		ctx.arc(x + 20, y + 15, 12, 0, Math.PI * 2);
		ctx.arc(x - 10, y + 25, 6, 0, Math.PI * 2);
		ctx.fill();
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
			if (cloud.x - cloud.w * 0.35 > farCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(
				farCtx,
				cloud.x + farCursorOffsetX,
				cloud.y + farCursorOffsetY,
				cloud.w,
				cloud.h,
				cloud.color,
				20
			);
		}

		// Mid clouds
		const midLayerSpeed = 0.7;
		const midMouseMultiplier = 30;
		const midCursorOffsetX = -(deltaX / centerX) * midMouseMultiplier;
		const midCursorOffsetY = -(deltaY / centerY) * midMouseMultiplier * 0.5;

		midCtx.clearRect(0, 0, midCloudsCanvas.width, midCloudsCanvas.height);

		for (const cloud of midClouds) {
			cloud.x += BASE_DRIFT_SPEED * midLayerSpeed;
			if (cloud.x - cloud.w * 0.35 > midCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(
				midCtx,
				cloud.x + midCursorOffsetX,
				cloud.y + midCursorOffsetY,
				cloud.w,
				cloud.h,
				cloud.color,
				20
			);
		}

		// Near clouds
		const nearLayerSpeed = 1.2;
		const nearMouseMultiplier = 50;
		const nearCursorOffsetX = -(deltaX / centerX) * nearMouseMultiplier;
		const nearCursorOffsetY = -(deltaY / centerY) * nearMouseMultiplier * 0.5;

		nearCtx.clearRect(0, 0, nearCloudsCanvas.width, nearCloudsCanvas.height);

		for (const cloud of nearClouds) {
			cloud.x += BASE_DRIFT_SPEED * nearLayerSpeed;
			if (cloud.x - cloud.w * 0.35 > nearCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			drawEnhancedCloud(
				nearCtx,
				cloud.x + nearCursorOffsetX,
				cloud.y + nearCursorOffsetY,
				cloud.w,
				cloud.h,
				cloud.color,
				20
			);
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
		const boostedAlpha = Math.min(baseAlpha * 1.2, 0.95);

		const puffs = [
			{ x: x, y: y, radiusX: width * 0.35, radiusY: height * 0.5 },
			{ x: x - width * 0.25, y: y + height * 0.1, radiusX: width * 0.28, radiusY: height * 0.42 },
			{ x: x + width * 0.25, y: y + height * 0.15, radiusX: width * 0.3, radiusY: height * 0.45 },
			{ x: x - width * 0.1, y: y - height * 0.2, radiusX: width * 0.25, radiusY: height * 0.38 },
			{ x: x + width * 0.15, y: y - height * 0.15, radiusX: width * 0.22, radiusY: height * 0.35 }
		];

		ctx.save();
		ctx.filter = 'none';

		puffs.forEach((puff) => {
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
	}
</script>

<div class="sky-background">
	<canvas bind:this={skyCanvas} width="1920" height="1080" class="sky-canvas"></canvas>
	<canvas bind:this={farCloudsCanvas} width="1920" height="1080" class="cloud-layer far"></canvas>
	<canvas bind:this={midCloudsCanvas} width="1920" height="1080" class="cloud-layer mid"></canvas>
	<canvas bind:this={nearCloudsCanvas} width="1920" height="1080" class="cloud-layer near"></canvas>
</div>

<style>
	.sky-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.sky-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.cloud-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.9;
	}

	.far {
		z-index: 1;
		opacity: 0.8;
	}
	.mid {
		z-index: 2;
		opacity: 0.85;
	}
	.near {
		z-index: 3;
		opacity: 0.9;
	}
</style>
