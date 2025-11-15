<script lang="ts">
	import { onMount } from 'svelte';

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	let mounted = $state(false);
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
			// Evening sky colors (sunset/dusk)
			const skyGradient = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
			skyGradient.addColorStop(0, '#FF6B6B');      // Orange-red at top
			skyGradient.addColorStop(0.3, '#FF8C42');    // Light orange
			skyGradient.addColorStop(0.6, '#FFB347');    // Peach
			skyGradient.addColorStop(1, '#FFD700');      // Gold at bottom
			skyCtx.fillStyle = skyGradient;
			skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

			// Add sun in top left
			const sunX = skyCanvas.width * 0.15; // Left side (15% from left)
			const sunY = skyCanvas.height * 0.25; // Top area (25% from top)
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
</script>

<!-- Evening Parallax Background -->
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

<div class="signup-container">
	<div class="signup-card animate-scale">
		<h1>Join ThrustLab</h1>
		<p class="subtitle">Start your journey in aerospace engineering education</p>

		<form class="signup-form animate-on-scroll">
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" placeholder="Choose a username" />
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" placeholder="your@email.com" />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" placeholder="Create a secure password" />
			</div>

			<button type="submit" class="signup-button">
				Create Account
			</button>
		</form>

		<div class="divider">
			<span>or</span>
		</div>

		<p class="login-link">
			Already have an account? <a href="/login">Log in</a>
		</p>

		<div class="features-list animate-on-scroll">
			<h3>What you'll get:</h3>
			<ul>
				<li>✅ Access to all learning zones</li>
				<li>✅ Interactive 3D simulations</li>
				<li>✅ AI-powered assistance</li>
				<li>✅ Progress tracking</li>
				<li>✅ Assessment tools</li>
			</ul>
		</div>
	</div>
</div>

<style>
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

	.signup-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8rem 2rem 4rem;
	}

	.signup-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		padding: 3rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.5);
		transition: all 0.4s ease;
	}

	.signup-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2.25rem;
		font-weight: 900;
		color: var(--font-primary);
		margin: 0 0 0.5rem 0;
		text-align: center;
	}

	.subtitle {
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.8;
		text-align: center;
		margin: 0 0 2rem 0;
		font-size: 1rem;
		line-height: 1.5;
	}	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-family: var(--font-body);
		font-weight: 600;
		color: var(--font-primary);
		font-size: 0.95rem;
	}

	input {
		padding: 1rem 1.25rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 0.75rem;
		font-family: var(--font-body);
		font-size: 1rem;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.5);
		color: var(--font-primary);
	}

	input::placeholder {
		color: rgba(0, 0, 0, 0.4);
	}

	input:focus {
		outline: none;
		border-color: var(--ui-yellow);
		box-shadow: 0 0 0 3px rgba(255, 217, 102, 0.2);
		background: rgba(28, 46, 58, 0.6);
	}

	.signup-button {
		position: relative;
		background: var(--ui-yellow);
		color: #000000;
		border: none;
		padding: 1.25rem 2rem;
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.5);
		overflow: hidden;
	}

	.signup-button::before {
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
	}

	.signup-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.signup-button:hover {
		background: #FFE66D;
		transform: translateY(-3px);
		box-shadow: 0 10px 30px rgba(255, 217, 102, 0.6), 0 0 40px rgba(255, 217, 102, 0.3);
	}

	.divider {
		text-align: center;
		position: relative;
		margin: 2rem 0;
	}

	.divider::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 1px;
		background: rgba(135, 206, 235, 0.3);
	}

	.divider span {
		background: rgba(255, 255, 255, 0.95);
		padding: 0 1rem;
		position: relative;
		color: var(--font-primary);
		opacity: 0.7;
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.login-link {
		text-align: center;
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.9;
		margin: 0 0 2rem 0;
	}

	.login-link a {
		color: var(--ui-yellow);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.login-link a:hover {
		color: var(--font-accent-yellow);
		text-decoration: underline;
	}

	.features-list {
		background: rgba(135, 206, 235, 0.1);
		padding: 1.5rem;
		border-radius: 1rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
	}

	.features-list h3 {
		font-family: var(--font-heading);
		color: var(--font-primary);
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		font-weight: 900;
	}

	.features-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features-list li {
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.9;
		padding: 0.5rem 0;
		font-size: 0.95rem;
	}

	@media (max-width: 768px) {
		.signup-card {
			padding: 2rem;
		}
	}
</style>
