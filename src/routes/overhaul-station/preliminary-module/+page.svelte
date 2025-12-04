<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import ImageModal from '$lib/components/ImageModal.svelte';

	let totalPages = 3;
	$: currentPage = parseInt($page.url.searchParams.get('page') || '1');

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goToPage(pageNum: number) {
		if (pageNum >= 1 && pageNum <= totalPages) {
			goto(`/overhaul-station/preliminary-module?page=${pageNum}`);
			scrollToTop();
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			goToPage(currentPage + 1);
		} else {
			goto('/overhaul-station/assembly-disassembly');
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		} else {
			goto('/overhaul-station');
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			prevPage();
		} else if (event.key === 'ArrowRight') {
			nextPage();
		}

		onMount(() => {
			document.body.classList.add('zone-overhaul');
			return () => document.body.classList.remove('zone-overhaul');
		});
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Page Container -->
<div class="page-container">
	<ImageModal />

	<!-- Header Section -->
	<div class="header-section">
		<h1 class="module-title gradient-animated">PRELIMINARY LABORATORY MODULE: GAS TURBINE ENGINE OVERHAUL</h1>
	</div>

	<!-- Content Sections - Page 1: Introduction -->
	{#if currentPage === 1}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
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
					In service, the engine is inspected at routine periods based on manufacturers' recommendations and agreed between the operator and the relevant airworthiness authority. In the past, most engines had specified numbers of hours they could operate before they needed to be overhauled. This period became known as the <strong>time between overhauls (TBO)</strong>. The length of time between overhauls varies widely with different types of engines. When a new type of engine enters service, its TBO is fairly short, but as condition monitoring, the engine's service record, and inspections prove the engine to be reliable, the TBO is generally extended. Many engines have proven to be so reliable that they are overhauled only when they need major maintenance. This concept is a form of "on condition" maintenance or overhaul.
				</p>

				<p class="content-text">
					<b>Modular construction</b> is a concept that treats an engine as a set of separate modules assembled together. The inspection, line maintenance, and overhaul requirements of each module can be addressed separately. The modular concept reduces down time and expense for operators because maintenance and overhaul activities are spread over a longer period of time. In most cases, replacement of a module is considered to be a minor repair, requiring no FAA Form 337. On the other hand, a form 337 is required for the overhaul of an engine module since it is considered a major repair.
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
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
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
				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_1.png" alt="Typical overhaul workshop layout" />
				</div>
				<p class="content-text">
					After cleaning, and prior to inspection, the surfaces of some parts, e.g. turbine discs, are etched. This process removes a small amount of material from the surface of the part, leaving an even matt finish which reveals surface defects that cannot normally be seen with the naked eye. The metal removal is normally achieved either by an electrolytic process in which the part forms the anode, or by immersing the part for a short time in a special acid bath. Both methods must be carefully controlled to avoid the removal of too much material.
				</p>

				<p class="content-text">
					After the components have been cleaned they are visually and, when necessary, dimensionally inspected to establish general condition and then subjected to crack inspection. This may include binocular and magnetic or penetrant inspection techniques, used either alone or consecutively, depending on the components being inspected and the degree of inspection considered necessary.
				</p>

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
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">03</span>
				BALANCING, ASSEMBLY & TESTING
			</h2>
			<div class="section-content">
				<h3 class="subsection-title">BALANCING</h3>
				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_2.png" alt="Dynamic balancing diagram" />
				</div>
				<p class="content-text">
					Because of the high rotational speeds, any unbalance in the main rotating assembly of a gas turbine engine is capable of producing vibration and stresses which increase as the square of the rotational speed. Therefore very accurate balancing of the rotating assembly is necessary. The two main methods of measuring and correcting unbalance are single plane (static) balancing and two plane (dynamic) balancing. With single plane, the unbalance is only in one plane i.e., centrally through the component at 90 degrees to the axis. This is appropriate for components such as individual compressor or turbine discs. For compressor and/or turbine rotor assemblies possessing appreciable axial length, unbalance may be present at many positions along the axis. In general it is not possible to correct this combination of distributed unbalance in a single plane. However, if two correction planes are chosen, usually at axially opposed ends of the assembly, it is always possible to find a combination of two unbalance weights which are equivalent for the unbalances present in the assembled rotor, hence two plane balancing.
				</p>

				<p class="content-text">
					The distribution of unbalance in the rotor has been reduced to an equivalent system of two unbalances 'A' and 'B'. The rotor is already in static balance because in this example 'A' and 'B' are equal and opposed. However, when the part is rotating, each weight produces its own centrifugal force in opposition to the other causing unbalance couples, with the tendency to turn the part end-over-end. This action is restricted by the bearings, with resultant stresses and vibration. It will be seen, therefore, that to bring the part to a state of dynamic balance, an equal amount of weight must be removed at 'A' and 'B' or added at 'P' and 'O'. When the couples set up by the centrifugal forces are equal, it is said that a part is dynamically balanced. Unbalance is expressed in units of ounce-inches, thus one ounce of excess weight displaced two inches from the axis of a rotor is two ounce inches of unbalance.
				</p>

				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_3.png" alt="Dynamic balancing machine" />
				</div>
				<p class="content-text">
					A typical dynamic balancing machine for indicating the magnitude and angular position of unbalance in each plane is shown below. Correction of unbalance may be achieved by one or a combination of the following basic methods; redistribution of weight, addition of weight and removal of weight.
				</p>

				<h3 class="subsection-title">ASSEMBLING</h3>
				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_4.png" alt="Engine assembly" />
				</div>
				<p class="content-text">
					The engine can be built in the vertical or horizontal position, using a ram or stand. Assembling of the engine sub-assemblies or modules is done in separate areas, thus minimizing the build time on the build rams or stands.
				</p>

				<p class="content-text">
					During assembling, inspection checks are made. These checks can establish dimensions to enable axial and radial clearances to be calculated and adjustments to be made, or they can ascertain that vital fitting operations have been correctly effected. Dimensional checks are effected during disassembly to establish datums which must be repeated on subsequent re-assembly. To ensure that the nuts, bolts and setscrews throughout the engine and its accessories are uniformly tight, controlled torque tightening is applied, the torque loading figure is determined by the thread diameter and the differing coefficients of friction allied with thread finish i.e., silver or cadmium plating and the lubricant used.
				</p>

				<h3 class="subsection-title">TESTING</h3>
				<div class="image-wrapper">
					<img src="/images/overhaul-preliminary/img_5.png" alt="Engine testing" />
				</div>
				<p class="content-text">
					On completion of assembly, every production and/or overhauled engine must be tested in a 'sea level' test cell i.e. a test cell in which the engine is run at ambient temperature and pressure conditions, the resultant performance figures being corrected to International Standard Atmosphere (I.S.A.) sea-level conditions. To ensure that the engine performance meets that guaranteed to the customer and the requirements of the Government licensing and purchasing authorities, each engine is tested to an acceptance test schedule.
				</p>
			</div>
		</section>
	</div>
	{/if}

	<!-- Bottom Navigation -->
	<div class="bottom-nav">
		<button onclick={prevPage} class="nav-link prev">
			<span class="nav-arrow">←</span>
			<span>Previous: {currentPage === 1 ? 'Overhaul Station' : `Page ${currentPage - 1}`}</span>
		</button>

		<!-- Page Numbers -->
		<div class="page-numbers">
			{#each Array(totalPages) as _, i}
				<button
					class="page-number"
					class:active={currentPage === i + 1}
					onclick={() => goToPage(i + 1)}
					aria-label={`Go to page ${i + 1}`}
					aria-current={currentPage === i + 1 ? 'page' : undefined}
				>
					{i + 1}
				</button>
			{/each}
		</div>

		<button onclick={nextPage} class="nav-link next">
			<span>Next: {currentPage === totalPages ? 'Assembly & Disassembly' : `Page ${currentPage + 1}`}</span>
			<span class="nav-arrow">→</span>
		</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: transparent;
		color: var(--font-primary, #E8F4FA);
		font-family: var(--font-body), 'Open Sans', sans-serif;
	}

	.page-container {
		position: relative;
		min-height: 100vh;
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl);
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Header Section */
	.header-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 3rem;
		gap: 1.5rem;
	}

	.module-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		margin: 0;
		background: linear-gradient(
			90deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 50%,
			var(--navbar-accent, var(--ui-yellow)) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
		text-align: center;
		text-transform: uppercase;
		line-height: 1.1;
		animation: gradient-flash var(--gradient-duration) ease-in-out infinite;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	/* Content Sections */
	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-bottom: 4rem;
	}

	.content-card {
		background: transparent;
		border: none;
		border-radius: 0;
		padding: 0;
		box-shadow: none;
		overflow: visible;
	}

	.section-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #FFFFFF;
		background: var(--ui-navy);
		padding: var(--spacing-sm) var(--spacing-xxl) var(--spacing-sm) var(--container-side-padding);
		border: none;
		border-radius: 20px 20px 0 0;
		box-shadow: none;
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		width: fit-content;
		min-width: 40%;
		margin-bottom: -2px;
		z-index: 2;
		clip-path: polygon(0 0, 92% 0, 100% 100%, 0% 100%);
	}

	.section-number {
		display: none;
	}

	.section-content {
		background: #FFFFFF;
		border: 3px solid var(--ui-navy);
		border-radius: 0 30px 30px 30px;
		padding: var(--card-padding);
		color: var(--font-primary);
		position: relative;
		z-index: 1;
		min-height: 300px;
	}

	.section-content::after {
		content: "";
		display: table;
		clear: both;
	}

	.content-text {
		margin: 0 0 1.5rem 0;
		color: var(--font-primary);
		font-size: 1.15rem;
		line-height: 1.9;
		text-align: justify;
	}

	.subsection-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--ui-dark-teal);
		margin: 2rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.3);
		clear: both;
	}

	/* Image Wrapper - Side by Side Layout */
	.image-wrapper {
		float: right;
		width: 45%;
		margin: 0 0 1.5rem 2rem;
		clear: right;
		background: linear-gradient(135deg, rgba(93, 168, 203, 0.06), rgba(135, 206, 235, 0.04));
		border: 3px solid rgba(93, 168, 203, 0.20);
		border-radius: 16px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.image-wrapper:hover {
		border-color: rgba(93, 168, 203, 0.35);
		box-shadow: 0 8px 24px rgba(93, 168, 203, 0.15);
	}

	.image-wrapper img {
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
		clear: both;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	/* Page Controls */
	.page-numbers {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-number {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--font-primary);
		font-weight: 600;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-number:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.page-number.active {
		background: var(--navbar-accent, var(--font-accent-yellow));
		color: var(--ui-navy);
		font-weight: 800;
		transform: scale(1.1);
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 2px solid rgba(93, 168, 203, 0.15);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.8rem 1.5rem;
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(93, 168, 203, 0.18);
		border-radius: 10px;
		color: var(--font-primary);
		font-weight: 600;
		transition: all 0.3s ease;
		width: fit-content;
		min-width: 140px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.nav-link:not(:disabled):hover {
		border-color: var(--overhaul-accent);
		/* Keep background unchanged; set accent glow */
		box-shadow: 0 6px 30px rgba(var(--overhaul-accent-rgb, 93, 168, 203), 0.25), 0 0 18px rgba(var(--overhaul-accent-rgb, 93, 168, 203), 0.18) inset;
		transform: translateY(-2px);
	}

	.nav-link:hover .nav-arrow {
		color: var(--overhaul-accent);
	}

	.nav-link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.nav-link.prev {
		justify-self: start;
	}

	.nav-link.next {
		justify-self: end;
	}

	.nav-arrow {
		font-size: 1.25rem;
		color: var(--overhaul-accent);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.image-wrapper {
			float: none;
			width: 100%;
			margin: 2rem 0;
		}
	}

	@media (max-width: 768px) {
		.header-section {
			flex-direction: column;
			align-items: flex-start;
		}

		.section-title {
			font-size: 1.25rem;
			padding: var(--spacing-sm) var(--spacing-sm);
			gap: 0.8rem;
		}

		.bottom-nav {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.nav-link.prev, .nav-link.next {
			justify-self: center;
			width: 100%;
		}
	}
</style>
