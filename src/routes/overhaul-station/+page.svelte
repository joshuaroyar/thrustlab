<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	// Base drift speed
	const BASE_DRIFT_SPEED = 0.61; // Increased by 20% + 30% + 30% (total 103% faster)

	// Cloud data arrays as reactive state
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

	onMount(() => {
		mounted = true;

		// Mouse tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Initialize sky and sun (static elements)
		initializeSkies();

		// Start continuous animation loop
		let animationId: number;
		const animate = () => {
			animateCloudLayers();
			animationId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});

	function initializeSkies() {
		if (!skyCanvas) return;

		// Sky gradient
		const skyCtx = skyCanvas.getContext('2d');
		if (skyCtx) {
			const skyGradient = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
			skyGradient.addColorStop(0, '#87CEEB'); // Sky blue at top
			skyGradient.addColorStop(0.5, '#B0E2FF'); // Lighter blue middle
			skyGradient.addColorStop(1, '#E0F6FF'); // Very light blue at bottom
			skyCtx.fillStyle = skyGradient;
			skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

			// Simple sun on left side, positioned below navbar
			const sunX = skyCanvas.width * 0.15; // Left side (15% from left)
			const sunY = skyCanvas.height * 0.25; // Below navbar (25% from top)
			const sunRadius = 70; // Good looking size

			// Soft glow around sun
			const sunGlow = skyCtx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 2.5);
			sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.5)');
			sunGlow.addColorStop(0.5, 'rgba(255, 230, 150, 0.2)');
			sunGlow.addColorStop(1, 'rgba(255, 220, 130, 0)');
			skyCtx.fillStyle = sunGlow;
			skyCtx.fillRect(sunX - sunRadius * 2.5, sunY - sunRadius * 2.5, sunRadius * 5, sunRadius * 5);

			// Main sun body with gradient
			const sunGradient = skyCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
			sunGradient.addColorStop(0, '#FFFEF0'); // Bright cream center
			sunGradient.addColorStop(0.4, '#FFF4C4'); // Light golden
			sunGradient.addColorStop(0.8, '#FFE680'); // Golden yellow
			sunGradient.addColorStop(1, '#FFD54F'); // Darker golden edge
			skyCtx.fillStyle = sunGradient;
			skyCtx.beginPath();
			skyCtx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
			skyCtx.fill();
		}
	}

	function animateCloudLayers() {
		if (!farCloudsCanvas || !midCloudsCanvas || !nearCloudsCanvas) return;

		const farCtx = farCloudsCanvas.getContext('2d');
		const midCtx = midCloudsCanvas.getContext('2d');
		const nearCtx = nearCloudsCanvas.getContext('2d');

		if (!farCtx || !midCtx || !nearCtx) return;

		// Calculate mouse parallax offset
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;

		// === Process FAR CLOUDS ===
		const farLayerSpeed = 0.3;
		const farMouseMultiplier = 15;
		const farCursorOffsetX = -(deltaX / centerX) * farMouseMultiplier;
		const farCursorOffsetY = -(deltaY / centerY) * farMouseMultiplier * 0.5;

		farCtx.clearRect(0, 0, farCloudsCanvas.width, farCloudsCanvas.height);
		
		for (const cloud of farClouds) {
			// Update position (drift)
			cloud.x += BASE_DRIFT_SPEED * farLayerSpeed;
			
			// Wrap logic - reset when cloud is off-screen to the right
			const approxCloudRightEdge = cloud.x + (cloud.w * 0.35);
			if (cloud.x - (cloud.w * 0.35) > farCloudsCanvas.width) {
				cloud.x = -(cloud.w * 0.35);
			}
			
			// Draw cloud with mouse parallax
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

		// === Process MID CLOUDS ===
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

		// === Process NEAR CLOUDS ===
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
	}

	function openPreliminaryModule() {
		goto('/overhaul-station/preliminary-module');
	}

	function openAssemblyModule() {
		goto('/overhaul-station/assembly-disassembly');
	}
</script>

<!-- Morning Parallax Background -->
<div class="parallax-background-system">
	<canvas 
		bind:this={skyCanvas}
		class="parallax-layer sky-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={farCloudsCanvas}
		class="parallax-layer far-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={midCloudsCanvas}
		class="parallax-layer mid-clouds-layer"
		width="3200"
		height="1800"
	></canvas>

	<canvas 
		bind:this={nearCloudsCanvas}
		class="parallax-layer near-clouds-layer"
		width="3200"
		height="1800"
	></canvas>
</div>

<!-- Main Content -->
<div class="overhaul-page">
	<!-- Title Section -->
	<h1 class="main-title">Overhaul Station</h1>

	<!-- Description -->
	<p class="main-description">
		Step into the Overhaul Bay, where hands-on learning takes flight. In this interactive zone, students dive into the intricate process of assembling and disassembling turbofan engine components—gaining a deeper understanding of each part's role and the essential principles of gas turbine engine overhaul. It's where theory meets practice, transforming knowledge into real-world technical skill.
	</p>

	<!-- Two Containers Side by Side -->
	<div class="containers-grid">
		<!-- Container 1: Preliminary Laboratory Module -->
		<div 
			class="module-container clickable"
			role="button"
			tabindex="0"
			onclick={openPreliminaryModule}
			onkeydown={(e) => e.key === 'Enter' && openPreliminaryModule()}
		>
			<h2 class="container-title">Preliminary Laboratory Module</h2>
			<p class="container-description">
				This module familiarizes students with the key steps of gas turbine engine overhaul—disassembly, inspection, repair, and testing—emphasizing efficiency, reliability, and hands-on maintenance skills.
			</p>
			<div class="click-hint">→</div>
		</div>

		<!-- Container 2: Assembly and Disassembly Activity -->
		<div 
			class="module-container clickable"
			role="button"
			tabindex="0"
			onclick={openAssemblyModule}
			onkeydown={(e) => e.key === 'Enter' && openAssemblyModule()}
		>
			<h2 class="container-title">Assembly and Disassembly Activity</h2>
			<p class="container-description">
				Students gain hands-on experience in taking apart and reassembling the main components of a turbofan engine, developing practical skills, precision, and a deeper understanding of how each part works together.
			</p>
			<div class="click-hint">→</div>
		</div>
	</div>
</div>



<style>
	:global(body) {
		overflow-x: hidden;
	}

	/* Parallax Background System */
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

	.parallax-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		will-change: transform;
		pointer-events: none;
		transform-origin: center center;
	}

	.sky-layer {
		z-index: 1;
	}

	.far-clouds-layer {
		z-index: 2;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
	}

	.mid-clouds-layer {
		z-index: 3;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
	}

	.near-clouds-layer {
		z-index: 4;
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.95;
	}

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

	/* Main Page Layout */
	.overhaul-page {
		min-height: 100vh;
		padding: 6rem 2rem 4rem;
		max-width: 1400px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.main-title {
		font-family: var(--font-heading);
		font-size: clamp(3rem, 6vw, 5rem);
		font-weight: 900;
		text-align: center;
		margin: 0 0 2rem 0;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 20%,
			var(--ui-light-blue) 40%,
			var(--font-accent-yellow) 60%,
			var(--ui-yellow) 80%,
			var(--font-accent-cyan) 100%
		);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 4s ease-in-out infinite;
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	.main-description {
		font-family: var(--font-body);
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		color: var(--font-primary);
		text-align: justify;
		line-height: 1.8;
		margin: 0 auto 4rem;
		max-width: 900px;
		text-shadow: none;
		background: #FFFFFF;
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	/* Containers Grid */
	.containers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		margin-top: 3rem;
	}

	.module-container {
		background: #FFFFFF;
		border-radius: 1.5rem;
		padding: 3rem 2.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.module-container.clickable {
		cursor: pointer;
	}

	.module-container:hover {
		transform: translateY(-10px);
		box-shadow: 0 12px 40px rgba(135, 206, 235, 0.5);
		border-color: var(--ui-yellow);
	}

	.module-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 217, 102, 0.05) 0%, rgba(135, 206, 235, 0.05) 100%);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.module-container:hover::before {
		opacity: 1;
	}

	.container-title {
		font-family: var(--font-heading);
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--bg-primary);
		margin: 0 0 1.5rem 0;
		text-shadow: none;
		text-align: center;
	}

	.container-description {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--font-primary);
		margin: 0 0 2rem 0;
		text-shadow: none;
		text-align: justify;
	}

	.click-hint {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--ui-light-blue);
		text-align: right;
		margin-top: auto;
		opacity: 0.8;
		transition: all 0.3s ease;
	}

	.module-container:hover .click-hint {
		opacity: 1;
		color: var(--bg-secondary);
		transform: translateX(10px);
	}





	/* Responsive Design */
	@media (max-width: 968px) {
		.containers-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	@media (max-width: 768px) {
		.overhaul-page {
			padding: 5rem 1rem 3rem;
		}

		.main-description {
			padding: 1.5rem;
		}

		.module-container {
			padding: 2rem 1.5rem;
		}

		.container-title {
			font-size: 1.5rem;
		}
	}
</style>