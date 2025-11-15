<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	const BASE_DRIFT_SPEED = 0.61; // Increased by 20% + 30% + 30% (total 103% faster)

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

			const sunX = skyCanvas.width * 0.2;
			const sunY = skyCanvas.height * 0.15;
			const sunRadius = 80;

			const sunGlow = skyCtx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 3);
			sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
			sunGlow.addColorStop(0.5, 'rgba(255, 255, 150, 0.15)');
			sunGlow.addColorStop(1, 'rgba(255, 255, 150, 0)');
			skyCtx.fillStyle = sunGlow;
			skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

			const sunGradient = skyCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
			sunGradient.addColorStop(0, '#FFF9E6');
			sunGradient.addColorStop(0.5, '#FFE87C');
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

<div class="page-container">

	<div class="chat-container animate-scale">
		<div class="chat-messages">
			<div class="welcome-message animate-slide-left">
				<div class="ai-avatar">🤖</div>
				<div class="message-content">
					<p class="greeting">JAJA</p>
					<p class="prompt">Hi! I'm JAJA - your AI co-engineer bot for learning inside ThrustLab!</p>
				</div>
			</div>

			<div class="message ai-message animate-slide-left" style="--delay: 0.2s">
				<div class="message-avatar">🤖</div>
				<div class="message-bubble">
					<p>I can help you with:</p>
					<ul>
						<li>📚 Technical questions about engine components</li>
						<li>🔧 Troubleshooting guidance</li>
						<li>🎓 Learning recommendations</li>
						<li>📊 Performance calculations</li>
						<li>💡 Study tips and resources</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="chat-input-wrapper animate-on-scroll">
			<input type="text" placeholder="Fuel your curiosity, ask me anything!" class="chat-input" />
			<button class="send-button" aria-label="Send message" title="Send message">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.page-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		padding: 8rem 2rem 4rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.chat-container {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.5);
		overflow: hidden;
		transition: all 0.4s ease;
		min-height: 600px;
		display: flex;
		flex-direction: column;
	}

	.chat-container:hover {
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	}

	.welcome-message {
		background: linear-gradient(135deg, var(--font-primary) 0%, var(--bg-quaternary) 100%);
		color: white;
		padding: 2.5rem 2rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.ai-avatar {
		font-size: 4rem;
		animation: float 3s ease-in-out infinite;
		flex-shrink: 0;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.message-content {
		flex: 1;
	}

	.greeting {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.8rem;
		font-weight: 900;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
	}

	.prompt {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1.2rem;
		margin: 0;
		opacity: 0.95;
		font-style: italic;
	}

	.chat-messages {
		padding: 2rem;
		min-height: 400px;
		overflow-y: auto;
		background: rgba(246, 247, 250, 0.5);
		flex: 1;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #E0E0E0;
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--font-accent-cyan);
		border-radius: 4px;
	}

	.message {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		transition-delay: var(--delay, 0s);
	}

	.message-avatar {
		font-size: 2rem;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.message-bubble {
		background: white;
		padding: 1.25rem 1.5rem;
		border-radius: 1.25rem;
		border-top-left-radius: 0.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		max-width: 80%;
	}

	.message-bubble p {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		margin: 0 0 0.75rem 0;
		line-height: 1.6;
		font-size: 1.05rem;
	}

	.message-bubble p:last-child {
		margin-bottom: 0;
	}

	.message-bubble ul {
		margin: 0.75rem 0 0 0;
		padding-left: 0;
		list-style: none;
	}

	.message-bubble li {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		opacity: 0.8;
		margin: 0.5rem 0;
		padding-left: 0.5rem;
		line-height: 1.6;
	}

	.chat-input-wrapper {
		padding: 1.5rem 2rem;
		background: white;
		border-top: 2px solid #E0E0E0;
		display: flex;
		gap: 1rem;
	}

	.chat-input {
		flex: 1;
		padding: 1rem 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 50px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1rem;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.8);
		color: var(--font-primary);
	}

	.chat-input::placeholder {
		color: var(--font-primary);
		opacity: 0.5;
	}

	.chat-input:focus {
		outline: none;
		border-color: var(--font-accent-cyan);
		box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.2);
		background: white;
	}

	.send-button {
		background: linear-gradient(135deg, var(--ui-yellow) 0%, var(--font-accent-yellow) 100%);
		color: var(--font-primary);
		border: none;
		padding: 1rem 1.5rem;
		border-radius: 50px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 60px;
	}

	.send-button svg {
		transition: transform 0.3s ease;
	}

	.send-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(255, 217, 102, 0.6);
	}

	.send-button:hover svg {
		transform: translateX(3px);
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 6rem 1rem 2rem;
		}

		.chat-container {
			min-height: 500px;
		}

		.welcome-message {
			flex-direction: column;
			text-align: center;
			padding: 2rem 1.5rem;
		}

		.greeting {
			font-size: 1.5rem;
		}

		.prompt {
			font-size: 1rem;
		}

		.chat-input-wrapper {
			flex-direction: column;
			padding: 1rem;
		}

		.send-button {
			width: 100%;
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
