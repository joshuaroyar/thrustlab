<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let driftOffset = $state(0);
	let animationFrameId: number;

	// Tab state
	let activeTab = $state<'overview' | 'sections'>('overview');

	onMount(() => {
		mounted = true;

		// Generate cloud layers
		generateSkyLayer();
		generateFarClouds();
		generateMidClouds();
		generateNearClouds();

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Continuous drift animation
		const animate = () => {
			driftOffset += 0.1;
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	});

	// Generate evening sky gradient with setting sun
	function generateSkyLayer() {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;

		const width = skyCanvas.width;
		const height = skyCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Evening sky colors (sunset/dusk)
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, '#FF6B6B');      // Orange-red at top
		gradient.addColorStop(0.3, '#FF8C42');    // Light orange
		gradient.addColorStop(0.6, '#FFB347');    // Peach
		gradient.addColorStop(1, '#FFD700');      // Gold at bottom

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add setting sun (positioned lower and to the right for evening)
		const sunX = width * 0.85; // Right side
		const sunY = height * 0.7;  // Lower position
		const sunRadius = 80;

		// Evening sun glow (more intense)
		const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 5);
		sunGlow.addColorStop(0, 'rgba(255, 150, 50, 0.6)');
		sunGlow.addColorStop(0.5, 'rgba(255, 100, 30, 0.3)');
		sunGlow.addColorStop(1, 'rgba(255, 80, 20, 0)');
		ctx.fillStyle = sunGlow;
		ctx.fillRect(sunX - sunRadius * 5, sunY - sunRadius * 5, sunRadius * 10, sunRadius * 10);

		// Sun body (more orange/red for evening)
		const sunGradient = ctx.createRadialGradient(sunX - 15, sunY - 15, 10, sunX, sunY, sunRadius);
		sunGradient.addColorStop(0, '#FFF4D6');
		sunGradient.addColorStop(0.4, '#FFB347');
		sunGradient.addColorStop(1, '#FF8C42');
		ctx.fillStyle = sunGradient;
		ctx.beginPath();
		ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
		ctx.fill();
	}

	function generateFarClouds() {
		if (!farCloudsCanvas) return;
		const ctx = farCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = farCloudsCanvas.width;
		const height = farCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const cloudData: Array<{x: number, y: number, w: number, h: number, color: string, blur: number}> = [];

		const cloudCount = 19;
		const spacing = width / cloudCount;
		
		for (let i = 0; i < cloudCount; i++) {
			cloudData.push({
				x: i * spacing + Math.random() * spacing * 0.5,
				y: Math.random() * height * 0.4,
				w: 120 + Math.random() * 80,
				h: 40 + Math.random() * 30,
				color: 'rgba(255, 255, 255, 0.6)',
				blur: 8
			});
		}

		cloudData.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, cloud.blur);
		});
	}

	function generateMidClouds() {
		if (!midCloudsCanvas) return;
		const ctx = midCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = midCloudsCanvas.width;
		const height = midCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.1, y: height * 0.25, w: 200, h: 70, color: 'rgba(255, 255, 255, 0.75)', blur: 5 },
			{ x: width * 0.35, y: height * 0.15, w: 250, h: 85, color: 'rgba(255, 255, 255, 0.8)', blur: 5 },
			{ x: width * 0.6, y: height * 0.3, w: 220, h: 75, color: 'rgba(255, 255, 255, 0.75)', blur: 5 },
			{ x: width * 0.85, y: height * 0.2, w: 240, h: 80, color: 'rgba(255, 255, 255, 0.78)', blur: 5 }
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, cloud.blur);
		});
	}

	function generateNearClouds() {
		if (!nearCloudsCanvas) return;
		const ctx = nearCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = nearCloudsCanvas.width;
		const height = nearCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.15, y: height * 0.4, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.9)', blur: 3 },
			{ x: width * 0.5, y: height * 0.35, w: 350, h: 120, color: 'rgba(255, 255, 255, 0.92)', blur: 3 },
			{ x: width * 0.8, y: height * 0.45, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.88)', blur: 3 }
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, cloud.blur);
		});
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
		const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
		if (!rgbaMatch) return;
		
		const [, r, g, b, a = '1'] = rgbaMatch;
		const baseAlpha = parseFloat(a);
		const boostedAlpha = Math.min(baseAlpha * 1.3, 0.95);

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

	function getParallaxStyle(layer: 'far' | 'mid' | 'near') {
		if (!mounted) return '';

		const speeds = {
			far: 0.5,
			mid: 1,
			near: 1.5
		};

		const speed = speeds[layer];
		const canvasWidth = 3200;

		const drift = (driftOffset * speed) % canvasWidth;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;
		
		const parallaxMultiplier = {
			far: 20,
			mid: 40,
			near: 60
		};
		
		const multiplier = parallaxMultiplier[layer];
		const cursorOffsetX = -(deltaX / centerX) * multiplier;
		const cursorOffsetY = -(deltaY / centerY) * multiplier * 0.6;

		return `transform: translate3d(${drift + cursorOffsetX}px, ${cursorOffsetY}px, 0);`;
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
		style={getParallaxStyle('far')}
	></canvas>

	<canvas 
		bind:this={midCloudsCanvas}
		class="parallax-layer mid-clouds-layer"
		width="3200"
		height="1800"
		style={getParallaxStyle('mid')}
	></canvas>

	<canvas 
		bind:this={nearCloudsCanvas}
		class="parallax-layer near-clouds-layer"
		width="3200"
		height="1800"
		style={getParallaxStyle('near')}
	></canvas>
</div>

<!-- Main Content -->
<div class="turbofan-page">
	<!-- Title Section -->
	<h1 class="main-title">Turbofan Zone</h1>
	
	<!-- Description -->
	<p class="main-description">
		Enter the Turbofan Engine Zone, an immersive hub where students can explore a fully rotatable 3D turbofan engine in stunning detail. Here, they can interact with each component, uncover the inner workings of every section, and gain a clear understanding of how these powerful machines drive modern aircraft to the skies.
	</p>

	<!-- Tab Toggle Buttons -->
	<div class="tab-buttons">
		<button 
			class="tab-button {activeTab === 'overview' ? 'active' : ''}"
			onclick={() => activeTab = 'overview'}
		>
			Overview
		</button>
		<button 
			class="tab-button {activeTab === 'sections' ? 'active' : ''}"
			onclick={() => activeTab = 'sections'}
		>
			Engine Sections
		</button>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'overview'}
		<div class="overview-content">
			<!-- 3D Engine Container -->
			<div 
				class="content-box engine-box clickable"
				role="button"
				tabindex="0"
				onclick={() => goto('/turbofan-zone/engine-instructions')}
				onkeydown={(e) => e.key === 'Enter' && goto('/turbofan-zone/engine-instructions')}
			>
				<button 
					class="zoom-icon"
					title="View Instructions & Fullscreen"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						<line x1="11" y1="8" x2="11" y2="14"></line>
						<line x1="8" y1="11" x2="14" y2="11"></line>
					</svg>
				</button>
				<div class="placeholder-content">
					<div class="placeholder-icon">🚀</div>
					<p>3D Turbofan Engine Model</p>
					<span class="placeholder-text">Interactive 3D model coming soon<br/>Click anywhere to explore</span>
				</div>
			</div>

			<!-- Overview & Parameters Container -->
			<div class="content-box full-width">
				<h2 class="box-title">Overview and Parameters</h2>
				<div class="placeholder-content small">
					<p class="placeholder-text">Engine specifications and performance parameters will be displayed here</p>
				</div>
			</div>

		<!-- More About Turbofan Container -->
		<div class="content-box full-width more-info-container">
			<h2 class="box-title">More About Turbofan Engine</h2>
			<div class="more-info-content">
				<!-- Content Section 1 with side-by-side images -->
				<div class="content-section">
					<div class="image-pair">
						<img src="/images/turbofan-more-info/img_1.1.png" alt="Turbofan Engine Forward Fan" class="side-image" />
						<img src="/images/turbofan-more-info/img_1.2.png" alt="Turbofan Engine Aft Fan" class="side-image" />
					</div>
					<p class="content-text">
						The airlines' choice. Turbofans are like Turbojets but also have a large fan accelerating the air's entry into the engine and adding to the thrust as an internal propeller.
						Engines that have the fan mounted in front of the compressor are called forward-fan engines, while turbofan engines that have the fan mounted to the turbine section are called aft-fan engines.
					</p>
				</div>

				<!-- Content Section 2 with centered image -->
				<div class="content-section">
					<div class="image-center">
						<img src="/images/turbofan-more-info/img_2.png" alt="Turbofan Bypass Engine" class="center-image" />
					</div>
					<p class="content-text">
						The inlet air that passes through a turbofan engine is usually divided into two separate streams of air. One stream passes through the engine core while a second stream coaxially bypasses the engine core. It is this bypass stream of air that is responsible for the term bypass engine. When discussing bypass engines there are three terms you must be familiar with; they are thrust ratio, bypass ratio, and fan pressure ratio. A turbofan engine's thrust ratio is a comparison of the thrust produced by the fan to the thrust produced by the engine core exhaust. On the other hand, a turbofan's bypass ratio refers to the ratio of incoming air that bypasses the core to the amount of air that passes through the engine core.
					</p>
				</div>

				<!-- Content Section 3 with side-by-side images -->
				<div class="content-section">
					<div class="image-pair">
						<img src="/images/turbofan-more-info/img_3.1.png" alt="Turbofan Classifications" class="side-image" />
						<img src="/images/turbofan-more-info/img_3.2.png" alt="Bypass Ratio Types" class="side-image" />
					</div>
					<p class="content-text">
						Turbofans in civil aircraft are generally divided into three classifications based on bypass ratio:<br/>
						Low bypass (1:1)<br/>
						Medium bypass (2:1 or 3:1)<br/>
						High bypass (4:1 or greater)<br/>
						Bypass Ratio (bypass air to engine air), Thrust Ratio (fan to engine core exhaust), Fan Pressure Ratio (pressure leaving the fan to pressure entering the fan).
					</p>
				</div>

				<!-- Content Section 4 with centered image -->
				<div class="content-section">
					<div class="image-center">
						<img src="/images/turbofan-more-info/img_4.png" alt="Turbofan Engine Details" class="center-image" />
					</div>
				</div>
			</div>
		</div>
		</div>
	{:else}
		<div class="sections-content">
			<h2 class="module-title">
				LEARNING MODULE 03:<br/>
				SECTIONS OF A GAS TURBINE ENGINE
			</h2>
			<div class="module3-content">
				<!-- Introduction -->
				<section class="content-section">
					<h3 class="section-heading">ENGINE COMPONENTS</h3>
					<p class="content-text">
						There are 5 major sections of the gas turbine engine that are grouped into 2 sections: the hot section and the cold section.
						A turbine engine's hot section includes the combustion, turbine, and exhaust sections. The cold section, on the other hand, includes the air inlet duct and the compressor section.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_1.png" alt="Gas Turbine Engine Sections" class="center-image" />
					</div>
				</section>

				<!-- Cold Section - Air Inlet -->
				<section class="content-section">
					<h3 class="section-heading">COLD SECTION</h3>
					<h4 class="subsection-heading">AIR INLET</h4>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_2.png" alt="Air Inlet Section" class="center-image" />
					</div>
					<p class="content-text">
						The air intake of a gas turbine engine is either built into the airframe itself, if the engine is mounted in the airframe, or is the forward part of the nacelle installation if the engine is wing or rear-fuselage-mounted.
					</p>
					<p class="content-text">
						The air intake is designed to provide a turbulence-free supply of air to the first-stage compressor of the engine, with the minimum energy loss occurring through the inlet.
					</p>
					<p class="content-text">
						To enable the compressor to operate satisfactorily, the air must reach the compressor at a uniform pressure, distributed evenly across the whole of the face of the first stage.
					</p>
					<p class="content-text">
						The design of the intake duct is therefore vital to the performance of the engine, under all airspeed and angles of attack, to avoid compressor stall or surge to be avoided.
					</p>
					<div class="info-box">
						<h5>Functions of the air inlet:</h5>
						<ul>
							<li>Recover as much of the total pressure of the free airstream as possible and deliver this pressure to the compressor. This is known as ram recovery or pressure recovery.</li>
							<li>Many inlets are shaped to raise the air pressure above atmospheric pressure.</li>
							<li>Provide a uniform supply of air to the compressor so the compressor can operate efficiently.</li>
						</ul>
					</div>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_1.png" alt="Air Inlet Functions" class="center-image" />
					</div>
				</section>

				<!-- Types of Air Inlet Ducts -->
				<section class="content-section">
					<h4 class="subsection-heading">Types of Air Inlet Ducts</h4>
					<div class="info-box">
						<p><strong>Engine Mounted:</strong> Several large commercial aircraft and large military aircraft use wing-mounted engines. In a few cases, such as the DC-10 and L-1011, a combination of wing-mounted and vertical stabilizer-mounted engines is used.</p>
						<p><strong>Wings Mounted:</strong> Some aircraft with engines mounted inside the wings feature air inlet ducts in the wing's leading edge. Aircraft such as the Aerospatiale Caravelle, de Havilland Comet, and de Havilland Vampire all utilize wing-mounted inlets.</p>
						<p><strong>Fuselage Mounted:</strong> Engines mounted inside a fuselage typically use air inlet ducts located near the front of the fuselage. For example, many early military aircraft were designed with an air inlet duct in the nose of the fuselage.</p>
					</div>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_2.png" alt="Types of Air Inlet Ducts" class="center-image" />
					</div>
				</section>

				<!-- Subsonic Inlets -->
				<section class="content-section">
					<h4 class="subsection-heading">Subsonic Inlets</h4>
					<p class="content-text">
						A typical subsonic air inlet consists of a fixed geometry duct whose diameter progressively increases from front to back. This divergent shape works like a venturi in that as the intake air spreads out, the velocity of the air decreases and the pressure increases. This added pressure contributes significantly to engine efficiency once the aircraft reaches its design cruising speed.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_3.png" alt="Subsonic Inlet" class="center-image" />
					</div>
				</section>

				<!-- Supersonic Inlets -->
				<section class="content-section">
					<h4 class="subsection-heading">Supersonic Inlets</h4>
					<p class="content-text">
						On supersonic aircraft a typical air inlet duct has either a fixed or variable geometry whose diameter progressively decreases, then increases from front to back. This convergent-divergent shape is used to slow the incoming airflow to subsonic speed before it reaches the compressor. The supersonic diffuser gradually decreases in area from front to rear which has the effect of reducing the air velocity down to below Mach 1. Further reduction of velocity is achieved by a subsonic diffuser which increases in area towards the compressor face. The control of shock waves that form on the air inlet is also important to correctly decelerate the air through the shock waves. The use of variable geometry intakes allow the correct control of intake shocks and may also comprise spill doors to allow excess air to be spilled from the inlet without having its velocity changed.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_4.png" alt="Supersonic Inlet" class="center-image" />
					</div>
				</section>

				<!-- Bellmouth Inlets -->
				<section class="content-section">
					<h4 class="subsection-heading">Bellmouth Inlets</h4>
					<p class="content-text">
						Bellmouth inlets have a convergent profile that is designed specifically for obtaining very high aerodynamic efficiency when stationary or in slow flight. Therefore, bellmouth inlets are typically used on helicopters, some slow moving aircraft, and on engines being run in ground test stands. A typical bellmouth inlet is short in length and has rounded shoulders offering very little air resistance.
					</p>
				</section>

				<!-- Compressor Section -->
				<section class="content-section">
					<h3 class="section-heading">COMPRESSOR SECTION</h3>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_3.png" alt="Compressor Section" class="center-image" />
					</div>
					<p class="content-text">
						The second major section and also a part of the cold section of a gas turbine engine is the compressor. It is the component that forces air into the engine. Its main objective is to supply compressed air for combustion in the combustion chamber.
					</p>
					<div class="info-box">
						<h5>Compressor Pressure Ratio</h5>
						<p>This ratio is the outlet pressure divided by the inlet pressure. The amount of air passing through the engine is dependent upon three factors:</p>
						<ul>
							<li>The compressor speed (rpm)</li>
							<li>The forward speed of the aircraft</li>
							<li>The density of the ambient (surrounding) air</li>
						</ul>
						<p>To be effective, a modern compressor must increase the intake air pressure 20 to 30 times above the ambient air pressure and move the air at a velocity of 400 to 500 feet per second.</p>
					</div>
				</section>

				<!-- Functions of Compressor -->
				<section class="content-section">
					<h4 class="subsection-heading">Functions of the Compressor Section</h4>
					<div class="info-box">
						<ul>
							<li>Its primary function is to supply air in sufficient quantity to satisfy the requirements of the combustion burners.</li>
							<li>A secondary function of the compressor is to supply bleed air/customer bleed air for various purposes in the engine and aircraft.</li>
							<li>The bleed-air is taken from any of the various pressure stages of the compressor. Bleeding air from the compressor does cause a small but noticeable drop in engine power. Sometimes power loss can be detected by observing the engine pressure ratio (EPR) indicator.</li>
						</ul>
						<p><strong>Bleed air is utilized in a wide variety of ways. Some of the current applications of bleed air are:</strong></p>
						<ol>
							<li>Cabin pressurization, heating, and cooling;</li>
							<li>De-icing and anti-icing equipment;</li>
							<li>Pneumatic starting of engines</li>
						</ol>
					</div>
				</section>

				<!-- Types of Compressor - Centrifugal -->
				<section class="content-section">
					<h4 class="subsection-heading">Types of Compressor</h4>
					<h5 class="detail-heading">Centrifugal Flow Compressor</h5>
					<p class="content-text">
						Sometimes called a radial outflow compressor. This type of compressor is one of the earliest compressor designs and is still used today in some smaller engines and auxiliary power units (APU's). Centrifugal compressors consist of:
					</p>
					<ul class="content-list">
						<li>An Impeller (also called rotor);</li>
						<li>Diffuser;</li>
						<li>And a Manifold</li>
					</ul>
					<p class="content-text">
						Centrifugal compressors have a high pressure rise per stage that can be around 8:1. Generally centrifugal compressors are limited to two stages due to efficiency concerns.
						The Impeller (rotor) consists of a forged disk with integral blades fastened by a splined coupling to a common power shaft. Its function is to take air in and accelerate it outward by centrifugal force.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_5.png" alt="Centrifugal Compressor" class="center-image" />
					</div>
					<p class="content-text">
						Compressors having only one impeller are referred to as single-stage compressors while compressors having two impellers are referred to as double-stage compressors.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_6.png" alt="Single and Double Stage Compressors" class="center-image" />
					</div>
				</section>

				<!-- Double Entry Impeller -->
				<section class="content-section">
					<h5 class="detail-heading">Double sided / Double Entry Impeller</h5>
					<p class="content-text">
						When two impellers are mounted back-to-back, a double-sided or double-entry impeller is created. A single-stage, double-sided impeller allows a higher mass airflow than that of a similar sized single-stage, single-sided impeller. Therefore, engines with double-sided impellers typically has a smaller overall diameter.
					</p>
					<h5 class="detail-heading">Process of Compression</h5>
					<p class="content-text">
						Once through the impeller, the air is expelled into a divergent duct called a diffuser. The diffuser acts as a divergent duct where the air spreads out, slows down, and increases in static pressure. This prepares the air for entry into the flame burning area of the combustion section at a lower velocity so that the flame of combustion can burn continuously. If the air passed through the flame area at a high velocity, it could extinguish the flame.
					</p>
					<p class="content-text">
						The compressor manifold distributes the air in a smooth flow to the combustion section. The compressor manifold diverts the flow of air from the diffuser, which is an integral part of the manifold, into the combustion chambers. The manifold has one outlet port for each chamber so that the air is evenly divided.
					</p>
				</section>

				<!-- Centrifugal Compressor Advantages/Disadvantages -->
				<section class="content-section">
					<h5 class="detail-heading">CENTRIFUGAL FLOW COMPRESSOR</h5>
					<div class="comparison-box">
						<div class="advantages">
							<h6>ADVANTAGES</h6>
							<ul>
								<li>Simplicity in Manufacture</li>
								<li>Relatively Low Cost</li>
								<li>Low Weight</li>
								<li>Low Starting Power Requirements</li>
								<li>Operating Efficiency over a wide range of rotational speed</li>
							</ul>
						</div>
						<div class="disadvantages">
							<h6>DISADVANTAGES</h6>
							<ul>
								<li>Large frontal area required for a given airflow increases aerodynamic drag.</li>
								<li>Practical limits on the number of stages restrict its usefulness when designing larger and more powerful engines.</li>
							</ul>
						</div>
					</div>
				</section>

				<!-- Axial Flow Compressor -->
				<section class="content-section">
					<h5 class="detail-heading">Axial Flow Compressor</h5>
					<p class="content-text">
						In an axial flow compressor, the airflow is along the horizontal axis of the compressor. An axial flow compressor has two main elements, a rotor and a stator. The task of an axial compressor is to raise air pressure rather than air velocity.
					</p>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_7.1.png" alt="Axial Flow Compressor" class="side-image" />
						<img src="/images/turbofan-module3/img_7.2.png" alt="Axial Compressor Detail" class="side-image" />
					</div>
					<p class="content-text">
						The rotor consists of rows of blades fixed on a rotating spindle. The angle and airfoil contour of the blades forces air rearward in the same manner as a propeller. The rotor blades are usually made of stainless steel with the latter stages being made of titanium. The design of blade attachment to the rotor disk rims varies, but they are commonly fitted into disks by either bulb-type or fir-tree methods, dovetail.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_8.png" alt="Rotor Blade Attachment" class="center-image" />
					</div>
					<p class="content-text">
						Some long fan blades have a mid-span shroud that helps support the blades, making them more resistant to the bending forces created by the airstream. The shrouds, however, do block some of the airflow and create additional aerodynamic drag that reduces fan efficiency. The rotor blades used in an axial flow compressor have an airfoil cross-section with a varying angle of incidence, or twist.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_9.png" alt="Blade Twist" class="center-image" />
					</div>
					<p class="content-text">
						This twist compensates for the blade velocity variation caused by its radius.
					</p>
				</section>

				<!-- Stator Vanes -->
				<section class="content-section">
					<p class="content-text">
						The stator vanes, on the other hand, are arranged in fixed rows between the rows of rotor blades and act as diffusers at each stage, decreasing air velocity and raising pressure. Like rotor blades, stator vanes have an airfoil shape. In addition, the angle of attack of stator vanes can be fixed or variable.
					</p>
					<p class="content-text">
						The set of stator vanes immediately in front of the first stage rotor blades are called inlet guide vanes. These vanes direct the airflow into the first stage rotor blades at the best angle while imparting a swirling motion in the direction of engine rotation. This action improves the aerodynamics of the compressor by reducing the drag on the first stage rotor blades.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_10.png" alt="Stator Vanes" class="center-image" />
					</div>
					<ul class="content-list">
						<li>Stator vanes are normally constructed out of steel or nickel because those metals have high fatigue strength.</li>
						<li>Stator vanes are often shrouded at their tips to minimize vibration tendencies.</li>
					</ul>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_11.png" alt="Shrouded Stator Vanes" class="center-image" />
					</div>
					<ul class="content-list">
						<li>Some axial compressors with high compressor pressure ratios utilize variable inlet guide vanes plus several stages of variable stator vanes.</li>
						<li>These variable inlet guide vanes and stators automatically reposition themselves to maintain proper airflow through the engine under varying operating conditions.</li>
					</ul>
					<p class="content-text">
						The last set of vanes the compressor air passes through is the outlet vane assembly. These vanes straighten the airflow and eliminate any swirling motion or turbulence. The air velocity of the compressed air must be slowed before it enters the combustion chamber. The divergent shape of a diffuser slows compressor discharge while, at the same time, increasing air pressure to its highest value in the engine.
					</p>
				</section>

				<!-- Pressure Stage -->
				<section class="content-section">
					<h5 class="detail-heading">Pressure Stage</h5>
					<ul class="content-list">
						<li>Each consecutive row of rotor blades and stator vanes constitutes a pressure stage.</li>
						<li>The number of stages is determined by the amount of air and total pressure rise required.</li>
						<li>A single stage in an axial flow compressor is capable of producing a compressor pressure ratio of only 1.25:1.</li>
						<li>Therefore, high compressor pressure ratios are obtained by adding more compressor stages. In order to add more compressor stages, multi-spool compressors are created.</li>
					</ul>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_12.png" alt="Pressure Stages" class="center-image" />
					</div>
				</section>

				<!-- Process of Compression -->
				<section class="content-section">
					<h5 class="detail-heading">Process of Compression</h5>
					<ul class="content-list">
						<li>The air from the air inlet is guided by the inlet guide vanes to the rotors and stators.</li>
						<li>Each compressor stage raises the pressure of the incoming air while the air's velocity is alternately increased then decreased as airflow proceeds through the compressor.</li>
						<li>The rotor blades slightly accelerate the airflow then the stator vanes diffuse the air, slowing it and increasing the pressure.</li>
						<li>The overall result is increased air pressure and relatively constant air velocity from compressor inlet to outlet.</li>
						<li>The outlet guide vanes will now guide the compressed air into the diffuser to prepare the air mass for combustion.</li>
						<li>This process will repeat depending on the number of spools the compressor have.</li>
					</ul>
				</section>

				<!-- Multi Spool Compressors -->
				<section class="content-section">
					<h5 class="detail-heading">Multi Spool Compressors</h5>
					<p class="content-text">
						Engine designers devised a way to overcome the limitations of single-spool compressors by splitting the compressor into two or three sections. Each section is connected to a portion of the turbine section by shafts that run coaxially, one within the other.
					</p>
					<h5 class="detail-heading">Dual Spool Compressor</h5>
					<ul class="content-list">
						<li>The front section of a dual-spool compressor is called the low pressure, low speed, or N1 compressor. This low pressure compressor is typically driven by a two-stage turbine at the rear of the turbine section.</li>
						<li>The second compressor section of a twin-spool compressor is called the high pressure, high speed, or N2 compressor and is typically driven by a single stage high-pressure turbine at the front of the turbine section.</li>
					</ul>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_13.png" alt="Dual Spool Compressor" class="center-image" />
					</div>
					<h5 class="detail-heading">Triple Spool Compressor</h5>
					<ul class="content-list">
						<li>In this arrangement the fan is referred to as the low speed, or N1 compressor</li>
						<li>The compressor next in line is called the intermediate, or N2 compressor,</li>
						<li>The innermost compressor is the high pressure, or N3 compressor.</li>
					</ul>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_14.png" alt="Triple Spool Compressor" class="center-image" />
					</div>
				</section>

				<!-- Axial Flow Compressor Advantages/Disadvantages -->
				<section class="content-section">
					<h5 class="detail-heading">AXIAL FLOW COMPRESSOR</h5>
					<div class="comparison-box">
						<div class="advantages">
							<h6>ADVANTAGES</h6>
							<ul>
								<li>High peak efficiencies</li>
								<li>Small frontal area</li>
								<li>Straight through flow, allowing high ram efficiency</li>
								<li>Increased pressure rise by increasing number of stages, with negligible loses</li>
							</ul>
						</div>
						<div class="disadvantages">
							<h6>DISADVANTAGES</h6>
							<ul>
								<li>Good efficiencies over only narrow rotational speed range</li>
								<li>Difficulty of manufacture and high cost</li>
								<li>Relatively high weight</li>
								<li>High starting power requirements</li>
							</ul>
						</div>
					</div>
				</section>

				<!-- Compressor Stall -->
				<section class="content-section">
					<h5 class="detail-heading">Compressor Stall</h5>
					<p class="content-text">
						A compressor blade has an angle of attack, therefore, are subject to the same aerodynamic principles that apply to aircraft wings. A compressor stall occurs when the compressor blades' angle of attack exceeds the critical angle of attack. It can be described as an imbalance between the two vector quantities, inlet velocity, and compressor rotational speed.
					</p>
					<div class="info-box">
						<h5>Causes of Compressor Stall</h5>
						<ul>
							<li>Compressor stalls typically occur when the engine inlet air becomes turbulent or disrupted when an aircraft flies in severe turbulence or performs abrupt flight maneuvers.</li>
							<li>Excessive fuel flow produced by a sudden engine acceleration, accompanied by incompatible engine rpm and airflow combinations.</li>
							<li>Contamination or damage to compressor blades, stator vanes, or turbine components can also cause a compressor stall.</li>
						</ul>
						<p><strong>Hung Stalls:</strong> Hung stalls are severe stalls that can significantly impair engine performance, cause loss of power, and can damage the engine.</p>
					</div>
				</section>

				<!-- Hot Section - Combustion -->
				<section class="content-section">
					<h3 class="section-heading">HOT SECTION</h3>
					<h4 class="subsection-heading">COMBUSTION SECTION</h4>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_4.png" alt="Combustion Section" class="center-image" />
					</div>
					<ul class="content-list">
						<li>A combustion section is typically located directly between the compressor diffuser and turbine section.</li>
						<li>All combustion sections contain the same basic elements: one or more combustion chambers (combustors), a fuel injection system, an ignition source, and a fuel drainage system.</li>
						<li>The primary function of the combustion section is to burn the fuel/air mixture, thereby adding heat energy to the air.</li>
					</ul>
					<div class="info-box">
						<p><strong>Fuel Injection System:</strong> The fuel injection system meters the appropriate amount of fuel through the fuel nozzles into the combustors. Fuel nozzles are located in the combustion chamber case. Fuel is delivered through the nozzles into the liners in a finely atomized spray to ensure thorough mixing with the incoming air.</p>
						<p><strong>Fuel Drainage System:</strong> A fuel drainage system accomplishes the important task of draining the unburned fuel after engine shutdown. In addition, draining the unburned fuel helps to prevent gum deposits in the fuel manifold, nozzles, and combustion chambers, which are caused by fuel residue.</p>
					</div>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_15.png" alt="Combustion Chamber Components" class="center-image" />
					</div>
				</section>

				<!-- Types of Combustion Chambers -->
				<section class="content-section">
					<h5 class="detail-heading">Combustion Chambers (Combustors)</h5>
					<p class="content-text">
						The combustor chambers in a turbine engine are where the fuel and air are mixed and burned. Combustors may vary depending on their type.
					</p>
					<h5 class="detail-heading">Types of Combustion Chambers</h5>
					<h6 class="detail-subheading">Multiple Can Type / Tubular</h6>
					<p class="content-text">
						The multiple-can type combustion chamber consists of a series of individual combustor cans, which act as individual burner units. It is well-suited to centrifugal compressor engines because of the way the compressor discharge air is equally divided at the diffuser.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_16.png" alt="Multiple Can Type Combustor" class="center-image" />
					</div>
					<p class="content-text">
						One of the major advantages of this type of combustor chamber is that multiple combustors can be individually removed for inspection. The individual combustors in a typical multiple-can combustion chamber are interconnected with small flame propagation tubes. The combustion starts in the two cans equipped with igniter plugs; the flame then travels through the tubes and ignites the fuel/air mixture in the other cans. There are 8 or 10 cans in a typical multiple-can combustion section.
					</p>
					<h6 class="detail-subheading">Annular Type or Basket Type Combustor</h6>
					<p class="content-text">
						An annular combustion chamber consists of a housing and a perforated inner liner, or basket. It must be removed as a single unit for repair or replacement. Annular combustors are commonly used in both small and large engines. Normally, the ignition source consists of two spark igniters similar to the type found in multiple-can combustors. In a conventional annular combustor, airflow enters at the front and is discharged at the rear, with primary and secondary airflow much the same as in the multiple-can design.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_17.png" alt="Annular Type Combustor" class="center-image" />
					</div>
					<h6 class="detail-subheading">Can-Annular Type Combustor / Tuboannular</h6>
					<p class="content-text">
						Can-annular combustion sections represent a combination of the multiple-can combustor and the annular type combustor. It was invented by Pratt & Whitney and consists of a removable steel shroud that encircles the entire combustion section. An individual can and liner is removed and installed as one unit for maintenance. This design combines the ease of overhaul and testing of the multiple-can arrangement with the compactness of the annular combustor.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_18.png" alt="Can-Annular Type Combustor" class="center-image" />
					</div>
				</section>

				<!-- Characteristics of Combustion -->
				<section class="content-section">
					<h5 class="detail-heading">Characteristics of a Good Combustion Chamber</h5>
					<ul class="content-list">
						<li>Mix fuel and air effectively in the best ratio for good combustion.</li>
						<li>Burn the mixture as efficiently as possible.</li>
						<li>Cool the hot combustion gases to a temperature the turbine blades can tolerate.</li>
						<li>Distribute hot gases evenly to the turbine section</li>
					</ul>
					<h5 class="detail-heading">Primary and Secondary Air</h5>
					<ul class="content-list">
						<li>In order to allow the combustion section to mix the incoming fuel and air, ignite the mixture, and cool the combustion gases, airflow through a combustor is divided into primary and secondary paths.</li>
						<li>Approximately 25 to 35 percent of the incoming air is designated as primary while 65 to 75 percent becomes secondary.</li>
						<li>Primary, or combustion air, is directed inside the liner in the front end of a combustor. It is used to support the combustion.</li>
						<li>The secondary airflow in the combustion section forms a cooling air blanket on both sides of the liner and centers the combustion flames so they do not contact the liner. It also cools the hot gases before they enter the turbine section.</li>
					</ul>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_19.png" alt="Primary and Secondary Air" class="center-image" />
					</div>
				</section>

				<!-- Flameout -->
				<section class="content-section">
					<h5 class="detail-heading">Flameout</h5>
					<p class="content-text">
						The situation wherein an excessively high velocity airflow could literally blow the flame out of the engine/combustion chamber.
					</p>
					<div class="info-box">
						<h5>Two Types of Flameout</h5>
						<p><strong>Lean Die Out</strong> - usually occurs at high altitude, where low engine speeds and low fuel pressure form a weak flame that can die out in a normal airflow.</p>
						<p><strong>Rich Blow Out</strong> - occurs during rapid engine acceleration when an overly-rich mixture causes the fuel temperature to drop below the combustion temperature or when there is insufficient airflow to support combustion.</p>
					</div>
					<h5 class="detail-heading">Combustion Process</h5>
					<p class="content-text">
						Air from the compressor enters the combustion chamber at high velocity and is slowed down to increase its pressure. A flame tube (combustion liner) controls the air distribution to maintain an air-fuel ratio between 45:1 and 130:1. About 20% of the air enters through the snout into the primary combustion zone, while the rest flows around the flame tube. Additional air passes through secondary holes, creating a recirculation zone that mixes air and fuel for stable combustion. The fuel spray from the nozzle intersects this vortex, enhancing mixing and atomization. Combustion must finish before dilution air enters to avoid cooling and incomplete burning. Ignition starts with an electric spark, after which the flame sustains itself. Fuel is usually delivered as a fine atomized spray through nozzles.
					</p>
				</section>

				<!-- Turbine Section -->
				<section class="content-section">
					<h4 class="subsection-heading">TURBINE SECTION</h4>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_5.png" alt="Turbine Section" class="center-image" />
					</div>
					<p class="content-text">
						A turbine transforms a portion of the kinetic energy in the hot exhaust gases into mechanical energy to drive the compressor and accessories. The turbine section of a turbojet engine is located downstream of the combustion section and consists of four basic elements: a case, a stator, a shroud, and a rotor.
					</p>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_20.1.png" alt="Turbine Components" class="side-image" />
						<img src="/images/turbofan-module3/img_20.2.png" alt="Turbine Assembly" class="side-image" />
					</div>
				</section>

				<!-- Turbine Components -->
				<section class="content-section">
					<h5 class="detail-heading">Case</h5>
					<p class="content-text">
						The turbine casing encloses the turbine rotor and stator assembly, giving either direct or indirect support to the stator elements. A typical case has flanges on both ends that provide a means of attaching the turbine section to the combustion section and the exhaust assembly.
					</p>
					<h5 class="detail-heading">Turbine Stator</h5>
					<p class="content-text">
						A stator element is most commonly referred to as the turbine nozzle, turbine guide vanes, or the nozzle diaphragm. The turbine nozzle is located directly aft of the combustion section and immediately forward of the turbine wheel. It is typically exposed to the highest temperatures. Its purpose is to collect the high-energy airflow from the combustors and direct the flow to strike the turbine rotor at the appropriate angle. The vanes of a turbine nozzle are set at such an angle that they form several converging nozzles that convert some of the exhaust gases' pressure energy to velocity energy. The nozzle vanes must be constructed to allow for thermal expansion.
					</p>
					<h5 class="detail-heading">Turbine Rotor</h5>
					<p class="content-text">
						The rotating elements of a turbine section consist of a shaft and a turbine rotor (wheel).
					</p>
					<ul class="content-list">
						<li>The turbine wheel is a dynamically balanced unit consisting of blades attached to a rotating disk.</li>
						<li>The turbine disk is the anchoring component for the turbine blades and is bolted or welded to the main shaft.</li>
					</ul>
					<p class="content-text">
						As the high-velocity gases pass through the turbine nozzle and impact the turbine blades, the turbine wheel rotates. Many engines use multiple turbine stages, each stage consisting of a turbine nozzle and wheel.
					</p>
					<p class="content-text">
						<strong>Growth or Creep</strong> – it is a phenomenon in which extreme stress on turbine blades may cause the turbine blades to grow in length due to severe centrifugal loads imposed by high rotational speeds.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_21.png" alt="Turbine Rotor" class="center-image" />
					</div>
				</section>

				<!-- Turbine Blades -->
				<section class="content-section">
					<h5 class="detail-heading">Turbine Blades</h5>
					<p class="content-text">
						Turbine blades are airfoil-shaped components designed to extract the maximum amount of energy from the flow of hot gases. Turbine blades fit loosely into a turbine disk when an engine is cold, but expand to fit tightly at normal operating temperatures. The most commonly used method for attaching turbine blades is by fir tree slots cut into the turbine disk rim and matching bases cast or machined into the turbine blade base. It can be classified as impulse blades, reaction blades, and impulse-reaction blades.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_22.png" alt="Turbine Blade Attachment" class="center-image" />
					</div>
					<ul class="content-list">
						<li><strong>Impulse Turbine Blades</strong> – the blades merely change the direction of airflow coming from the turbine nozzle and cause relatively no change in gas pressure or velocity.</li>
						<li><strong>Reaction Turbine Blades</strong> – produce a turning force based on an aerodynamic action. To do this, the turbine blades form a series of converging ducts that increase gas velocity and reduce pressure.</li>
					</ul>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_23.1.png" alt="Impulse Blade" class="side-image" />
						<img src="/images/turbofan-module3/img_23.2.png" alt="Reaction Blade" class="side-image" />
					</div>
					<ul class="content-list">
						<li><strong>Impulse-Reaction Turbine Blades</strong> – a combination of impulse and reaction blades, the workload along the length of the blade is evenly distributed. The blade base is impulse-shaped while the blade tip is reaction-shaped.</li>
					</ul>
					<div class="image-triple">
						<img src="/images/turbofan-module3/img_24.1.png" alt="Impulse-Reaction Blade" class="triple-image" />
						<img src="/images/turbofan-module3/img_24.2.png" alt="Blade Cross Section" class="triple-image" />
						<img src="/images/turbofan-module3/img_24.3.png" alt="Blade Profile" class="triple-image" />
					</div>
				</section>

				<!-- Turbine Cooling -->
				<section class="content-section">
					<h5 class="detail-heading">Shrouded Turbine Blades</h5>
					<p class="content-text">
						Turbine blades can be open or shrouded at their ends. Shroud is attached to the tips of the turbine blades to reduce vibration.
					</p>
					<h5 class="detail-heading">Cooling of the Turbine Section</h5>
					<p class="content-text">
						The most common ways of cooling the components in the turbine section is to use engine bleed air. There are two types of blade cooling: convection cooling/film cooling and transpiration cooling.
					</p>
					<ul class="content-list">
						<li><strong>Convection Cooling/Film Cooling</strong> – compressor bleed air is typically directed in through the hollow blades and out through holes in the tip, leading edge, and trailing edge.</li>
						<li><strong>Transpiration Cooling</strong> – only used on stationary nozzle vanes, bleed air is ducted into the vanes and exits through the porous material.</li>
					</ul>
					<p class="content-text">
						<strong>Active Tip Clearance Control (ACC)</strong> – ACC controls the thermal expansion rate of the turbine case by regulating the flow of cooling air around the turbine case.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_25.png" alt="Turbine Cooling" class="center-image" />
					</div>
					<p class="content-text">
						<strong>Counter-rotating turbines</strong> – are chosen by engine designers for their effectiveness in dampening gyroscopic effects and reducing engine vibration, not for aerodynamic reasons.
					</p>
				</section>

				<!-- Exhaust Section -->
				<section class="content-section">
					<h4 class="subsection-heading">EXHAUST SECTION</h4>
					<div class="image-center">
						<img src="/images/turbofan-module3/3d_img_6.png" alt="Exhaust Section" class="center-image" />
					</div>
					<p class="content-text">
						A typical exhaust section extends from the rear of the turbine section to the point where the exhaust gases leave the engine. It must direct the flow of hot gases rearward in such a manner as to prevent turbulence and, at the same time, impart a high final or exit velocity to the gases. It is comprised of several components including the exhaust cone, exhaust duct or tailpipe, and exhaust nozzle.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_26.png" alt="Exhaust Components" class="center-image" />
					</div>
				</section>

				<!-- Exhaust Components -->
				<section class="content-section">
					<h5 class="detail-heading">Exhaust Cone</h5>
					<p class="content-text">
						A typical exhaust cone assembly consists of an outer duct, or shell, an inner cone, or tail cone, three or more radial hollow struts, and a group of tie rods. Its purpose is to channel and collect turbine discharge gases into a single jet.
					</p>
					<h5 class="detail-heading">Tailpipe</h5>
					<p class="content-text">
						A tailpipe is an extension of the exhaust section that directs exhaust gases safely from the exhaust cone to the exhaust, or jet nozzle. It is used almost exclusively with engines that are installed within an aircraft's fuselage to protect the surrounding airframe.
					</p>
					<h5 class="detail-heading">Exhaust Nozzle</h5>
					<p class="content-text">
						An exhaust, or jet nozzle, provides the exhaust gases with a final boost in velocity. The two types of exhaust nozzle designs used on aircraft are the converging design, and the converging-diverging design.
					</p>
					<ul class="content-list">
						<li><strong>Converging Exhaust Nozzle</strong> – the convergent shape produces a venturi that accelerates the exhaust gases and increases engine thrust.</li>
						<li><strong>Converging-Diverging Nozzle</strong> – the converging portion of the exhaust nozzle accelerates the turbine exhaust gases to supersonic speed at the narrowest part of the duct, then, they are accelerated further in the nozzle's divergent portion, so the exhaust gases exit the nozzle well above the speed of sound.</li>
					</ul>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_27.1.png" alt="Converging Nozzle" class="side-image" />
						<img src="/images/turbofan-module3/img_27.2.png" alt="Converging-Diverging Nozzle" class="side-image" />
					</div>
				</section>

				<!-- Mixer Unit -->
				<section class="content-section">
					<h5 class="detail-heading">Mixer Unit</h5>
					<p class="content-text">
						On fan or bypass type engines, there are two gas streams venting to the atmosphere; high temperature gases are discharged by the turbine and cool air mass moved rearward by the fan section. In a low by-pass engine, the flow of cool and hot air are combined in a mixer unit that ensures mixing of the two streams prior to exiting the engine
					</p>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_28.1.png" alt="Mixer Unit" class="side-image" />
						<img src="/images/turbofan-module3/img_28.2.png" alt="Mixer Configuration" class="side-image" />
					</div>
				</section>

				<!-- Other Exhaust Components -->
				<section class="content-section">
					<h5 class="detail-heading">Variable Geometry Nozzle</h5>
					<p class="content-text">
						An exhaust nozzle opening can have either a fixed or variable area. A variable geometry nozzle is sometimes necessary on engines that utilize an afterburner. It is operated with pneumatic, hydraulic, or electric controls.
					</p>
					<h5 class="detail-heading">Afterburners</h5>
					<p class="content-text">
						Afterburners are used to accelerate the exhaust gases, which in turn, increases thrust. The components that make up an afterburner include the fuel manifold, an ignition source, and a flame holder.
					</p>
					<h5 class="detail-heading">Thrust Reversers</h5>
					<p class="content-text">
						Most turbojet and turbofan-powered aircraft are fitted with thrust reversers to assist in braking. Thrust reversers redirect the flow of exhaust gases to provide thrust in the opposite direction.
					</p>
					<h5 class="detail-heading">Noise Suppressors</h5>
					<p class="content-text">
						Noise suppressors used on the ground include portable devices that can be positioned near the rear of an engine whenever prolonged ground operation is anticipated. Internal noise due to fan, compressor, and turbine blades is also suppressed by the design of the compressor and turbine blades - appropriate spacing between the blades and vanes to reduce wake and turbulence.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_29.png" alt="Noise Suppressors" class="center-image" />
					</div>
				</section>

				<!-- Accessory Section -->
				<section class="content-section">
					<h4 class="subsection-heading">Accessory Section</h4>
					<p class="content-text">
						The accessory section, or accessory drive, of a gas turbine engine is used to power both engine and aircraft accessories such as electric generators, hydraulic pumps, fuel pumps, and oil pumps. Secondary functions include acting as an oil reservoir, or sump, and housing the accessory drive gears and reduction gears.
					</p>
					<p class="content-text">
						Typical places where an accessory drive is located include the engine's midsection, or the front or rear of the engine. The power needed for Accessory drives is typically designed to blend with the engine profile to minimize drag.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_30.png" alt="Accessory Section" class="center-image" />
					</div>
					<p class="content-text">
						A set of beveled gears is used to drive an accessory shaft, which, in turn, drives an accessory gearbox. Since turbine engines operate at a relatively high rpm, reduction gearing is necessary in the accessory drive system to provide appropriate drive speeds for the accessories. In some installations, an intermediate or transfer gearbox is necessary to obtain the appropriate reduction gearing for the accessories.
					</p>
					<div class="image-center">
						<img src="/images/turbofan-module3/img_31.png" alt="Accessory Gearbox" class="center-image" />
					</div>
				</section>

				<!-- Auxiliary Power Units -->
				<section class="content-section">
					<h4 class="subsection-heading">Auxiliary Power Units</h4>
					<p class="content-text">
						The Auxiliary Power Unit (APU) is a constant-speed gas turbine engine. The APU is a self-contained unit, which enables the aircraft to be independent of external pneumatic and electrical power sources. To meet the demands for ground power when the aircraft engines are not running, for example, large amounts of electrical power for passenger amenities such as lighting, entertainment, and food preparation, most large turbine aircraft are equipped with auxiliary power units, or APUs.
					</p>
					<div class="info-box">
						<h5>APU provides:</h5>
						<ul>
							<li>Electrical power for the aircraft systems,</li>
							<li>Bleed air for engine starting and air conditioning on the ground,</li>
							<li>Bleed air for air conditioning/pressurization and wing anti-ice in flight.</li>
						</ul>
					</div>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_32.1.png" alt="APU System" class="side-image" />
						<img src="/images/turbofan-module3/img_32.2.png" alt="APU Installation" class="side-image" />
					</div>
					<div class="image-pair">
						<img src="/images/turbofan-module3/img_33.1.png" alt="APU Components" class="side-image" />
						<img src="/images/turbofan-module3/img_33.2.png" alt="APU Configuration" class="side-image" />
					</div>
				</section>
			</div>
		</div>
	{/if}
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

	/* Main Page Layout */
	.turbofan-page {
		min-height: 100vh;
		padding: 6rem 2rem 4rem;
		max-width: 1400px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.main-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 900;
		color: var(--font-accent-yellow);
		text-align: center;
		margin: 0 0 2rem 0;
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.6);
	}

	.main-description {
		font-family: var(--font-body);
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		color: var(--font-secondary);
		text-align: center;
		line-height: 1.8;
		margin: 0 auto 3rem;
		max-width: 900px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
	}

	/* Tab Buttons */
	.tab-buttons {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.tab-button {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 700;
		padding: 1rem 3rem;
		border-radius: 50px;
		border: 2px solid rgba(135, 206, 235, 0.5);
		background: rgba(10, 47, 53, 0.5);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--font-secondary);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.tab-button:hover {
		background: rgba(28, 62, 74, 0.7);
		border-color: var(--ui-light-blue);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(135, 206, 235, 0.3);
	}

	.tab-button.active {
		background: linear-gradient(135deg, var(--ui-yellow) 0%, #FFE66D 100%);
		color: #000000;
		border-color: var(--ui-yellow);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.5);
		font-weight: 900;
	}

	.tab-button.active:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 10px 30px rgba(255, 217, 102, 0.6);
	}

	/* Overview Content */
	.overview-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}

	.content-box {
		background: rgba(10, 47, 53, 0.5);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 2rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		position: relative;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.content-box:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(135, 206, 235, 0.4);
		border-color: var(--ui-light-blue);
	}

	.content-box.clickable {
		cursor: pointer;
	}

	.content-box.clickable:hover {
		border-color: var(--ui-yellow);
		box-shadow: 0 12px 40px rgba(255, 217, 102, 0.5);
	}

	.engine-box {
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.full-width {
		width: 100%;
		min-height: 500px;
	}

	/* More Info Container - A4 Size Scrollable */
	.more-info-container {
		max-width: 210mm; /* A4 width */
		margin: 0 auto;
		max-height: 297mm; /* A4 height */
		overflow-y: auto;
		padding: 3rem;
	}

	.more-info-content {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.content-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Image Styling */
	.image-pair {
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.side-image {
		width: 48%;
		height: auto;
		border-radius: 1rem;
		border: 2px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease;
		object-fit: contain;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.5rem;
	}

	.side-image:hover {
		transform: scale(1.02);
		border-color: var(--ui-yellow);
		box-shadow: 0 6px 24px rgba(255, 217, 102, 0.4);
	}

	.image-center {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.center-image {
		max-width: 80%;
		height: auto;
		border-radius: 1rem;
		border: 2px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease;
		object-fit: contain;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.5rem;
	}

	.center-image:hover {
		transform: scale(1.02);
		border-color: var(--ui-yellow);
		box-shadow: 0 6px 24px rgba(255, 217, 102, 0.4);
	}

	/* Content Text Styling */
	.content-text {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--font-secondary);
		text-align: justify;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
		margin: 0;
		padding: 1rem;
		background: rgba(10, 47, 53, 0.3);
		border-radius: 0.5rem;
		border-left: 4px solid var(--ui-light-blue);
	}

	/* Custom Scrollbar for More Info Container */
	.more-info-container::-webkit-scrollbar {
		width: 10px;
	}

	.more-info-container::-webkit-scrollbar-track {
		background: rgba(10, 47, 53, 0.5);
		border-radius: 5px;
	}

	.more-info-container::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--ui-light-blue), var(--ui-yellow));
		border-radius: 5px;
		transition: all 0.3s ease;
	}

	.more-info-container::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--ui-yellow), var(--ui-light-blue));
	}

	.zoom-icon {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: rgba(255, 217, 102, 0.9);
		border: 2px solid var(--ui-yellow);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.4);
	}

	.zoom-icon:hover {
		transform: scale(1.1) rotate(10deg);
		background: var(--ui-yellow);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.6);
	}

	.zoom-icon svg {
		color: #000000;
	}

	.box-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 900;
		color: var(--font-accent-yellow);
		margin: 0 0 1.5rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.placeholder-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-height: 400px;
		color: var(--font-secondary);
	}

	.placeholder-content.small {
		min-height: 200px;
	}

	.placeholder-icon {
		font-size: 5rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15px); }
	}

	.placeholder-content p {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--font-accent-cyan);
		margin: 0;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
	}

	.placeholder-text {
		font-family: var(--font-body);
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		text-align: center;
		max-width: 400px;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
	}

	/* Sections Content */
	.sections-content {
		margin-top: 2rem;
		background: rgba(10, 47, 53, 0.5);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 4rem 3rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		min-height: 500px;
	}

	.module-title {
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 3vw, 2.5rem);
		font-weight: 900;
		color: var(--font-accent-yellow);
		text-align: center;
		margin: 0 0 3rem 0;
		line-height: 1.4;
		text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	/* Module 3 Content Styling */
	.module3-content {
		max-width: 210mm; /* A4 width */
		margin: 0 auto;
		max-height: 297mm; /* A4 height */
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	/* Custom Scrollbar for Module 3 */
	.module3-content::-webkit-scrollbar {
		width: 12px;
	}

	.module3-content::-webkit-scrollbar-track {
		background: rgba(10, 47, 53, 0.5);
		border-radius: 6px;
	}

	.module3-content::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--ui-light-blue), var(--ui-yellow));
		border-radius: 6px;
		transition: all 0.3s ease;
	}

	.module3-content::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--ui-yellow), var(--ui-light-blue));
	}

	.content-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		background: rgba(10, 47, 53, 0.3);
		border-radius: 1rem;
		border-left: 4px solid var(--ui-light-blue);
	}

	/* Headings */
	.section-heading {
		font-family: var(--font-heading);
		font-size: 1.8rem;
		font-weight: 900;
		color: var(--font-accent-yellow);
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		border-bottom: 3px solid var(--ui-yellow);
		padding-bottom: 0.5rem;
	}

	.subsection-heading {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--ui-light-blue);
		margin: 1rem 0 0.8rem 0;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.detail-heading {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--font-accent-cyan);
		margin: 0.8rem 0 0.6rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.detail-subheading {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 600;
		color: #FFB347;
		margin: 0.6rem 0 0.5rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
		font-style: italic;
	}

	/* Content Lists */
	.content-list {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0.5rem 0;
		padding-left: 2rem;
		list-style-type: disc;
	}

	.content-list li {
		margin-bottom: 0.5rem;
	}

	/* Info Boxes */
	.info-box {
		background: rgba(135, 206, 235, 0.1);
		border: 2px solid rgba(135, 206, 235, 0.4);
		border-radius: 0.8rem;
		padding: 1.5rem;
		margin: 1rem 0;
	}

	.info-box h5 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--ui-light-blue);
		margin: 0 0 1rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.info-box h6 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--font-accent-cyan);
		margin: 0.8rem 0 0.5rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.info-box p {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0.5rem 0;
	}

	.info-box ul, .info-box ol {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0.5rem 0;
		padding-left: 2rem;
	}

	.info-box li {
		margin-bottom: 0.5rem;
	}

	/* Comparison Box for Advantages/Disadvantages */
	.comparison-box {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 1rem 0;
	}

	.advantages, .disadvantages {
		padding: 1.5rem;
		border-radius: 0.8rem;
	}

	.advantages {
		background: rgba(76, 175, 80, 0.1);
		border: 2px solid rgba(76, 175, 80, 0.4);
	}

	.advantages h6 {
		color: #4CAF50;
	}

	.disadvantages {
		background: rgba(233, 30, 99, 0.1);
		border: 2px solid rgba(233, 30, 99, 0.4);
	}

	.disadvantages h6 {
		color: #E91E63;
	}

	.comparison-box h6 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.comparison-box ul {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0;
		padding-left: 1.5rem;
		list-style-type: none;
	}

	.comparison-box li {
		margin-bottom: 0.8rem;
		padding-left: 1.5rem;
		position: relative;
	}

	.advantages li::before {
		content: "✓";
		position: absolute;
		left: 0;
		color: #4CAF50;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.disadvantages li::before {
		content: "✗";
		position: absolute;
		left: 0;
		color: #E91E63;
		font-weight: bold;
		font-size: 1.2rem;
	}

	/* Image Triple for 3 images side by side */
	.image-triple {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 1rem 0;
	}

	.triple-image {
		width: 32%;
		height: auto;
		border-radius: 0.8rem;
		border: 2px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease;
		object-fit: contain;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.5rem;
	}

	.triple-image:hover {
		transform: scale(1.02);
		border-color: var(--ui-yellow);
		box-shadow: 0 6px 24px rgba(255, 217, 102, 0.4);
	}

	/* Responsive Design */
	@media (max-width: 968px) {
		.tab-buttons {
			flex-direction: column;
			align-items: center;
		}

		.tab-button {
			width: 100%;
			max-width: 300px;
		}
	}

	@media (max-width: 768px) {
		.turbofan-page {
			padding: 5rem 1rem 3rem;
		}

		.main-description {
			padding: 1.5rem;
		}

		.content-box {
			padding: 1.5rem;
		}

		.sections-content {
			padding: 3rem 2rem;
		}

		.placeholder-content {
			min-height: 300px;
		}

		.engine-box {
			min-height: 400px;
		}

		/* More Info Responsive */
		.more-info-container {
			max-width: 100%;
			max-height: 80vh;
			padding: 2rem 1.5rem;
		}

		.image-pair {
			flex-direction: column;
			gap: 1rem;
		}

		.side-image {
			width: 100%;
		}

		.center-image {
			max-width: 100%;
		}

		.content-text {
			font-size: 1rem;
			padding: 0.8rem;
		}

		.more-info-content {
			gap: 2rem;
		}

		.content-section {
			gap: 1rem;
		}

		/* Module 3 Responsive */
		.module3-content {
			max-width: 100%;
			max-height: 80vh;
			padding: 1.5rem;
		}

		.section-heading {
			font-size: 1.5rem;
		}

		.subsection-heading {
			font-size: 1.3rem;
		}

		.detail-heading {
			font-size: 1.15rem;
		}

		.comparison-box {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.image-triple {
			flex-direction: column;
			gap: 1rem;
		}

		.triple-image {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.more-info-container {
			padding: 1.5rem 1rem;
		}

		.content-text {
			font-size: 0.95rem;
		}

		.box-title {
			font-size: 1.2rem;
		}

		/* Module 3 Mobile */
		.module3-content {
			padding: 1rem;
		}

		.content-section {
			padding: 1rem;
		}

		.section-heading {
			font-size: 1.3rem;
		}

		.subsection-heading {
			font-size: 1.15rem;
		}

		.detail-heading {
			font-size: 1.05rem;
		}

		.content-list, .info-box ul, .info-box ol {
			font-size: 0.95rem;
			padding-left: 1.5rem;
		}

		.info-box {
			padding: 1rem;
		}
	}
</style>
