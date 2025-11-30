<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ModelViewer from '$lib/components/ModelViewer.svelte';
	import { turbofanPartDescriptions, turbofanComponentGroups } from '$lib/data/turbofanParts';
	import { ttsService } from '$lib/utils/tts';

	let showLabels = $state(true);
	let modelLoaded = $state(false);

	// Cloud Animation State
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

	// Part descriptions for highlighting
	// Based on actual 3D model mesh names and colors
	const partDescriptions = turbofanPartDescriptions;

	let cameraResetTrigger = $state(0);

	onMount(() => {
		// Handle escape key to go back to turbofan engine
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				goto('/turbofan-engine');
			}
		};

		// Mouse tracking for parallax
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('keydown', handleKeyPress);
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
			window.removeEventListener('keydown', handleKeyPress);
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
			skyGradient.addColorStop(0, '#FF6B6B'); // Orange-red at top
			skyGradient.addColorStop(0.3, '#FF8C42'); // Light orange
			skyGradient.addColorStop(0.6, '#FFB347'); // Peach
			skyGradient.addColorStop(1, '#FFD700'); // Gold at bottom
			skyCtx.fillStyle = skyGradient;
			skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

			// Add sun in top left
			const sunX = skyCanvas.width * 0.15; // Left side (15% from left)
			const sunY = skyCanvas.height * 0.25; // Top area (25% from top)
			const sunRadius = 70;

			// Soft glow around sun
			const sunGlow = skyCtx.createRadialGradient(
				sunX,
				sunY,
				sunRadius * 0.3,
				sunX,
				sunY,
				sunRadius * 2.5
			);
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

	function handleBackClick() {
		goto('/turbofan-engine');
	}

	function toggleLabels() {
		showLabels = !showLabels;
	}

	function resetView() {
		// Trigger camera reset by changing the key
		cameraResetTrigger++;
	}

	function handleModelLoaded() {
		modelLoaded = true;
		
		// Preload TTS audio for all components for better performance
		const textsToPreload = turbofanComponentGroups.map(
			(group) => `${group.label}. ${group.description}`
		);
		ttsService.preload(textsToPreload).catch((error) => {
			console.warn('Failed to preload TTS audio:', error);
		});
	}
</script>

<!-- Evening Sky Background -->
<div class="sky-background">
	<canvas bind:this={skyCanvas} width="1920" height="1080" class="sky-canvas"></canvas>
	<canvas bind:this={farCloudsCanvas} width="1920" height="1080" class="cloud-layer far"></canvas>
	<canvas bind:this={midCloudsCanvas} width="1920" height="1080" class="cloud-layer mid"></canvas>
	<canvas bind:this={nearCloudsCanvas} width="1920" height="1080" class="cloud-layer near"></canvas>
</div>

<div class="fullscreen-page">
	<div class="header-controls">
		<button class="control-button back-button" onclick={handleBackClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			Back to Turbofan Engine
		</button>

		<div class="control-group">
			<button class="control-button" title="Reset View" onclick={resetView}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="23 4 23 10 17 10"></polyline>
					<polyline points="1 20 1 14 7 14"></polyline>
					<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
				</svg>
				Reset
			</button>

			<button
				class="control-button {showLabels ? 'active' : ''}"
				title="Toggle Labels"
				onclick={toggleLabels}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="12" y1="2" x2="12" y2="6"></line>
					<line x1="12" y1="18" x2="12" y2="22"></line>
					<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
					<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
					<line x1="2" y1="12" x2="6" y2="12"></line>
					<line x1="18" y1="12" x2="22" y2="12"></line>
					<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
					<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
				</svg>
				Labels
			</button>

			<button
				class="control-button exit-fullscreen"
				onclick={handleBackClick}
				title="Exit Fullscreen"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					<line x1="11" y1="8" x2="11" y2="14"></line>
				</svg>
				Exit Fullscreen
			</button>
		</div>
	</div>

	<div class="engine-container">
		{#if !modelLoaded}
			<div class="loading-overlay">
				<div class="loading-spinner"></div>
				<p>Loading 3D Model...</p>
			</div>
		{/if}

		{#key cameraResetTrigger}
			<ModelViewer
				modelPath="/models/Turbofan (Caseless).glb"
				canvasClass="fullscreen-canvas"
				cameraPosition={{ alpha: Math.PI / 2, beta: Math.PI / 3, radius: 8 }}
				enableHighlight={showLabels}
				{partDescriptions}
				onModelLoaded={handleModelLoaded}
				enableTTS={true}
			/>
		{/key}
	</div>

	<div class="footer-info">
		<p>Press <kbd>ESC</kbd> to return to Turbofan Engine</p>
	</div>
</div>

<style>
	.sky-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
	}

	.sky-canvas,
	.cloud-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.sky-canvas {
		z-index: 0;
	}

	.cloud-layer.far {
		z-index: 1;
		opacity: 0.8;
	}

	.cloud-layer.mid {
		z-index: 2;
		opacity: 0.9;
	}

	.cloud-layer.near {
		z-index: 3;
	}

	.fullscreen-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		position: relative;
	}

	.header-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
		z-index: 10;
	}

	.control-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.control-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(10, 47, 53, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 2px solid rgba(135, 206, 235, 0.5);
		border-radius: 50px;
		color: var(--font-secondary);
		font-family: var(--font-heading);
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.control-button:hover {
		background: rgba(28, 62, 74, 0.9);
		border-color: var(--ui-light-blue);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(135, 206, 235, 0.3);
	}

	.back-button {
		background: rgba(255, 217, 102, 0.9);
		border-color: var(--ui-yellow);
		color: #000000;
	}

	.back-button:hover {
		background: var(--ui-yellow);
		border-color: #ffe66d;
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.5);
	}

	.exit-fullscreen {
		background: rgba(215, 94, 46, 0.8);
		border-color: rgba(215, 94, 46, 0.6);
	}

	.exit-fullscreen:hover {
		background: rgba(215, 94, 46, 1);
		border-color: #d75e2e;
	}

	.engine-container {
		flex: 1;
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		display: flex;
		position: relative; /* Ensure loading overlay is positioned relative to this */
		min-height: 600px;
		margin-bottom: 1rem;
		animation: fadeIn 0.6s ease;
		overflow: hidden; /* Ensure content doesn't spill out */
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(10, 47, 53, 0.9);
		z-index: 100;
		gap: 1.5rem;
	}

	.loading-spinner {
		width: 60px;
		height: 60px;
		border: 4px solid rgba(135, 206, 235, 0.2);
		border-top-color: var(--ui-light-blue);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-overlay p {
		color: var(--font-accent-cyan);
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 600;
	}

	.control-button.active {
		background: rgba(28, 62, 74, 1);
		border-color: var(--ui-light-blue);
		box-shadow: 0 0 20px rgba(135, 206, 235, 0.4);
	}

	.footer-info {
		text-align: center;
		padding: 1rem;
		background: rgba(10, 47, 53, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.2);
	}

	.footer-info p {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--font-secondary);
		margin: 0;
	}

	kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: rgba(255, 217, 102, 0.3);
		border: 1px solid var(--ui-yellow);
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--font-accent-yellow);
		margin: 0 0.25rem;
	}

	@media (max-width: 768px) {
		.fullscreen-page {
			padding: 0.5rem;
		}

		.header-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.control-group {
			justify-content: center;
		}

		.control-button {
			font-size: 0.85rem;
			padding: 0.6rem 1.2rem;
		}

		.engine-container {
			min-height: 400px;
		}
	}
</style>
