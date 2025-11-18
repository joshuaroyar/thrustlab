<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const errorCode = page.status;
	const errorMessage = page.error?.message || 'Page not found';

	let mouseX = $state(0);
	let mouseY = $state(0);

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

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

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		initializeSkies();

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

		const skyCtx = skyCanvas.getContext('2d');
		if (skyCtx) {
			const skyGradient = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
			skyGradient.addColorStop(0, '#87CEEB');
			skyGradient.addColorStop(0.5, '#B0E2FF');
			skyGradient.addColorStop(1, '#E0F6FF');
			skyCtx.fillStyle = skyGradient;
			skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

			const sunX = skyCanvas.width * 0.15;
			const sunY = skyCanvas.height * 0.25;
			const sunRadius = 70;

			const sunGlow = skyCtx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 2.5);
			sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.5)');
			sunGlow.addColorStop(0.5, 'rgba(255, 230, 150, 0.2)');
			sunGlow.addColorStop(1, 'rgba(255, 220, 130, 0)');
			skyCtx.fillStyle = sunGlow;
			skyCtx.fillRect(sunX - sunRadius * 2.5, sunY - sunRadius * 2.5, sunRadius * 5, sunRadius * 5);

			const sunGradient = skyCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
			sunGradient.addColorStop(0, '#FFFEF0');
			sunGradient.addColorStop(0.4, '#FFF4C4');
			sunGradient.addColorStop(0.8, '#FFE680');
			sunGradient.addColorStop(1, '#FFD54F');
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

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;

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
</script>

<!-- Parallax Background -->
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

