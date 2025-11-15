<script lang="ts">
	import { onMount } from 'svelte';

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let driftOffset = $state(0);
	let animationFrameId: number;

	// Modal states
	let showPreliminaryModal = $state(false);
	let showComingSoonModal = $state(false);

	onMount(() => {
		mounted = true;

		// Generate sky and cloud layers
		generateSkyLayer();
		generateFarClouds();
		generateMidClouds();
		generateNearClouds();

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				showPreliminaryModal = false;
				showComingSoonModal = false;
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('keydown', handleKeyDown);

		// Continuous drift animation
		const animate = () => {
			driftOffset += 0.1;
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('keydown', handleKeyDown);
			cancelAnimationFrame(animationFrameId);
		};
	});

	// Generate morning sky gradient with sun
	function generateSkyLayer() {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;

		const width = skyCanvas.width;
		const height = skyCanvas.height;

		ctx.clearRect(0, 0, width, height);

		// Morning sky colors
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, '#87CEEB');      // Sky blue at top
		gradient.addColorStop(0.4, '#B0E0E6');    // Powder blue
		gradient.addColorStop(0.7, '#FFE4B5');    // Moccasin
		gradient.addColorStop(1, '#FFDAB9');      // Peach puff at bottom

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Add morning sun (positioned upper right)
		const sunX = width * 0.8; // Right side
		const sunY = height * 0.25;  // Upper position
		const sunRadius = 70;

		// Sun glow
		const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 4);
		sunGlow.addColorStop(0, 'rgba(255, 255, 100, 0.5)');
		sunGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.3)');
		sunGlow.addColorStop(1, 'rgba(255, 200, 100, 0)');
		ctx.fillStyle = sunGlow;
		ctx.fillRect(sunX - sunRadius * 4, sunY - sunRadius * 4, sunRadius * 8, sunRadius * 8);

		// Sun body
		const sunGradient = ctx.createRadialGradient(sunX - 10, sunY - 10, 10, sunX, sunY, sunRadius);
		sunGradient.addColorStop(0, '#FFFACD');
		sunGradient.addColorStop(0.5, '#FFD700');
		sunGradient.addColorStop(1, '#FFA500');
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

		const cloudCount = 15;
		const spacing = width / cloudCount;
		
		for (let i = 0; i < cloudCount; i++) {
			drawAnimeCloud(
				ctx,
				i * spacing + Math.random() * spacing * 0.5,
				Math.random() * height * 0.4,
				100 + Math.random() * 60,
				35 + Math.random() * 25,
				'rgba(255, 255, 255, 0.5)',
				6
			);
		}
	}

	function generateMidClouds() {
		if (!midCloudsCanvas) return;
		const ctx = midCloudsCanvas.getContext('2d');
		if (!ctx) return;

		const width = midCloudsCanvas.width;
		const height = midCloudsCanvas.height;

		ctx.clearRect(0, 0, width, height);

		const clouds = [
			{ x: width * 0.1, y: height * 0.3, w: 180, h: 65, color: 'rgba(255, 255, 255, 0.7)' },
			{ x: width * 0.4, y: height * 0.2, w: 220, h: 75, color: 'rgba(255, 255, 255, 0.75)' },
			{ x: width * 0.65, y: height * 0.35, w: 200, h: 70, color: 'rgba(255, 255, 255, 0.7)' },
			{ x: width * 0.85, y: height * 0.25, w: 190, h: 68, color: 'rgba(255, 255, 255, 0.72)' }
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, 4);
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
			{ x: width * 0.2, y: height * 0.45, w: 280, h: 95, color: 'rgba(255, 255, 255, 0.85)' },
			{ x: width * 0.55, y: height * 0.4, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.88)' },
			{ x: width * 0.85, y: height * 0.5, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.83)' }
		];

		clouds.forEach(cloud => {
			drawAnimeCloud(ctx, cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, 2);
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

	function getParallaxStyle(layer: 'far' | 'mid' | 'near') {
		if (!mounted) return '';

		const speeds = {
			far: 0.3,
			mid: 0.7,
			near: 1.2
		};

		const speed = speeds[layer];
		const canvasWidth = 3200;

		const drift = (driftOffset * speed) % canvasWidth;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;
		
		const parallaxMultiplier = {
			far: 15,
			mid: 30,
			near: 50
		};
		
		const multiplier = parallaxMultiplier[layer];
		const cursorOffsetX = -(deltaX / centerX) * multiplier;
		const cursorOffsetY = -(deltaY / centerY) * multiplier * 0.5;

		return `transform: translate3d(${drift + cursorOffsetX}px, ${cursorOffsetY}px, 0);`;
	}

	function openPreliminaryModal() {
		showPreliminaryModal = true;
	}

	function closePreliminaryModal() {
		showPreliminaryModal = false;
	}

	function openComingSoonModal() {
		showComingSoonModal = true;
	}

	function closeComingSoonModal() {
		showComingSoonModal = false;
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
			onclick={openPreliminaryModal}
			onkeydown={(e) => e.key === 'Enter' && openPreliminaryModal()}
		>
			<div class="container-icon">📚</div>
			<h2 class="container-title">Preliminary Laboratory Module</h2>
			<p class="container-description">
				This module familiarizes students with the key steps of gas turbine engine overhaul—disassembly, inspection, repair, and testing—emphasizing efficiency, reliability, and hands-on maintenance skills.
			</p>
			<div class="click-hint">Click to explore →</div>
		</div>

		<!-- Container 2: Assembly and Disassembly Activity -->
		<div 
			class="module-container clickable"
			role="button"
			tabindex="0"
			onclick={openComingSoonModal}
			onkeydown={(e) => e.key === 'Enter' && openComingSoonModal()}
		>
			<div class="container-icon">🔧</div>
			<h2 class="container-title">Assembly and Disassembly Activity</h2>
			<p class="container-description">
				Students gain hands-on experience in taking apart and reassembling the main components of a turbofan engine, developing practical skills, precision, and a deeper understanding of how each part works together.
			</p>
			<div class="click-hint">Click to explore →</div>
		</div>
	</div>
</div>

<!-- Preliminary Laboratory Modal -->
{#if showPreliminaryModal}
	<div class="modal-overlay" onclick={closePreliminaryModal}>
		<div class="modal-content a4-container" onclick={(e) => e.stopPropagation()}>
			<button class="close-button" onclick={closePreliminaryModal}>×</button>
			<div class="modal-scroll-content">
				<h1 class="modal-main-title">PRELIMINARY LABORATORY MODULE</h1>
				<h2 class="modal-section-title">GAS TURBINE ENGINE OVERHAUL</h2>

				<p class="modal-text">
					It is most important that the cost of maintaining an engine in service is considered at the design stage. All aspects of engine repairability are also considered, both to reduce the requirement for overhaul or repair and to avoid, where possible, designs which make repairs difficult to effect. Engine construction must allow the operator to complete the overhaul or repair work as quickly and cheaply as possible.
				</p>

				<p class="modal-text">
					In service, the engine is inspected at routine periods based on manufacturers' recommendations and agreed between the operator and the relevant airworthiness authority. In the past, most engines had specified numbers of hours they could operate before they needed to be overhauled. This period became known as the time between overhauls (TBO). The length of time between overhauls varies widely with different types of engines. When a new type of engine enters service, its TBO is fairly short, but as condition monitoring, the engine's service record, and inspections prove the engine to be reliable, the TBO is generally extended. Many engines have proven to be so reliable that they are overhauled only when they need major maintenance. This concept is a form of "on condition" maintenance or overhaul.
				</p>

				<p class="modal-text">
					Modular construction is a concept that treats an engine as a set of separate modules assembled together. The inspection, line maintenance, and overhaul requirements of each module can be addressed separately. The modular concept reduces down time and expense for operators because maintenance and overhaul activities are spread over a longer period of time. In most cases, replacement of a module is considered to be a minor repair, requiring no FAA Form 337. On the other hand, a form 337 is required for the overhaul of an engine module since it is considered a major repair.
				</p>

				<p class="modal-text">
					The length of time between overhauls varies considerably between different engine types, being established as a result of discussions between the operator, the airworthiness authority and the manufacturer, when such considerations as the total experience gained with the particular engine series, the type of operation, the utilization, and sometimes climatic conditions, are taken into account. In improving the overhaul period the airworthiness authority may take into consideration the background of the operator, his servicing facilities and the experience of his maintenance personnel.
				</p>

				<!-- YouTube Video -->
				<div class="video-container">
					<iframe 
						src="https://www.youtube.com/embed/hQri0heCepA" 
						title="Gas Turbine Engine Overhaul" 
						frameborder="0" 
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
						allowfullscreen
					></iframe>
				</div>

				<h2 class="modal-section-title">OVERHAUL PROCEDURES</h2>
				<p class="modal-text">
					Turbine engines are overhauled by the manufacturer or an approved overhaul facility. One reason for this is that there are several specialized tools required during the disassembly, inspection, and reassembly of turbine engines. The process is similar in many ways to the overhaul of piston engines; however, there are processes required which are not necessary for piston engines. In addition, an overhaul facility for gas-turbine engines requires many special tools and some equipment specially designed for work on particular types and models of engines.
				</p>

				<h3 class="modal-subsection-title">DISASSEMBLY</h3>
				<p class="modal-text">
					The engine can be disassembled in the vertical or horizontal position. When it is disassembled in the vertical position, the engine is mounted, usually front end downward, on a floor fixture. To enable it to be disassembled horizontally, the engine is mounted in a special turnover stand. The engine is disassembled into main subassemblies or modules, which are fitted in separate stands and sent to other areas where they are further disassembled into individual parts. The individual parts are taken to a cleaning area in preparation for inspection.
				</p>

				<h3 class="modal-subsection-title">CLEANING</h3>
				<p class="modal-text">
					Once disassembled, each engine component is cleaned so flaws and defects can be more easily detected. In addition, cleaning is required so that oxide deposits and dirt can be removed from a serviceable part to prepare it for special applications such as plating, anodizing, or painting before it is placed back in service. All engine components are cleaned using approved cleaning methods and agents to prevent unintentional damage. For example, some cleaning solutions may strip plating from a part or cause a reaction with a base metal. As another example, you should refrain from cleaning titanium components with trichlorethylene. The reason for this is that entrapped traces of trichlorethylene can cause corrosion. Some commonly used cleaning methods include washing with organic solvents, vapor degreasing, steam cleaning, and tumbling in a grit solution. An effective cleaning method for hot section components consists of a series of controlled acid or alkali baths and water rinses. Grit blasting may also be useful on either cold or hot section components.
				</p>

				<p class="modal-text">
					The cleaning agents used during overhaul range from organic solvents to acid and other chemical cleaners, and extend to electrolytic cleaning solutions. Organic solvents include kerosine for washing, trichloroethane for degreasing and paint stripping solutions which can generally be used on the majority of components for carbon and paint removal. The more restricted and sometimes rigidly controlled acid and other chemical cleaners are used for corrosion, heat scale and carbon removal from certain components. To give the highest degree of cleanliness to achieve the integrity of inspection that is considered necessary on certain major rotating parts, such as turbine discs, electrolytic cleaning solutions are often used. Aircraft which operate at high altitudes can become contaminated with radio-active particles held in the atmosphere, this radio-activity is retained in the dirt and carbon deposits in the engine. If contamination is suspected the radio-activity level of the engine must be determined to ensure the limitations agreed by the health authorities are not exceeded, Evidence of contamination will entail additional cleaning in a designated region, separate from the overhaul area, to safeguard the health of personnel in the workshop. Arrangements have to be made with the health authorities for disposal of the waste radio-active cleaning material.
				</p>

				<h3 class="modal-subsection-title">INSPECTION</h3>
				<p class="modal-text">
					After cleaning, and prior to inspection, the surfaces of some parts, e.g. turbine discs, are etched. This process removes a small amount of material from the surface of the part, leaving an even matt finish which reveals surface defects that cannot normally be seen with the naked eye. The metal removal is normally achieved either by an electrolytic process in which the part forms the anode, or by immersing the part for a short time in a special acid bath. Both methods must be carefully controlled to avoid the removal of too much material.
				</p>

				<p class="modal-text">
					After the components have been cleaned they are visually and, when necessary, dimensionally inspected to establish general condition and then subjected to crack inspection. This may include binocular and magnetic or penetrant inspection techniques, used either alone or consecutively, depending on the components being inspected and the degree of inspection considered necessary.
				</p>

				<div class="image-center">
					<img src="/images/overhaul-preliminary/img_1.png" alt="Typical overhaul workshop layout" class="modal-image" />
					<p class="image-caption">Typical overhaul workshop layout</p>
				</div>

				<h3 class="modal-subsection-title">REPAIRS</h3>
				<p class="modal-text">
					To ensure that costs are maintained at the lowest possible level, a wide variety of techniques are used to repair engine parts to make them suitable for further service. Welding, the fitting of interference sleeves or liners, machining and electro-plating are some of the techniques employed during repair. The welding techniques detailed are extensively used and range from welding of cracks by inert gas welding to the renewing of sections of flame tubes and jet pipes by electric resistance welding.
				</p>

				<p class="modal-text">
					On some materials now being used for gas turbine engine parts, different techniques may have to be employed. An example of this is the high strength titanium alloys which suffer from brittle welds if they are allowed to become contaminated by oxygen during the cooling period. Parts made in these alloys, which have to withstand high stress loadings in service, are often welded in a bag or plastic dome that is purged by an inert gas before welding commences.
				</p>

				<p class="modal-text">
					More advanced materials and constructions may have to be welded by electron-beam welding. This method not only enables dissimilar metals to be welded, but also complete sections of the more advanced fabricated constructions, e.g. a section of a fabricated rotor drum, to be replaced at a low percentage cost of a new drum. Some repair methods, such as welding, may affect the properties of the materials and, to restore the materials to a satisfactory condition, it may be necessary to heat treat the parts to remove the stresses, reduce the hardness of the weld area or restore the strength of the material in the heat affected area, Heat treatment techniques are also used for removing distortions after welding. The parts are heated to a temperature sufficient to remove the stresses and, during the heat treatment process, fixtures are often used to ensure the parts maintain their correct configuration.
				</p>

				<p class="modal-text">
					Electro-plating methods are also widely used for repair purposes and these range from chromium plating, which can be used to provide a very hard surface, to thin coatings of copper or silver plating, which can be applied to such areas as bearing locations on a shaft to restore a fitting diameter that is only slightly worn. Many repairs are effected by machining diameters and/or faces to undersize dimensions or bores to oversize dimensions and then fitting shims, liners or metal spraying coatings of wear resistant material. The effected surfaces are then restored to their original dimensions by machining or grinding.
				</p>

				<h3 class="modal-subsection-title">BALANCING</h3>
				<p class="modal-text">
					Because of the high rotational speeds, any unbalance in the main rotating assembly of a gas turbine engine is capable of producing vibration and stresses which increase as the square of the rotational speed. Therefore very accurate balancing of the rotating assembly is necessary. The two main methods of measuring and correcting unbalance are single plane (static) balancing and two plane (dynamic) balancing. With single plane, the unbalance is only in one plane i.e., centrally through the component at 90 degrees to the axis. This is appropriate for components such as individual compressor or turbine discs. For compressor and/or turbine rotor assemblies possessing appreciable axial length, unbalance may be present at many positions along the axis. In general it is not possible to correct this combination of distributed unbalance in a single plane. However, if two correction planes are chosen, usually at axially opposed ends of the assembly, it is always possible to find a combination of two unbalance weights which are equivalent for the unbalances present in the assembled rotor, hence two plane balancing.
				</p>

				<div class="image-center">
					<img src="/images/overhaul-preliminary/img_2.png" alt="Dynamic balancing diagram" class="modal-image" />
					<p class="image-caption">The distribution of unbalance in the rotor</p>
				</div>

				<p class="modal-text">
					The distribution of unbalance in the rotor has been reduced to an equivalent system of two unbalances 'A' and 'B'. The rotor is already in static balance because in this example 'A' and 'B' are equal and opposed. However, when the part is rotating, each weight produces its own centrifugal force in opposition to the other causing unbalance couples, with the tendency to turn the part end-over-end. This action is restricted by the bearings, with resultant stresses and vibration. It will be seen, therefore, that to bring the part to a state of dynamic balance, an equal amount of weight must be removed at 'A' and 'B' or added at 'P' and 'O'. When the couples set up by the centrifugal forces are equal, it is said that a part is dynamically balanced. Unbalance is expressed in units of ounce-inches, thus one ounce of excess weight displaced two inches from the axis of a rotor is two ounce inches of unbalance.
				</p>

				<p class="modal-text">
					A typical dynamic balancing machine for indicating the magnitude and angular position of unbalance in each plane is shown below. Correction of unbalance may be achieved by one or a combination of the following basic methods; redistribution of weight, addition of weight and removal of weight.
				</p>

				<div class="image-center">
					<img src="/images/overhaul-preliminary/img_3.png" alt="Dynamic balancing machine" class="modal-image" />
					<p class="image-caption">Dynamic balancing machine</p>
				</div>

				<h3 class="modal-subsection-title">ASSEMBLING</h3>
				<p class="modal-text">
					The engine can be built in the vertical or horizontal position, using a ram or stand. Assembling of the engine sub-assemblies or modules is done in separate areas, thus minimizing the build time on the build rams or stands.
				</p>

				<div class="image-center">
					<img src="/images/overhaul-preliminary/img_4.png" alt="Engine assembly" class="modal-image" />
					<p class="image-caption">Engine assembly process</p>
				</div>

				<p class="modal-text">
					During assembling, inspection checks are made. These checks can establish dimensions to enable axial and radial clearances to be calculated and adjustments to be made, or they can ascertain that vital fitting operations have been correctly effected. Dimensional checks are effected during disassembly to establish datums which must be repeated on subsequent re-assembly. To ensure that the nuts, bolts and setscrews throughout the engine and its accessories are uniformly tight, controlled torque tightening is applied, the torque loading figure is determined by the thread diameter and the differing coefficients of friction allied with thread finish i.e., silver or cadmium plating and the lubricant used.
				</p>

				<h3 class="modal-subsection-title">TESTING</h3>
				<p class="modal-text">
					On completion of assembly, every production and/or overhauled engine must be tested in a 'sea level' test cell i.e. a test cell in which the engine is run at ambient temperature and pressure conditions, the resultant performance figures being corrected to International Standard Atmosphere (I.S.A.) sea-level conditions. To ensure that the engine performance meets that guaranteed to the customer and the requirements of the Government licensing and purchasing authorities, each engine is tested to an acceptance test schedule.
				</p>

				<div class="image-center">
					<img src="/images/overhaul-preliminary/img_5.png" alt="Engine testing" class="modal-image" />
					<p class="image-caption">Engine testing facility</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Coming Soon Modal -->
{#if showComingSoonModal}
	<div class="modal-overlay" onclick={closeComingSoonModal}>
		<div class="modal-content coming-soon-modal" onclick={(e) => e.stopPropagation()}>
			<button class="close-button" onclick={closeComingSoonModal}>×</button>
			<div class="coming-soon-content">
				<div class="coming-soon-icon">🚧</div>
				<h2 class="coming-soon-title">Coming Soon</h2>
				<p class="coming-soon-text">
					The Assembly and Disassembly Activity module is currently under development. 
					Stay tuned for an immersive hands-on experience with turbofan engine components!
				</p>
			</div>
		</div>
	</div>
{/if}

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
		margin: 0 auto 4rem;
		max-width: 900px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
	}

	/* Containers Grid */
	.containers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		margin-top: 3rem;
	}

	.module-container {
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 3rem 2.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
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

	.container-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.container-title {
		font-family: var(--font-heading);
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--font-accent-yellow);
		margin: 0 0 1.5rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.container-description {
		font-family: var(--font-body);
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0 0 2rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.click-hint {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 700;
		color: var(--ui-light-blue);
		text-align: right;
		margin-top: auto;
		opacity: 0.8;
		transition: all 0.3s ease;
	}

	.module-container:hover .click-hint {
		opacity: 1;
		color: var(--ui-yellow);
		transform: translateX(5px);
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background: rgba(10, 47, 53, 0.95);
		border-radius: 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.5);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
		position: relative;
		animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slideUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* A4 Container for Reading Mode */
	.a4-container {
		width: 210mm;
		max-width: 95vw;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.modal-scroll-content {
		overflow-y: auto;
		padding: 3rem;
		flex: 1;
	}

	/* Custom Scrollbar */
	.modal-scroll-content::-webkit-scrollbar {
		width: 10px;
	}

	.modal-scroll-content::-webkit-scrollbar-track {
		background: rgba(10, 47, 53, 0.5);
		border-radius: 5px;
	}

	.modal-scroll-content::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, var(--ui-light-blue), var(--ui-yellow));
		border-radius: 5px;
	}

	.modal-scroll-content::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, var(--ui-yellow), var(--ui-light-blue));
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 60, 60, 0.9);
		border: 2px solid rgba(255, 255, 255, 0.3);
		color: white;
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		line-height: 1;
		padding: 0;
	}

	.close-button:hover {
		background: rgba(255, 30, 30, 1);
		transform: rotate(90deg) scale(1.1);
	}

	/* Modal Content Styles */
	.modal-main-title {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 900;
		color: var(--font-accent-yellow);
		text-align: center;
		margin: 0 0 2rem 0;
		text-transform: uppercase;
		letter-spacing: 2px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
	}

	.modal-section-title {
		font-family: var(--font-heading);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--ui-light-blue);
		margin: 2.5rem 0 1.5rem 0;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
		border-bottom: 3px solid var(--ui-light-blue);
		padding-bottom: 0.5rem;
	}

	.modal-subsection-title {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--font-accent-cyan);
		margin: 2rem 0 1rem 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.modal-text {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 1rem 0;
		text-align: justify;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.video-container {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		margin: 2rem 0;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	.image-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 2rem 0;
	}

	.modal-image {
		max-width: 100%;
		height: auto;
		border-radius: 1rem;
		border: 2px solid rgba(135, 206, 235, 0.4);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		margin-bottom: 0.5rem;
	}

	.image-caption {
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-style: italic;
		color: var(--ui-light-blue);
		text-align: center;
		margin: 0.5rem 0 0 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	/* Coming Soon Modal */
	.coming-soon-modal {
		width: 500px;
		max-width: 90vw;
		padding: 4rem 3rem;
	}

	.coming-soon-content {
		text-align: center;
	}

	.coming-soon-icon {
		font-size: 5rem;
		margin-bottom: 2rem;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.coming-soon-title {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 900;
		color: var(--font-accent-yellow);
		margin: 0 0 1.5rem 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
	}

	.coming-soon-text {
		font-family: var(--font-body);
		font-size: 1.2rem;
		line-height: 1.8;
		color: var(--font-secondary);
		margin: 0;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	/* Responsive Design */
	@media (max-width: 968px) {
		.containers-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.a4-container {
			width: 100%;
		}

		.modal-scroll-content {
			padding: 2rem 1.5rem;
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

		.container-icon {
			font-size: 3rem;
		}

		.container-title {
			font-size: 1.5rem;
		}

		.modal-main-title {
			font-size: 1.6rem;
		}

		.modal-section-title {
			font-size: 1.3rem;
		}

		.modal-subsection-title {
			font-size: 1.15rem;
		}

		.modal-text {
			font-size: 1rem;
		}

		.coming-soon-modal {
			padding: 3rem 2rem;
		}

		.coming-soon-title {
			font-size: 2rem;
		}

		.coming-soon-text {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 480px) {
		.modal-scroll-content {
			padding: 1.5rem 1rem;
		}

		.close-button {
			width: 35px;
			height: 35px;
			font-size: 1.5rem;
		}
	}
</style>
