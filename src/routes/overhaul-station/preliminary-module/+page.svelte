<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let mounted = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	let skyCanvas: HTMLCanvasElement;
	let farCloudsCanvas: HTMLCanvasElement;
	let midCloudsCanvas: HTMLCanvasElement;
	let nearCloudsCanvas: HTMLCanvasElement;

	const totalPages = 3;
	
	// Base drift speed
	const BASE_DRIFT_SPEED = 0.61;

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
	
	// Derived state to get current page from URL
	let currentPage = $derived.by(() => {
		const pageParam = $page.url.searchParams.get('page');
		let pageNum = parseInt(pageParam || '1');
		
		// Ensure within valid range
		if (pageNum < 1) pageNum = 1;
		if (pageNum > totalPages) pageNum = totalPages;
		
		return pageNum;
	});

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
				puff.x, puff.y, 0,
				puff.x, puff.y, Math.max(puff.radiusX, puff.radiusY)
			);
			puffGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${boostedAlpha})`);
			puffGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${boostedAlpha * 0.7})`);
			puffGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

			ctx.fillStyle = puffGradient;
			ctx.beginPath();
			ctx.ellipse(puff.x, puff.y, puff.radiusX, puff.radiusY, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.restore();
	}
	
	function goToPage(pageNum: number) {
		if (pageNum >= 1 && pageNum <= totalPages) {
			goto(`/overhaul-station/preliminary-module?page=${pageNum}`);
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			goToPage(currentPage + 1);
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		} else {
			goto('/overhaul-station');
		}
	}
</script>

<!-- Parallax Background System -->
<div class="parallax-background-system">
	<canvas 
		bind:this={skyCanvas} 
		class="parallax-layer sky-layer" 
		width="2560" 
		height="1440"
	></canvas>
	<canvas 
		bind:this={farCloudsCanvas} 
		class="parallax-layer far-clouds-layer" 
		width="2560" 
		height="1440"
	></canvas>
	<canvas 
		bind:this={midCloudsCanvas} 
		class="parallax-layer mid-clouds-layer" 
		width="2560" 
		height="1440"
	></canvas>
	<canvas 
		bind:this={nearCloudsCanvas} 
		class="parallax-layer near-clouds-layer" 
		width="2560" 
		height="1440"
	></canvas>
</div>