<div class="error-page">

	<div class="error-content animate-scale">
		<div class="airplane-container">
			<div class="airplane">✈️</div>
			<div class="contrail">
				<div class="trail"></div>
				<div class="trail"></div>
				<div class="trail"></div>
			</div>
		</div>

		<h1 class="error-code animate-slide-left">{errorCode}</h1>
		<h2 class="error-title animate-slide-right">Flight Path Not Found!</h2>
		<p class="error-description animate-fade">
			{#if errorCode === 404}
				Looks like this page is off the radar. The flight path you're following doesn't exist in our navigation system.
			{:else}
				{errorMessage}
			{/if}
		</p>

		<div class="error-actions animate-on-scroll">
			<a href="/" class="btn-primary">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<polyline points="9 22 9 12 15 12 15 22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Return to Home
			</a>
			<a href="/hangar-zone" class="btn-secondary">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round"/>
					<path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Explore Learning Zones
			</a>
		</div>

		<div class="error-hints animate-on-scroll">
			<div class="hint">
				<span class="hint-icon">🧭</span>
				<span>Try using the navigation menu above</span>
			</div>
			<div class="hint">
				<span class="hint-icon">🤖</span>
				<span>Ask JAJA for help finding what you need</span>
			</div>
			<div class="hint">
				<span class="hint-icon">🔍</span>
				<span>Check your URL for typos</span>
			</div>
		</div>
	</div>

	<div class="flight-patterns">
		<div class="pattern pattern-1">
			<div class="mini-plane">✈️</div>
		</div>
		<div class="pattern pattern-2">
			<div class="mini-plane">✈️</div>
		</div>
		<div class="pattern pattern-3">
			<div class="mini-plane">✈️</div>
		</div>
	</div>
</div>

<style>
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

	.error-page {
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}

	.error-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 800px;
		color: var(--font-primary);
	}

	.airplane-container {
		position: relative;
		display: inline-block;
		margin-bottom: 2rem;
		animation: fly 4s ease-in-out infinite;
	}

	@keyframes fly {
		0%, 100% { transform: translateY(0) translateX(0) rotate(-5deg); }
		25% { transform: translateY(-15px) translateX(10px) rotate(0deg); }
		50% { transform: translateY(-30px) translateX(0) rotate(-5deg); }
		75% { transform: translateY(-15px) translateX(-10px) rotate(-10deg); }
	}

	.airplane {
		font-size: 8rem;
		filter: drop-shadow(0 4px 12px rgba(0, 206, 209, 0.5));
		animation: tilt 2s ease-in-out infinite;
	}

	@keyframes tilt {
		0%, 100% { transform: rotate(-5deg); }
		50% { transform: rotate(5deg); }
	}

	.contrail {
		position: absolute;
		bottom: 25%;
		right: 70%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transform: rotate(-20deg);
	}

	.trail {
		width: 80px;
		height: 4px;
		background: linear-gradient(
			90deg,
			rgba(255, 217, 102, 0.6) 0%,
			rgba(0, 206, 209, 0.4) 50%,
			transparent 100%
		);
		border-radius: 2px;
		animation: fade-trail 1.5s ease-in-out infinite;
	}

	.trail:nth-child(2) {
		animation-delay: 0.3s;
		width: 60px;
		opacity: 0.7;
	}

	.trail:nth-child(3) {
		animation-delay: 0.6s;
		width: 40px;
		opacity: 0.5;
	}

	@keyframes fade-trail {
		0%, 100% { opacity: 0.3; transform: scaleX(1); }
		50% { opacity: 0.8; transform: scaleX(1.2); }
	}

	.error-code {
		font-family: 'Montserrat', sans-serif;
		font-size: 8rem;
		font-weight: 900;
		margin: 0;
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
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
		line-height: 1;
	}

	.error-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 1rem 0;
		color: var(--font-primary);
		text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
	}

	.error-description {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: var(--font-primary);
		margin: 1.5rem 0 3rem;
		line-height: 1.6;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
	}

	.error-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: none;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 100%
		);
		color: var(--font-primary);
		box-shadow: 0 4px 20px rgba(0, 206, 209, 0.4);
		border: 2px solid rgba(255, 217, 102, 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(0, 206, 209, 0.6);
		border-color: var(--font-accent-cyan);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.7);
		color: var(--font-primary);
		border: 2px solid var(--font-accent-cyan);
		backdrop-filter: blur(10px);
	}

	.btn-secondary:hover {
		transform: translateY(-3px);
		background: rgba(255, 255, 255, 0.9);
		border-color: var(--ui-yellow);
		box-shadow: 0 4px 20px rgba(255, 217, 102, 0.4);
	}

	.error-hints {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 2rem;
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 50px;
		color: var(--font-primary);
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.hint:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: var(--ui-yellow);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.3);
	}

	.hint-icon {
		font-size: 1.5rem;
	}

	.flight-patterns {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.pattern {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 300px;
		height: 300px;
		border: 2px dashed rgba(255, 217, 102, 0.3);
		border-radius: 50%;
		animation: circle-flight 25s linear infinite;
	}

	.pattern-1 {
		width: 250px;
		height: 250px;
		margin: -125px 0 0 -125px;
		animation-duration: 20s;
	}

	.pattern-2 {
		width: 400px;
		height: 400px;
		margin: -200px 0 0 -200px;
		animation-duration: 30s;
		animation-direction: reverse;
		border-color: rgba(0, 206, 209, 0.3);
	}

	.pattern-3 {
		width: 550px;
		height: 550px;
		margin: -275px 0 0 -275px;
		animation-duration: 40s;
		border-color: rgba(135, 206, 235, 0.3);
	}

	@keyframes circle-flight {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.mini-plane {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%) rotate(90deg);
		font-size: 1.5rem;
		filter: drop-shadow(0 2px 6px rgba(0, 206, 209, 0.4));
		animation: plane-wobble 2s ease-in-out infinite;
	}

	@keyframes plane-wobble {
		0%, 100% { transform: translateX(-50%) rotate(85deg); }
		50% { transform: translateX(-50%) rotate(95deg); }
	}

	/* Parallax Background Styles */
	.parallax-background-system {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
		overflow: hidden;
		background: #87CEEB;
	}

	.parallax-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		will-change: transform;
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

	@media (max-width: 768px) {
		.error-code {
			font-size: 5rem;
		}

		.error-title {
			font-size: 1.8rem;
		}

		.error-description {
			font-size: 1rem;
		}

		.airplane {
			font-size: 5rem;
		}

		.contrail {
			display: none;
		}

		.error-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.error-hints {
			flex-direction: column;
			align-items: stretch;
		}

		.flight-patterns {
			display: none;
		}
	}
</style>
