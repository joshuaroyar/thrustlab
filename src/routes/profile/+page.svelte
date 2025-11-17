<script lang="ts">
	import type { PageData } from '../dashboard/$types';
	import { onMount } from 'svelte';

	let { data } = $props<{ data: PageData }>();
	
	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	const BASE_DRIFT_SPEED = 0.61;

	let farClouds = $state([
		{ x: -200, y: 200, w: 350, h: 120, color: 'rgba(255, 255, 255, 0.5)' },
		{ x: 1000, y: 300, w: 400, h: 140, color: 'rgba(255, 255, 255, 0.45)' },
		{ x: 1800, y: 250, w: 420, h: 150, color: 'rgba(255, 255, 255, 0.48)' },
		{ x: 2500, y: 180, w: 380, h: 130, color: 'rgba(255, 255, 255, 0.47)' }
	]);

	let midClouds = $state([
		{ x: -100, y: 400, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.65)' },
		{ x: 800, y: 500, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.62)' },
		{ x: 1500, y: 450, w: 340, h: 115, color: 'rgba(255, 255, 255, 0.64)' },
		{ x: 2200, y: 480, w: 310, h: 105, color: 'rgba(255, 255, 255, 0.63)' },
		{ x: 2900, y: 420, w: 330, h: 112, color: 'rgba(255, 255, 255, 0.62)' }
	]);

	let nearClouds = $state([
		{ x: -150, y: 700, w: 250, h: 80, color: 'rgba(255, 255, 255, 0.8)' },
		{ x: 600, y: 750, w: 270, h: 85, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 1200, y: 800, w: 260, h: 82, color: 'rgba(255, 255, 255, 0.79)' },
		{ x: 1800, y: 720, w: 280, h: 87, color: 'rgba(255, 255, 255, 0.77)' },
		{ x: 2400, y: 780, w: 265, h: 84, color: 'rgba(255, 255, 255, 0.78)' },
		{ x: 3000, y: 740, w: 275, h: 86, color: 'rgba(255, 255, 255, 0.8)' }
	]);

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	onMount(() => {
		mounted = true;

		// Mouse tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Initialize canvases
		initializeSkies();

		// Drift animation
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

			// Simple sun on left side, positioned below navbar
			const sunX = skyCanvas.width * 0.15;
			const sunY = skyCanvas.height * 0.25;
			const sunRadius = 70;

			// Soft glow around sun
			const sunGlow = skyCtx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 2.5);
			sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.5)');
			sunGlow.addColorStop(0.5, 'rgba(255, 230, 150, 0.2)');
			sunGlow.addColorStop(1, 'rgba(255, 220, 130, 0)');
			skyCtx.fillStyle = sunGlow;
			skyCtx.fillRect(sunX - sunRadius * 2.5, sunY - sunRadius * 2.5, sunRadius * 5, sunRadius * 5);

			// Main sun body with gradient
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

<div class="page-container">
	<div class="content-card animate-on-scroll">
		<h1>Profile</h1>
		<p class="subtitle">Manage your ThrustLab account</p>

		<div class="profile-section animate-slide-left">
			<div class="avatar">
				<span class="avatar-text">{data.user?.username?.charAt(0).toUpperCase() || 'T'}</span>
			</div>
			
			<div class="profile-info">
				<h2>{data.user?.username || 'Test User'}</h2>
				<p class="user-id">ID: {data.user?.id || 'N/A'}</p>
			</div>
		</div>

		<div class="details-section animate-slide-right">
			<h3>Account Details</h3>
			<div class="detail-item">
				<span class="label">Username:</span>
				<span class="value">{data.user?.username || 'N/A'}</span>
			</div>
			<div class="detail-item">
				<span class="label">User ID:</span>
				<span class="value">{data.user?.id || 'N/A'}</span>
			</div>
			<div class="detail-item">
				<span class="label">Account Type:</span>
				<span class="value badge">Test Account</span>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		padding: 8rem 2rem 4rem;
		background: transparent;
	}

	.content-card {
		max-width: 1200px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		padding: 2.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 2rem;
	}

	/* Profile Styles */
	.profile-section {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		border-radius: 0.75rem;
		margin-bottom: 2rem;
		color: white;
		transition: all 0.4s ease;
	}

	.profile-section:hover {
		transform: translateX(5px);
		box-shadow: 0 8px 20px rgba(34, 58, 94, 0.3);
	}

	.avatar {
		width: 100px;
		height: 100px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.avatar-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		color: #223A5E;
	}

	.profile-info h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
	}

	.user-id {
		font-family: 'Roboto', sans-serif;
		opacity: 0.9;
		font-size: 0.95rem;
	}

	.details-section {
		padding: 1.5rem;
		background: #F6F7FA;
		border-radius: 0.75rem;
	}

	.details-section h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 1.5rem;
		margin: 0 0 1.5rem 0;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid #ddd;
	}

	.detail-item:last-child {
		border-bottom: none;
	}

	.label {
		font-family: 'Roboto', sans-serif;
		font-weight: 600;
		color: #222831;
	}

	.value {
		font-family: 'Roboto', sans-serif;
		color: #666;
	}

	.badge {
		background: #38C172;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.9rem;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-container {
			padding: 6rem 1rem 2rem;
		}

		.content-card {
			padding: 1.5rem;
		}

		.profile-section {
			flex-direction: column;
			text-align: center;
		}

		h1 {
			font-size: 2rem;
		}
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
</style>