<!-- Page Container -->
<div class="page-container">
	<!-- Header Section -->
	<div class="header-section">
		<h1 class="module-title">PRELIMINARY LABORATORY MODULE: GAS TURBINE ENGINE OVERHAUL</h1>
	</div>

	<!-- Content Sections - Page 1: Introduction -->
	{#if currentPage === 1}
	<div class="content-sections">
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">01</span>
				GAS TURBINE ENGINE OVERHAUL
			</h2>
			<div class="section-content">
				<p class="content-text">
					It is most important that the cost of maintaining an engine in service is considered at the design stage. All aspects of engine repairability are also considered, both to reduce the requirement for overhaul or repair and to avoid, where possible, designs which make repairs difficult to effect. Engine construction must allow the operator to complete the overhaul or repair work as quickly and cheaply as possible.
				</p>

				<p class="content-text">
					In service, the engine is inspected at routine periods based on manufacturers' recommendations and agreed between the operator and the relevant airworthiness authority. In the past, most engines had specified numbers of hours they could operate before they needed to be overhauled. This period became known as the time between overhauls (TBO). The length of time between overhauls varies widely with different types of engines. When a new type of engine enters service, its TBO is fairly short, but as condition monitoring, the engine's service record, and inspections prove the engine to be reliable, the TBO is generally extended. Many engines have proven to be so reliable that they are overhauled only when they need major maintenance. This concept is a form of "on condition" maintenance or overhaul.
				</p>

				<p class="content-text">
					Modular construction is a concept that treats an engine as a set of separate modules assembled together. The inspection, line maintenance, and overhaul requirements of each module can be addressed separately. The modular concept reduces down time and expense for operators because maintenance and overhaul activities are spread over a longer period of time. In most cases, replacement of a module is considered to be a minor repair, requiring no FAA Form 337. On the other hand, a form 337 is required for the overhaul of an engine module since it is considered a major repair.
				</p>

				<p class="content-text">
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
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 2: Overhaul Procedures -->
	{#if currentPage === 2}
	<div class="content-sections">
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">02</span>
				OVERHAUL PROCEDURES
			</h2>
			<div class="section-content">
				<p class="content-text">
					Turbine engines are overhauled by the manufacturer or an approved overhaul facility. One reason for this is that there are several specialized tools required during the disassembly, inspection, and reassembly of turbine engines. The process is similar in many ways to the overhaul of piston engines; however, there are processes required which are not necessary for piston engines. In addition, an overhaul facility for gas-turbine engines requires many special tools and some equipment specially designed for work on particular types and models of engines.
				</p>

				<h3 class="subsection-title">DISASSEMBLY</h3>
				<p class="content-text">
					The engine can be disassembled in the vertical or horizontal position. When it is disassembled in the vertical position, the engine is mounted, usually front end downward, on a floor fixture. To enable it to be disassembled horizontally, the engine is mounted in a special turnover stand. The engine is disassembled into main subassemblies or modules, which are fitted in separate stands and sent to other areas where they are further disassembled into individual parts. The individual parts are taken to a cleaning area in preparation for inspection.
				</p>

				<h3 class="subsection-title">CLEANING</h3>
				<p class="content-text">
					Once disassembled, each engine component is cleaned so flaws and defects can be more easily detected. In addition, cleaning is required so that oxide deposits and dirt can be removed from a serviceable part to prepare it for special applications such as plating, anodizing, or painting before it is placed back in service. All engine components are cleaned using approved cleaning methods and agents to prevent unintentional damage. For example, some cleaning solutions may strip plating from a part or cause a reaction with a base metal. As another example, you should refrain from cleaning titanium components with trichlorethylene. The reason for this is that entrapped traces of trichlorethylene can cause corrosion. Some commonly used cleaning methods include washing with organic solvents, vapor degreasing, steam cleaning, and tumbling in a grit solution. An effective cleaning method for hot section components consists of a series of controlled acid or alkali baths and water rinses. Grit blasting may also be useful on either cold or hot section components.
				</p>

				<p class="content-text">
					The cleaning agents used during overhaul range from organic solvents to acid and other chemical cleaners, and extend to electrolytic cleaning solutions. Organic solvents include kerosine for washing, trichloroethane for degreasing and paint stripping solutions which can generally be used on the majority of components for carbon and paint removal. The more restricted and sometimes rigidly controlled acid and other chemical cleaners are used for corrosion, heat scale and carbon removal from certain components. To give the highest degree of cleanliness to achieve the integrity of inspection that is considered necessary on certain major rotating parts, such as turbine discs, electrolytic cleaning solutions are often used. Aircraft which operate at high altitudes can become contaminated with radio-active particles held in the atmosphere, this radio-activity is retained in the dirt and carbon deposits in the engine. If contamination is suspected the radio-activity level of the engine must be determined to ensure the limitations agreed by the health authorities are not exceeded, Evidence of contamination will entail additional cleaning in a designated region, separate from the overhaul area, to safeguard the health of personnel in the workshop. Arrangements have to be made with the health authorities for disposal of the waste radio-active cleaning material.
				</p>

				<h3 class="subsection-title">INSPECTION</h3>
				<p class="content-text">
					After cleaning, and prior to inspection, the surfaces of some parts, e.g. turbine discs, are etched. This process removes a small amount of material from the surface of the part, leaving an even matt finish which reveals surface defects that cannot normally be seen with the naked eye. The metal removal is normally achieved either by an electrolytic process in which the part forms the anode, or by immersing the part for a short time in a special acid bath. Both methods must be carefully controlled to avoid the removal of too much material.
				</p>

				<p class="content-text">
					After the components have been cleaned they are visually and, when necessary, dimensionally inspected to establish general condition and then subjected to crack inspection. This may include binocular and magnetic or penetrant inspection techniques, used either alone or consecutively, depending on the components being inspected and the degree of inspection considered necessary.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_1.png" alt="Typical overhaul workshop layout" />
				</div>

				<h3 class="subsection-title">REPAIRS</h3>
				<p class="content-text">
					To ensure that costs are maintained at the lowest possible level, a wide variety of techniques are used to repair engine parts to make them suitable for further service. Welding, the fitting of interference sleeves or liners, machining and electro-plating are some of the techniques employed during repair. The welding techniques detailed are extensively used and range from welding of cracks by inert gas welding to the renewing of sections of flame tubes and jet pipes by electric resistance welding.
				</p>

				<p class="content-text">
					On some materials now being used for gas turbine engine parts, different techniques may have to be employed. An example of this is the high strength titanium alloys which suffer from brittle welds if they are allowed to become contaminated by oxygen during the cooling period. Parts made in these alloys, which have to withstand high stress loadings in service, are often welded in a bag or plastic dome that is purged by an inert gas before welding commences.
				</p>

				<p class="content-text">
					More advanced materials and constructions may have to be welded by electron-beam welding. This method not only enables dissimilar metals to be welded, but also complete sections of the more advanced fabricated constructions, e.g. a section of a fabricated rotor drum, to be replaced at a low percentage cost of a new drum. Some repair methods, such as welding, may affect the properties of the materials and, to restore the materials to a satisfactory condition, it may be necessary to heat treat the parts to remove the stresses, reduce the hardness of the weld area or restore the strength of the material in the heat affected area, Heat treatment techniques are also used for removing distortions after welding. The parts are heated to a temperature sufficient to remove the stresses and, during the heat treatment process, fixtures are often used to ensure the parts maintain their correct configuration.
				</p>

				<p class="content-text">
					Electro-plating methods are also widely used for repair purposes and these range from chromium plating, which can be used to provide a very hard surface, to thin coatings of copper or silver plating, which can be applied to such areas as bearing locations on a shaft to restore a fitting diameter that is only slightly worn. Many repairs are effected by machining diameters and/or faces to undersize dimensions or bores to oversize dimensions and then fitting shims, liners or metal spraying coatings of wear resistant material. The effected surfaces are then restored to their original dimensions by machining or grinding.
				</p>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 3: Balancing, Assembly, Testing -->
	{#if currentPage === 3}
	<div class="content-sections">
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">03</span>
				BALANCING, ASSEMBLY & TESTING
			</h2>
			<div class="section-content">
				<h3 class="subsection-title">BALANCING</h3>
				<p class="content-text">
					Because of the high rotational speeds, any unbalance in the main rotating assembly of a gas turbine engine is capable of producing vibration and stresses which increase as the square of the rotational speed. Therefore very accurate balancing of the rotating assembly is necessary. The two main methods of measuring and correcting unbalance are single plane (static) balancing and two plane (dynamic) balancing. With single plane, the unbalance is only in one plane i.e., centrally through the component at 90 degrees to the axis. This is appropriate for components such as individual compressor or turbine discs. For compressor and/or turbine rotor assemblies possessing appreciable axial length, unbalance may be present at many positions along the axis. In general it is not possible to correct this combination of distributed unbalance in a single plane. However, if two correction planes are chosen, usually at axially opposed ends of the assembly, it is always possible to find a combination of two unbalance weights which are equivalent for the unbalances present in the assembled rotor, hence two plane balancing.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_2.png" alt="Dynamic balancing diagram" />
				</div>

				<p class="content-text">
					The distribution of unbalance in the rotor has been reduced to an equivalent system of two unbalances 'A' and 'B'. The rotor is already in static balance because in this example 'A' and 'B' are equal and opposed. However, when the part is rotating, each weight produces its own centrifugal force in opposition to the other causing unbalance couples, with the tendency to turn the part end-over-end. This action is restricted by the bearings, with resultant stresses and vibration. It will be seen, therefore, that to bring the part to a state of dynamic balance, an equal amount of weight must be removed at 'A' and 'B' or added at 'P' and 'O'. When the couples set up by the centrifugal forces are equal, it is said that a part is dynamically balanced. Unbalance is expressed in units of ounce-inches, thus one ounce of excess weight displaced two inches from the axis of a rotor is two ounce inches of unbalance.
				</p>

				<p class="content-text">
					A typical dynamic balancing machine for indicating the magnitude and angular position of unbalance in each plane is shown below. Correction of unbalance may be achieved by one or a combination of the following basic methods; redistribution of weight, addition of weight and removal of weight.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_3.png" alt="Dynamic balancing machine" />
				</div>

				<h3 class="subsection-title">ASSEMBLING</h3>
				<p class="content-text">
					The engine can be built in the vertical or horizontal position, using a ram or stand. Assembling of the engine sub-assemblies or modules is done in separate areas, thus minimizing the build time on the build rams or stands.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_4.png" alt="Engine assembly" />
				</div>

				<p class="content-text">
					During assembling, inspection checks are made. These checks can establish dimensions to enable axial and radial clearances to be calculated and adjustments to be made, or they can ascertain that vital fitting operations have been correctly effected. Dimensional checks are effected during disassembly to establish datums which must be repeated on subsequent re-assembly. To ensure that the nuts, bolts and setscrews throughout the engine and its accessories are uniformly tight, controlled torque tightening is applied, the torque loading figure is determined by the thread diameter and the differing coefficients of friction allied with thread finish i.e., silver or cadmium plating and the lubricant used.
				</p>

				<h3 class="subsection-title">TESTING</h3>
				<p class="content-text">
					On completion of assembly, every production and/or overhauled engine must be tested in a 'sea level' test cell i.e. a test cell in which the engine is run at ambient temperature and pressure conditions, the resultant performance figures being corrected to International Standard Atmosphere (I.S.A.) sea-level conditions. To ensure that the engine performance meets that guaranteed to the customer and the requirements of the Government licensing and purchasing authorities, each engine is tested to an acceptance test schedule.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_5.png" alt="Engine testing" />
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Pagination Controls -->
	<div class="pagination-controls">
		<button 
			class="pagination-button prev"
			onclick={prevPage}
			disabled={currentPage === 1 && true}
			aria-label="Previous Page"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
			<span>{currentPage === 1 ? 'Back' : 'Previous'}</span>
		</button>

		<div class="page-numbers">
			{#each Array(totalPages) as _, i}
				<button
					class="page-number"
					class:active={currentPage === i + 1}
					onclick={() => goToPage(i + 1)}
					aria-label={`Go to page ${i + 1}`}
				>
					{i + 1}
				</button>
			{/each}
		</div>

		<button 
			class="pagination-button next"
			onclick={nextPage}
			disabled={currentPage === totalPages}
			aria-label="Next Page"
		>
			<span>Next</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
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
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.9;
	}

	.near-clouds-layer {
		z-index: 4;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		opacity: 0.85;
	}

	.page-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 6rem 2rem 4rem;
		min-height: 100vh;
		position: relative;
		z-index: 1;
	}

	/* Header Section */
	.header-section {
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 3rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.module-title {
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 900;
		color: #0a2f35;
		text-align: center;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 2px;
		line-height: 1.3;
	}

	/* Content Sections */
	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.content-card {
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 3rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 800;
		color: #0a2f35;
		margin: 0 0 2rem 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.section-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #1a5f6f, #0a2f35);
		color: white;
		border-radius: 50%;
		font-size: 1.5rem;
		font-weight: 900;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(26, 95, 111, 0.3);
	}

	.section-content {
		color: #333;
		line-height: 1.8;
	}

	.subsection-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a5f6f;
		margin: 2.5rem 0 1.5rem 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.content-text {
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.8;
		color: #333;
		margin: 1rem 0;
		text-align: justify;
	}

	/* Video Container */
	.video-container {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		margin: 2rem 0;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	/* Image Styling */
	.image-wrapper {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.image-wrapper img {
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.image-wrapper img:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	/* Pagination Controls */
	.pagination-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 3rem;
		padding: 2rem 3rem;
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.1);
		gap: 2rem;
	}

	.pagination-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: #1a5f6f;
		color: white;
		border: none;
		border-radius: 12px;
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(26, 95, 111, 0.3);
	}

	.pagination-button:hover:not(:disabled) {
		background: #0a2f35;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(26, 95, 111, 0.4);
	}

	.pagination-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination-button svg {
		flex-shrink: 0;
	}

	.page-numbers {
		display: flex;
		gap: 0.75rem;
	}

	.page-number {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 2px solid #1a5f6f;
		background: transparent;
		color: #1a5f6f;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.page-number:hover {
		background: rgba(26, 95, 111, 0.1);
		transform: scale(1.1);
	}

	.page-number.active {
		background: #1a5f6f;
		color: white;
		box-shadow: 0 2px 8px rgba(26, 95, 111, 0.4);
		transform: scale(1.1);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-container {
			padding: 5rem 1rem 3rem;
		}

		.header-section,
		.content-card {
			padding: 2rem 1.5rem;
		}

		.module-title {
			font-size: 1.5rem;
		}

		.section-title {
			font-size: 1.5rem;
			flex-direction: column;
			text-align: center;
		}

		.section-number {
			width: 50px;
			height: 50px;
			font-size: 1.3rem;
		}

		.pagination-controls {
			flex-direction: column;
			padding: 1.5rem;
			gap: 1.5rem;
		}

		.pagination-button {
			width: 100%;
			justify-content: center;
		}

		.page-numbers {
			justify-content: center;
		}

		.page-number {
			width: 44px;
			height: 44px;
		}
	}
</style>
