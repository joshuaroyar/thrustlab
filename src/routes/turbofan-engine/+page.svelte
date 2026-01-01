<script lang="ts">
	import { onMount } from 'svelte';
    import ImageGrid from '$lib/components/ImageGrid.svelte';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import ModelViewer from '$lib/components/ModelViewer.svelte';
	import { turbofanPartDescriptions } from '$lib/data/turbofanParts';
	import { searchQuery, showSearchModal, performSearch } from '$lib/stores/searchStore';
	import { MODULE_CONTENT } from '$lib/data/searchContent';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import ImageModal from '$lib/components/ImageModal.svelte';

	let mounted = $state(false);

	// Tab state
	let activeTab = $state<'overview' | 'sections'>('overview');

	// Pagination state for "More About Turbofan Engine" section
	let currentPage = $state(1);
	const totalPages = 2;

	// Pagination state for "Engine Sections" tab
	let currentPageSections = $state(1);
	const totalPagesSections = 5;

	const turbofanParts = turbofanPartDescriptions;

	function handleSearch() {
		if ($searchQuery.trim()) {
			performSearch($searchQuery, MODULE_CONTENT);
			showSearchModal.set(true);
		}
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			scrollToTop();
		} else {
			activeTab = 'sections';
			currentPageSections = 1;
			scrollToTop();
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			scrollToTop();
		} else {
			goto('/hangar-zone/module/types');
		}
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			scrollToTop();
		}
	}

	// Pagination functions for Engine Sections
	function nextPageSections() {
		if (currentPageSections < totalPagesSections) {
			currentPageSections++;
			scrollToTop();
		} else {
			goto('/overhaul-station');
		}
	}

	function prevPageSections() {
		if (currentPageSections > 1) {
			currentPageSections--;
			scrollToTop();
		} else {
			activeTab = 'overview';
			currentPage = totalPages;
			scrollToTop();
		}
	}

	function goToPageSections(page: number) {
		if (page >= 1 && page <= totalPagesSections) {
			currentPageSections = page;
			scrollToTop();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (activeTab === 'overview') {
			if (event.key === 'ArrowLeft') prevPage();
			if (event.key === 'ArrowRight') nextPage();
		} else {
			if (event.key === 'ArrowLeft') prevPageSections();
			if (event.key === 'ArrowRight') nextPageSections();
		}
	}

	onMount(() => {
		mounted = true;
		document.body.classList.add('zone-turbofan');
		
		// Safety: Ensure scrolling is enabled when page loads
		if (typeof document !== 'undefined') {
			document.body.classList.remove('page-transitioning');
			document.body.style.removeProperty('overflow');
			document.documentElement.style.removeProperty('overflow');
			console.log('Turbofan Engine mounted - scroll enabled');
		}
		
		return () => {
			document.body.classList.remove('zone-turbofan');
			// Safety: Ensure scroll remains enabled on cleanup
			if (typeof document !== 'undefined') {
				document.body.style.removeProperty('overflow');
				document.documentElement.style.removeProperty('overflow');
			}
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Main Content -->
<div class="turbofan-page">
	<SearchModal />
	<ImageModal />
	
	<!-- Header Section -->
	<div class="header-section">
		<div class="title-group">
			<h1 class="main-title gradient-animated">Turbofan Engine</h1>
			<p class="main-description">
				Enter the Turbofan Engine Zone, an immersive hub where students can explore a fully rotatable 3D
				turbofan engine in stunning detail. Here, they can interact with each component, uncover the
				inner workings of every section, and gain a clear understanding of how these powerful machines
				drive modern aircraft to the skies.
			</p>
		</div>

		<!-- Search Bar -->
		<div class="search-container">
			<input 
				type="text" 
				placeholder="Search turbofan components..." 
				bind:value={$searchQuery}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				class="search-input"
			/>
			<button onclick={handleSearch} class="search-button" aria-label="Search">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Tab Toggle Buttons -->
	<div class="tab-buttons">
		<button
			class="tab-button {activeTab === 'overview' ? 'active' : ''}"
			onclick={() => (activeTab = 'overview')}
		>
			Overview
		</button>
		<button
			class="tab-button {activeTab === 'sections' ? 'active' : ''}"
			onclick={() => (activeTab = 'sections')}
		>
			Engine Sections
		</button>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'overview'}
		<div class="overview-content" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<!-- 3D Engine Container -->
			<section class="content-card">
				<h2 class="section-title">Learn, Explore and Understand the Turbofan Engine</h2>
				<div class="section-content">
					<div class="model-wrapper" style="width: 100%; height: 450px; position: relative;">
						<ModelViewer
							modelPath="/models/Turbofan.glb"
							partDescriptions={turbofanParts}
							cameraPosition={{ alpha: Math.PI / 2, beta: Math.PI / 2.5, radius: 8 }}
							autoLoad={true}
						/>
						<button
							class="zoom-icon"
							title="View Instructions & Fullscreen"
							onclick={() => goto('/turbofan-engine/engine-instructions')}
						>
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
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
								<line x1="11" y1="8" x2="11" y2="14"></line>
								<line x1="8" y1="11" x2="14" y2="11"></line>
							</svg>
						</button>
					</div>

					<!-- Jaja's Tip -->
					<div class="jaja-tip-container">
						<div class="jaja-avatar">
							<img src="/icons/jaja.png" alt="Jaja" />
						</div>
						<div class="jaja-bubble">
							<div class="jaja-text">
								<MarkdownRenderer content={"**Tip from JAJA:** Click the **zoom** icon to get a closer look!"} />
							</div>
							<div class="zoom-icon-inline" aria-hidden="true">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D35400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Overview & Parameters Container -->
			<section class="content-card">
				<h2 class="section-title">OVERVIEW AND PARAMETERS</h2>
				<div class="section-content">
					<div class="text-content-wrapper">
						<ul class="bullet-list">
							<li>A turbofan engine consists of a multi-bladed ducted propeller driven by a gas turbine engine.</li>
							<li>Turbofans were developed to provide a compromise between the best features of the turbojet and the turboprop.</li>
							<li>Turbofan engines have turbojet-type cruise speed capability yet retain some of the short-field takeoff capability of a turboprop.</li>
						</ul>
					</div>
					<ImageGrid
						images={[
							{ src: '/images/turbofan-overview/1.1.png', alt: 'Pressure Parameter', caption: 'Pressure' },
							{ src: '/images/turbofan-overview/1.2.png', alt: 'Temperature Parameter', caption: 'Temperature' },
							{ src: '/images/turbofan-overview/1.3.png', alt: 'Flow Parameter', caption: 'Flow' }
						]}
						columns={3}
						height="220px"
					/>
				</div>
			</section>

			<!-- More About Turbofan Container with Pagination -->
			<div id="more-info-section" class="more-info-container">
				<!-- Paginated Content -->
				<div class="pagination-content">
					{#if currentPage === 1}
						<div class="page-view">
							<!-- Section 1: Introduction to Turbofans -->
							<section class="content-card">
								<h2 class="section-title">INTRODUCTION TO TURBOFAN ENGINES</h2>
								<div class="section-content">
									<div class="text-content-wrapper">
										<p>
											The airlines' choice. Turbofans are like Turbojets but also have a large fan
											accelerating the air's entry into the engine and adding to the thrust as an
											internal propeller.
										</p>
										<p>
											Engines that have the fan mounted in front of the compressor are called
											forward-fan engines, while turbofan engines that have the fan mounted to the
											turbine section are called aft-fan engines.
										</p>
									</div>
									<ImageGrid
										images={[
											{ src: '/images/turbofan-more-info/img_1.1.png', alt: 'Turbofan Engine Forward Fan' },
											{ src: '/images/turbofan-more-info/img_1.2.png', alt: 'Turbofan Engine Aft Fan' }
										]}
										columns={2}
										height="260px"
									/>
								</div>
							</section>

							<!-- Section 2: Bypass Engine Concept -->
							<section class="content-card">
								<h2 class="section-title">THE BYPASS ENGINE CONCEPT</h2>
								<div class="section-content">
									<div class="text-content-wrapper">
										<p>
											The inlet air that passes through a turbofan engine is usually divided into two
											separate streams of air. One stream passes through the engine core while a
											second stream coaxially bypasses the engine core. It is this bypass stream of
											air that is responsible for the term bypass engine.
										</p>
										<p>
											When discussing bypass engines there are three terms you must be familiar with;
											they are thrust ratio, bypass ratio, and fan pressure ratio. A turbofan engine's
											thrust ratio is a comparison of the thrust produced by the fan to the thrust
											produced by the engine core exhaust. On the other hand, a turbofan's bypass
											ratio refers to the ratio of incoming air that bypasses the core to the amount
											of air that passes through the engine core.
										</p>
									</div>
									<div class="image-wrapper">
										<img src="/images/turbofan-more-info/img_2.png" alt="Turbofan Bypass Engine" />
									</div>
								</div>
							</section>

							<!-- Section 3: Classifications -->
							<section class="content-card">
								<h2 class="section-title">TURBOFAN CLASSIFICATIONS AND RATIOS</h2>
								<div class="section-content">
									<div class="text-content-wrapper">
										<p>
											<strong
												>Turbofans in civil aircraft are generally divided into three classifications
												based on bypass ratio:</strong
											>
										</p>
										<ul class="bullet-list single-column">
											<li>Low bypass (1:1)</li>
											<li>Medium bypass (2:1 or 3:1)</li>
											<li>High bypass (4:1 or greater)</li>
										</ul>
										<p><strong>Key Ratios:</strong></p>
										<ul class="bullet-list">
											<li><strong>Bypass Ratio:</strong> bypass air to engine air</li>
											<li><strong>Thrust Ratio:</strong> fan to engine core exhaust</li>
											<li>
												<strong>Fan Pressure Ratio:</strong> pressure leaving the fan to pressure entering
												the fan
											</li>
										</ul>
									</div>
									<ImageGrid
										images={[
											{ src: '/images/turbofan-more-info/img_3.1.png', alt: 'Turbofan Classifications' },
											{ src: '/images/turbofan-more-info/img_3.2.png', alt: 'Bypass Ratio Types' }
										]}
										columns={2}
										height="260px"
									/>
								</div>
							</section>
						</div>
					{/if}

					{#if currentPage === 2}
						<div class="page-view">
							<!-- Section 4: Detailed Engine View -->
							<section class="content-card">
								<h2 class="section-title">TURBOFAN ENGINE DETAILS AND COMPONENTS</h2>
								<div class="section-content">
									<div class="text-content-wrapper">
										<p>
											The turbofan engine represents a significant advancement in jet propulsion
											technology. By incorporating a large bypass fan at the front of the engine,
											turbofans achieve superior fuel efficiency and reduced noise compared to pure
											turbojets.
										</p>
										<p>
											Modern high-bypass turbofan engines are the standard powerplant for commercial
											aviation, offering the perfect balance of thrust, efficiency, and environmental
											performance. The bypass air not only contributes to thrust but also helps cool
											the engine and reduce exhaust noise.
										</p>
									</div>
									<div class="image-wrapper">
										<img src="/images/turbofan-more-info/img_4.png" alt="Turbofan Engine Details" />
									</div>
								</div>
							</section>
						</div>
					{/if}
				</div>

				<!-- Bottom Navigation -->
				<div class="bottom-nav">
					<button onclick={prevPage} class="nav-link prev">
						<span class="nav-arrow">←</span>
						<span>{currentPage === 1 ? 'Previous: Hangar Zone' : 'Previous'}</span>
					</button>
					
					<div class="page-numbers">
						{#each Array(totalPages) as _, i}
							<button
								class="page-number {currentPage === i + 1 ? 'active' : ''}"
								onclick={() => goToPage(i + 1)}
								aria-label="Go to page {i + 1}"
								aria-current={currentPage === i + 1 ? 'page' : undefined}
							>
								{i + 1}
							</button>
						{/each}
					</div>

					<button onclick={nextPage} class="nav-link next">
						<span>{currentPage === totalPages ? 'Next: Engine Sections' : 'Next'}</span>
						<span class="nav-arrow">→</span>
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div id="engine-sections-tab" class="sections-content" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
			<h2 class="module-title gradient-animated">
				LEARNING MODULE 03:<br />
				SECTIONS OF A GAS TURBINE ENGINE
			</h2>
			
			<!-- Page 1: ENGINE COMPONENTS, COLD SECTION (Air Inlet & Centrifugal Compressor) -->
			{#if currentPageSections === 1}
				<section class="content-card">
					<h2 class="section-title">ENGINE COMPONENTS</h2>
					<div class="section-content">
						<p class="content-text">
							There are <b>5 major sections</b> of the gas turbine engine that are grouped into 2 sections: the <b>hot section</b> and the <b>cold section</b>.
						</p>
						<ul class="bullet-list">
							<li>A turbine engine's hot section includes the combustion, turbine, and exhaust sections. The cold section, on the other hand, includes the air inlet duct and the compressor section.</li>
						</ul>
						<div class="image-wrapper" style="height: 500px; width: 100%;">
							<ModelViewer modelPath="/models/Turbofan (Caseless).glb" autoLoad={true} />
						</div>
						<ImageGrid images={[{ src: '/images/turbofan-module3/3d_img_1.png', alt: '3D VIEW WITHOUT CASING–COLOR CODED PER SECTION', caption: '(3D VIEW WITHOUT CASING–COLOR CODED PER SECTION)' }]} columns={1} height="320px" />
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">COLD SECTION: AIR INLET</h2>
					<div class="section-content">
						<div class="image-wrapper" style="height: 400px; width: 100%;">
							<ModelViewer modelPath="/models/Intake.glb" autoLoad={true} />
						</div>
						<p style="text-align: center; font-style: italic;">(3D SECTIONED VIEW OF AIR INLET ONLY)</p>
						<p class="content-text">
							The air intake of a gas turbine engine is either built into the airframe itself, if
							the engine is mounted in the airframe, or is the forward part of the nacelle
							installation if the engine is wing or rear-fuselage-mounted.
						</p>
						<p class="content-text">
							The air intake is designed to provide a turbulence-free supply of air to the
							first-stage compressor of the engine, with the minimum energy loss occurring through
							the inlet.
						</p>
						<p class="content-text">
							To enable the compressor to operate satisfactorily, the air must reach the compressor at a uniform pressure, distributed evenly across the whole of the face of the first stage.
						</p>
						<p class="content-text">
							The design of the intake duct is therefore vital to the performance of the engine, under all airspeed and angles of attack, to avoid compressor stall or surge to be avoided.
						</p>
						<div class="info-box">
							<h5>Functions of the air inlet:</h5>
							<ul class="bullet-list">
								<li>Recover as much of the total pressure of the free airstream as possible and deliver this pressure to the compressor. This is known as <b>ram recovery</b> or <b>pressure recovery</b>.</li>
								<li>Many inlets are shaped to raise the air pressure above atmospheric pressure.</li>
								<li>Provide a uniform supply of air to the compressor so the compressor can operate efficiently.</li>
							</ul>
						</div>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Types of Air Inlet Ducts</h2>
					<div class="section-content">
						<h5 class="detail-heading">Engine Mounted</h5>
						<p class="content-text">
							Several large commercial aircraft and large military aircraft use wing-mounted engines. In a few cases, such as the DC-10 and L-1011, a combination of wing-mounted and vertical stabilizer-mounted engines is used.
						</p>
						
						<h5 class="detail-heading">Wings Mounted</h5>
						<p class="content-text">
							Some aircraft with engines mounted inside the wings feature air inlet ducts in the wing's leading edge. Aircraft such as the Aerospatiale Caravelle, de Havilland Comet, and de Havilland Vampire all utilize wing-mounted inlets.
						</p>

						<h5 class="detail-heading">Fuselage Mounted</h5>
						<p class="content-text">
							Engines mounted inside a fuselage typically use air inlet ducts located near the front of the fuselage. For example, many early military aircraft were designed with an air inlet duct in the nose of the fuselage.
						</p>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Subsonic Inlets</h2>
					<div class="section-content">
						<p class="content-text">
							A typical subsonic air inlet consists of a fixed geometry duct whose diameter progressively increases from front to back. This divergent shape works like a venturi in that as the intake air spreads out, the velocity of the air decreases and the pressure increases. This added pressure contributes significantly to engine efficiency once the aircraft reaches its design cruising speed.
						</p>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Supersonic Inlets</h2>
					<div class="section-content">
						<p class="content-text">
							On supersonic aircraft a typical air inlet duct has either a fixed or variable geometry whose diameter progressively decreases, then increases from front to back. This convergent-divergent shape is used to slow the incoming airflow to subsonic speed before it reaches the compressor. The supersonic diffuser gradually decreases in area from front to rear which has the effect of reducing the air velocity down to below Mach 1. Further reduction of velocity is achieved by a subsonic diffuser which increases in area towards the compressor face. The control of shock waves that form on the air inlet is also important to correctly decelerate the air through the shock waves. The use of variable geometry intakes allow the correct control of intake shocks and may also comprise spill doors to allow excess air to be spilled from the inlet without having its velocity changed.
						</p>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Bellmouth Inlets</h2>
					<div class="section-content">
						<p class="content-text">
							Bellmouth inlets have a convergent profile that is designed specifically for obtaining very high aerodynamic efficiency when stationary or in slow flight. Therefore, bellmouth inlets are typically used on helicopters, some slow moving aircraft, and on engines being run in ground test stands. A typical bellmouth inlet is short in length and has rounded shoulders offering very little air resistance.
						</p>
					</div>
				</section>
			{/if}

			<!-- Page 2: COMPRESSOR SECTION (Centrifugal & Axial) -->
			{#if currentPageSections === 2}
				<section class="content-card">
					<h2 class="section-title">COMPRESSOR SECTION</h2>
					<div class="section-content">
						<div class="image-wrapper" style="height: 400px; width: 100%;">
							<ModelViewer modelPath="/models/Compression.glb" autoLoad={true} />
						</div>
						<p style="text-align: center; font-style: italic;">(3D SECTIONED VIEW OF COMPRESSOR SECTION ONLY)</p>
						<p class="content-text">
							The second major section and also a part of the cold section of a gas turbine engine
							is the compressor. It is the component that forces air into the engine. Its main
							objective is to supply compressed air for combustion in the combustion chamber.
						</p>
						
						<h5 class="detail-heading">Compressor Pressure Ratio</h5>
						<p class="content-text">This ratio is the <b>outlet pressure divided by the inlet pressure</b>.</p>
						<p class="content-text">The amount of air passing through the engine is dependent upon three factors:</p>
						<ol class="bullet-list" style="list-style-type: decimal; padding-left: 2.5rem;">
							<li>The compressor speed (rpm)</li>
							<li>The forward speed of the aircraft</li>
							<li>The density of the ambient (surrounding) air</li>
						</ol>
						<p class="content-text">
							To be effective, a modern compressor must increase the intake air pressure <b>20 to 30 times above the ambient air pressure</b> and move the air at a velocity of <b>400 to 500 feet per second</b>.
						</p>

						<div class="info-box">
							<h5>Functions of the Compressor Section</h5>
							<ul class="bullet-list">
								<li>Its primary function is <b>to supply air in sufficient quantity to satisfy the requirements of the combustion burners</b>.</li>
								<li>A secondary function of the compressor is <b>to supply bleed air/customer bleed air for various purposes in the engine and aircraft</b>.</li>
								<li>The bleed-air is taken from any of the various pressure stages of the compressor. Bleeding air from the compressor does cause a small but <b>noticeable drop in engine power</b>. Sometimes power loss can be detected by observing the <b>engine pressure ratio (EPR) indicator</b>.</li>
							</ul>
							<p class="content-text">Bleed air is utilized in a wide variety of ways. Some of the current applications of bleed air are:</p>
							<ol class="bullet-list" style="list-style-type: decimal; padding-left: 2.5rem;">
								<li><b>Cabin pressurization, heating, and cooling;</b></li>
								<li><b>De-icing and anti-icing equipment;</b></li>
								<li><b>Pneumatic starting of engines</b></li>
							</ol>
						</div>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Types of Compressor</h2>
					<div class="section-content">
						<h5 class="detail-heading">Centrifugal Flow Compressor</h5>
						<p class="content-text">
							Sometimes called a radial outflow compressor. This type of compressor is one of the earliest compressor designs and is still used today in some smaller engines and auxiliary power units (APU’s). Centrifugal compressors consist of:
						</p>
						<ul class="bullet-list">
							<li>An Impeller (also called rotor);</li>
							<li>Diffuser;</li>
							<li>And a Manifold</li>
						</ul>
						<p class="content-text">
							Centrifugal compressors have a high pressure rise per stage that can be around <b>8:1</b>. Generally centrifugal compressors are limited to two stages due to efficiency concerns.
						</p>
						<p class="content-text">
							The <b>Impeller (rotor)</b> consists of a forged disk with integral blades fastened by a splined coupling to a common power shaft. Its function is to take air in and accelerate it outward by centrifugal force.
						</p>
						<p class="content-text">
							Compressors having only one impeller are referred to as <b>single-stage compressors</b> while compressors having two impellers are referred to as <b>double-stage compressors</b>.
						</p>

						<h5 class="detail-heading">Double sided / Double Entry Impeller</h5>
						<ul class="bullet-list">
							<li>When two impellers are mounted back-to-back, a double-sided or double-entry impeller is created.</li>
							<li>A single-stage, double-sided impeller allows a higher mass airflow than that of a similar sized single-stage, single-sided impeller. Therefore, engines “with double-sided impellers typically has a smaller overall diameter.</li>
						</ul>

						<h5 class="detail-heading">Process of Compression</h5>
						<p class="content-text">
							Once through the impeller, the air is expelled into a divergent duct called a <b>diffuser</b>. The diffuser acts as a divergent duct where the air spreads out, slows down, and increases in static pressure.
						</p>
						<ul class="bullet-list">
							<li>This prepares the air for entry into the flame burning area of the combustion section at a lower velocity so that the flame of combustion can burn continuously.</li>
							<li>If the air passed through the flame area at a high velocity, <b>it could extinguish the flame</b>.</li>
						</ul>
						<p class="content-text">
							The <b>compressor manifold</b> distributes the air in a smooth flow to the combustion section.
						</p>
						<ul class="bullet-list">
							<li>The compressor manifold diverts the flow of air from the diffuser, which is an integral part of the manifold, into the combustion chambers.</li>
							<li>The manifold has one outlet port for each chamber so that the air is evenly divided.</li>
						</ul>

						<h5 class="detail-heading" style="text-align: center; margin-top: 2rem;">CENTRIFUGAL FLOW COMPRESSOR</h5>
						<div style="overflow-x: auto;">
							<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; color: #1a2b47;">
								<thead>
									<tr style="background-color: rgba(206, 85, 8, 0.1);">
										<th style="border: 1px solid #ddd; padding: 12px; text-align: center;">ADVANTAGES</th>
										<th style="border: 1px solid #ddd; padding: 12px; text-align: center;">DISADVANTAGES</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Simplicity in Manufacture</td>
										<td style="border: 1px solid #ddd; padding: 12px;">Large frontal area required for a given airflow increases aerodynamic drag.</td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Relatively Low Cost</td>
										<td style="border: 1px solid #ddd; padding: 12px;"></td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Low Weight</td>
										<td style="border: 1px solid #ddd; padding: 12px;"></td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Low Starting Power Requirements</td>
										<td style="border: 1px solid #ddd; padding: 12px;">Practical limits on the number of stages restrict its usefulness when designing larger and more powerful engines.</td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Operating Efficiency over a wide range of rotational speed</td>
										<td style="border: 1px solid #ddd; padding: 12px;"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Axial Flow Compressor</h2>
					<div class="section-content">
						<p class="content-text">
							In an axial flow compressor, the airflow is along the horizontal axis of the compressor. An axial flow compressor has two main elements, a <b>rotor</b> and a <b>stator</b>.
							The task of an axial compressor is to raise air pressure rather than air velocity.
						</p>
						
						<p class="content-text">
							The <b>rotor</b> consists of rows of blades fixed on a rotating spindle. The angle and airfoil contour of the blades forces air rearward in the same manner as a propeller.
						</p>
						<ul class="bullet-list">
							<li>The rotor blades are usually made of <b>stainless steel</b> with the latter stages being made of <b>titanium</b>.</li>
							<li>The design of blade attachment to the rotor disk rims varies, but they are commonly fitted into disks by either <b>bulb-type</b> or <b>fir- tree methods</b>, <b>dovetail</b>.</li>
						</ul>
						<p class="content-text">
							Some long fan blades have a mid-span shroud that helps support the blades, making them more resistant to the bending forces created by the airstream. The shrouds, however, do block some of the airflow and create additional aerodynamic drag that reduces fan efficiency. The rotor blades used in an axial flow compressor have an airfoil cross- section with a varying angle of incidence, or twist. This twist compensates for the blade velocity variation caused by its radius.
						</p>

						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_7.1.png', alt: 'Axial Flow Compressor' },
							{ src: '/images/turbofan-module3/img_7.2.png', alt: 'Axial Compressor Detail' }
						]} columns={2} height="260px" />
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_8.png', alt: 'Rotor Blade Attachment' },
							{ src: '/images/turbofan-module3/img_9.png', alt: 'Blade Twist' }
						]} columns={2} height="260px" />

						<p class="content-text">
							The <b>stator vanes</b>, on the other hand, are arranged in fixed rows between the rows of rotor blades and act as diffusers at each stage, decreasing air velocity and raising pressure. Like rotor blades, stator vanes have an airfoil shape. In addition, the angle of attack of stator vanes can be <b>fixed or variable</b>.
						</p>
						<p class="content-text">
							The set of stator vanes immediately in front of the first stage rotor blades are called <b>inlet guide vanes</b>. These vanes direct the airflow into the first stage rotor blades at the best angle while imparting a swirling motion in the direction of engine rotation. This action improves the aerodynamics of the compressor by reducing the drag on the first stage rotor blades.
						</p>
						<ul class="bullet-list">
							<li>Stator vanes are normally constructed out of steel or nickel because those metals have high fatigue strength.</li>
							<li>Stator vanes are often shrouded at their tips to minimize vibration tendencies.</li>
							<li>Some axial compressors with high compressor pressure ratios utilize <b>variable inlet guide vanes</b> plus several stages of <b>variable stator vanes</b>.</li>
							<li>These variable inlet guide vanes and stators automatically reposition themselves to maintain proper airflow through the engine under varying operating conditions.</li>
						</ul>
						<p class="content-text">
							The last set of vanes the compressor air passes through is the <b>outlet vane assembly</b>. These vanes straighten the airflow and eliminate any swirling motion or turbulence.
							The air velocity of the compressed air must be slowed before it enters the combustion chamber. The divergent shape of a <b>diffuser</b> slows compressor discharge while, at the same time, increasing air pressure to its highest value in the engine.
						</p>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_10.png', alt: 'Stator Vanes' },
							{ src: '/images/turbofan-module3/img_11.png', alt: 'Shrouded Stator Vanes' }
						]} columns={2} height="260px" />

						<h5 class="detail-heading">Pressure Stage</h5>
						<ul class="bullet-list">
							<li>Each consecutive row of rotor blades and stator vanes constitutes a <b>pressure stage</b>.</li>
							<li>The number of stages is determined by the amount of air and total pressure rise required.</li>
							<li>A single stage in an axial flow compressor is capable of producing a compressor pressure ratio of only <b>1.25:1</b>.</li>
							<li>Therefore, high compressor pressure ratios are obtained by adding more compressor stages. In order to add more compressor stages, multi-spool compressors are created.</li>
						</ul>

						<h5 class="detail-heading">Process of Compression</h5>
						<ul class="bullet-list">
							<li>The air from the air inlet is guided by the inlet guide vanes to the rotors and stators.</li>
							<li>Each compressor stage raises the pressure of the incoming air while the air's velocity is alternately increased then decreased as airflow proceeds through the compressor.</li>
							<li>The rotor blades slightly accelerate the airflow then the stator vanes diffuse the air, slowing it and increasing the pressure.</li>
							<li>The overall result is increased air pressure and relatively constant air velocity from compressor inlet to outlet.</li>
							<li>The outlet guide vanes will now guide the compressed air into the diffuser to prepare the air mass for combustion.</li>
							<li>This process will repeat depending on the number of spools the compressor have.</li>
						</ul>

						<h5 class="detail-heading">Multi Spool Compressors</h5>
						<p class="content-text">
							Engine designers devised a way to overcome the limitations of single-spool compressors by splitting the compressor into two or three sections.
						</p>
						<ul class="bullet-list">
							<li>Each section is connected to a portion of the turbine section by shafts that run coaxially, one within the other.</li>
						</ul>

						<h5 class="detail-heading">Dual Spool Compressor</h5>
						<ul class="bullet-list">
							<li>The <b>front section</b> of a dual- spool compressor is called the <b>low pressure, low speed, or N1 compressor</b>. This low pressure compressor is typically driven by a two-stage turbine at the rear of the turbine section.</li>
							<li>The <b>second compressor</b> section of a twin-spool compressor is called the <b>high pressure, high speed, or N2 compressor</b> and is typically driven by a single stage high-pressure turbine at the front of the turbine section.</li>
						</ul>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_13.png', alt: 'Dual Spool Compressor' }]} columns={1} height="260px" />

						<h5 class="detail-heading">Triple Spool Compressor</h5>
						<ul class="bullet-list">
							<li>In this arrangement the <b>fan</b> is referred to as the <b>low speed, or N1 compressor</b></li>
							<li>The compressor next in line is called the <b>intermediate, or N2 compressor</b>,</li>
							<li>The innermost compressor is the <b>high pressure, or N3 compressor</b>.</li>
						</ul>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_14.png', alt: 'Triple Spool Compressor' }]} columns={1} height="260px" />

						<h5 class="detail-heading" style="text-align: center; margin-top: 2rem;">AXIAL FLOW COMPRESSOR</h5>
						<div style="overflow-x: auto;">
							<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; color: #1a2b47;">
								<thead>
									<tr style="background-color: rgba(206, 85, 8, 0.1);">
										<th style="border: 1px solid #ddd; padding: 12px; text-align: center;">ADVANTAGES</th>
										<th style="border: 1px solid #ddd; padding: 12px; text-align: center;">DISADVANTAGES</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">High peak efficiencies</td>
										<td style="border: 1px solid #ddd; padding: 12px;">Good efficiencies over only narrow rotational speed range</td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Small frontal area</td>
										<td style="border: 1px solid #ddd; padding: 12px;">Difficulty of manufacture and high cost</td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Straight through flow, allowing high ram efficiency</td>
										<td style="border: 1px solid #ddd; padding: 12px;">Relatively high weight</td>
									</tr>
									<tr>
										<td style="border: 1px solid #ddd; padding: 12px;">Increased pressure rise by increasing number of stages, with negligible loses</td>
										<td style="border: 1px solid #ddd; padding: 12px;">High starting power requirements</td>
									</tr>
								</tbody>
							</table>
						</div>

						<h5 class="detail-heading">Compressor Stall</h5>
						<p class="content-text">
							A compressor blade has an angle of attack, therefore, are subject to the same aerodynamic principles that apply to aircraft wings. A compressor stall occurs when the compressor blades' angle of attack exceeds the critical angle of attack. It can be described as an imbalance between the two vector quantities, inlet velocity, and compressor rotational speed.
						</p>
						<div class="info-box">
							<h5>Causes of Compressor Stall</h5>
							<ul class="bullet-list">
								<li>Compressor stalls typically occur when the engine inlet air becomes turbulent or disrupted when an aircraft flies in severe turbulence or performs abrupt flight maneuvers.</li>
								<li>Excessive fuel flow produced by a sudden engine acceleration, accompanied by incompatible engine rpm and airflow combinations.</li>
								<li>Contamination or damage to compressor blades, stator vanes, or turbine components can also cause a compressor stall.</li>
							</ul>
						</div>
						
						<h5 class="detail-heading">Hung Stalls</h5>
						<p class="content-text">
							Hung stalls are severe stalls that can significantly impair engine performance, cause loss of power, and can damage the engine.
						</p>
					</div>
				</section>
			{/if}

			<!-- Page 3: HOT SECTION: COMBUSTION -->
			{#if currentPageSections === 3}
				<section class="content-card">
					<h2 class="section-title">HOT SECTION: COMBUSTION</h2>
					<div class="section-content">
						<div class="image-wrapper" style="height: 400px; width: 100%;">
							<ModelViewer modelPath="/models/Combustion.glb" autoLoad={true} />
						</div>
						<p style="text-align: center; font-style: italic;">(3D SECTIONED VIEW OF COMBUSTION SECTION ONLY)</p>
						<ul class="bullet-list">
							<li>A combustion section is typically located directly between the compressor diffuser and turbine section.</li>
							<li>All combustion sections contain the same basic elements: one or more combustion chambers (combustors), a fuel injection system, an ignition source, and a fuel drainage system.</li>
							<li>The primary function of the combustion section is to burn the fuel/air mixture, thereby adding heat energy to the air.</li>
						</ul>

						<h5 class="detail-heading">Fuel Injection System</h5>
						<p class="content-text">
							The fuel injection system meters the appropriate amount of fuel through the fuel nozzles into the combustors. Fuel nozzles are located in the combustion chamber case. Fuel is delivered through the nozzles into the liners in a finely atomized spray to ensure thorough mixing with the incoming air.
						</p>

						<h5 class="detail-heading">Fuel Drainage System</h5>
						<p class="content-text">
							A fuel drainage system accomplishes the important task of draining the unburned fuel after engine shutdown. In addition, draining the unburned fuel helps to prevent gum deposits in the fuel manifold, nozzles, and combustion chambers, which are caused by fuel residue.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_15.png', alt: 'Combustion Chamber Components' }]} columns={1} height="320px" />

						<h5 class="detail-heading">Combustion Chambers (Combustors)</h5>
						<p class="content-text">
							The combustor chambers in a turbine engine are where the fuel and air are mixed and burned. Combustors may vary depending on their type.
						</p>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Types of Combustion Chambers</h2>
					<div class="section-content">
						<h5 class="detail-heading">Multiple Can Type / Tubular</h5>
						<p class="content-text">
							The multiple-can type combustion chamber consists of a series of individual combustor cans, which act as individual burner units. It is well-suited to centrifugal compressor engines because of the way the compressor discharge air is equally divided at the diffuser.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_16.png', alt: 'Multiple Can Type Combustor' }]} columns={1} height="320px" />
						<p class="content-text">
							One of the major advantages of this type of combustor chamber is that multiple combustors can be individually removed for inspection. The individual combustors in a typical multiple-can combustion chamber are interconnected with small <b>flame propagation tubes</b>. The combustion starts in the two cans equipped with igniter plugs; the flame then travels through the tubes and ignites the fuel/air mixture in the other cans. There are 8 or 10 cans in a typical multiple-can combustion section.
						</p>

						<h5 class="detail-heading">Annular Type or Basket Type Combustor</h5>
						<p class="content-text">
							An annular combustion chamber consists of a housing and a perforated inner liner, or basket. It must be removed as a single unit for repair or replacement. Annular combustors are commonly used in both small and large engines. Normally, the ignition source consists of two spark igniters similar to the type found in multiple-can combustors. In a conventional annular combustor, airflow enters at the front and is discharged at the rear, with primary and secondary airflow much the same as in the multiple-can design.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_17.png', alt: 'Annular Type Combustor' }]} columns={1} height="320px" />

						<h5 class="detail-heading">Can-Annular Type Combustor / Tuboannular</h5>
						<p class="content-text">
							Can-annular combustion sections represent a combination of the multiple-can combustor and the annular type combustor. It was invented by Pratt & Whitney and consists of a removable steel shroud that encircles the entire combustion section. An individual can and liner is removed and installed as one unit for maintenance. This design combines the ease of overhaul and testing of the multiple-can arrangement with the compactness of the annular combustor.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_18.png', alt: 'Can-Annular Type Combustor' }]} columns={1} height="320px" />
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Characteristics of a Good Combustion Chamber</h2>
					<div class="section-content">
						<ul class="bullet-list">
							<li>Mix fuel and air effectively in the best ratio for good combustion.</li>
							<li>Burn the mixture as efficiently as possible.</li>
							<li>Cool the hot combustion gases to a temperature the turbine blades can tolerate.</li>
							<li>Distribute hot gases evenly to the turbine section</li>
						</ul>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Primary and Secondary Air</h2>
					<div class="section-content">
						<ul class="bullet-list">
							<li>In order to allow the combustion section to mix the incoming fuel and air, ignite the mixture, and cool the combustion gases, airflow through a combustor is divided into primary and secondary paths.</li>
							<li>Approximately 25 to 35 percent of the incoming air is designated as primary while 65 to 75 percent becomes secondary.</li>
							<li>Primary, or combustion air, is directed inside the liner in the front end of a combustor. It is used to support the combustion.</li>
							<li>The secondary airflow in the combustion section forms a cooling air blanket on both sides of the liner and centers the combustion flames so they do not contact the liner. It also cools the hot gases before they enter the turbine section.</li>
						</ul>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_19.png', alt: 'Primary and Secondary Air' }]} columns={1} height="320px" />
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Flameout</h2>
					<div class="section-content">
						<ul class="bullet-list">
							<li>The situation wherein an excessively high velocity airflow could literally blow the flame out of the engine/combustion chamber.</li>
						</ul>
						<h5 class="detail-heading">Two Types of Flameout</h5>
						<ul class="bullet-list">
							<li><b>Lean Die Out</b> - usually occurs at high altitude, where low engine speeds and low fuel pressure form a weak flame that can die out in a normal airflow.</li>
							<li><b>Rich Blow Out</b> - occurs during rapid engine acceleration when an overly-rich mixture causes the fuel temperature to drop below the combustion temperature or when there is insufficient airflow to support combustion.</li>
						</ul>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Combustion Process</h2>
					<div class="section-content">
						<p class="content-text">
							Air from the compressor enters the combustion chamber at high velocity and is slowed down to increase its pressure. A flame tube (combustion liner) controls the air distribution to maintain an air-fuel ratio between 45:1 and 130:1. About 20% of the air enters through the snout into the primary combustion zone, while the rest flows around the flame tube. Additional air passes through secondary holes, creating a recirculation zone that mixes air and fuel for stable combustion. The fuel spray from the nozzle intersects this vortex, enhancing mixing and atomization. Combustion must finish before dilution air enters to avoid cooling and incomplete burning. Ignition starts with an electric spark, after which the flame sustains itself. Fuel is usually delivered as a fine atomized spray through nozzles.
						</p>
					</div>
				</section>
			{/if}

			<!-- Page 4: TURBINE SECTION -->
			{#if currentPageSections === 4}
				<section class="content-card">
					<h2 class="section-title">TURBINE</h2>
					<div class="section-content">
						<div class="image-wrapper" style="height: 400px; width: 100%;">
							<ModelViewer modelPath="/models/Turbine.glb" autoLoad={true} />
						</div>
						<p style="text-align: center; font-style: italic;">(3D SECTIONED VIEW OF TURBINE ONLY)</p>
						<p class="content-text">
							A turbine transforms a portion of the kinetic energy in the hot exhaust gases into mechanical energy to drive the compressor and accessories. The turbine section of a turbojet engine is located downstream of the combustion section and consists of four basic elements: <b>a case, a stator, a shroud, and a rotor</b>.
						</p>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_20.1.png', alt: 'Turbine Components' },
							{ src: '/images/turbofan-module3/img_20.2.png', alt: 'Turbine Assembly' }
						]} columns={2} height="260px" />

						<h5 class="detail-heading">Case</h5>
						<p class="content-text">
							The turbine casing encloses the turbine rotor and stator assembly, giving either direct or indirect support to the stator elements. A typical case has flanges on both ends that provide a means of attaching the turbine section to the combustion section and the exhaust assembly.
						</p>

						<h5 class="detail-heading">Turbine Stator</h5>
						<p class="content-text">
							A stator element is most commonly referred to as the <b>turbine nozzle, turbine guide vanes</b>, or the <b>nozzle diaphragm</b>. The turbine nozzle is located directly aft of the combustion section and immediately forward of the turbine wheel. It is typically exposed to the highest temperatures. Its purpose is to collect the high-energy airflow from the combustors and direct the flow to strike the turbine rotor at the appropriate angle. The vanes of a turbine nozzle are set at such an angle that they form several converging nozzles that convert some of the exhaust gases' pressure energy to velocity energy. The nozzle vanes must be constructed to allow for thermal expansion.
						</p>

						<h5 class="detail-heading">Turbine Rotor</h5>
						<p class="content-text">
							The rotating elements of a turbine section consist of a <b>shaft</b> and a <b>turbine rotor (wheel)</b>.
						</p>
						<ul class="bullet-list">
							<li>The turbine wheel is a dynamically balanced unit consisting of blades attached to a rotating disk.</li>
							<li>The turbine disk is the anchoring component for the turbine blades and is bolted or welded to the main shaft.</li>
						</ul>
						<p class="content-text">
							As the high-velocity gases pass through the turbine nozzle and impact the turbine blades, the turbine wheel rotates. Many engines use multiple turbine stages, each stage consisting of a turbine nozzle and wheel.
						</p>
						<p class="content-text">
							<b><i>Growth or Creep</i></b> – it is a phenomenon in which extreme stress on turbine blades may cause the turbine blades to grow in length due to severe centrifugal loads imposed by high rotational speeds.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_21.png', alt: 'Case, Stator, Shroud, and Rotor', caption: 'Case, Stator, Shroud, and Rotor' }]} columns={1} height="320px" />
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Turbine Blades</h2>
					<div class="section-content">
						<p class="content-text">
							Turbine blades are airfoil-shaped components designed to extract the maximum amount of energy from the flow of hot gases. Turbine blades fit loosely into a turbine disk when an engine is cold, but expand to fit tightly at normal operating temperatures. The most commonly used method for attaching turbine blades is by <b>fir tree slots</b> cut into the turbine disk rim and matching bases cast or machined into the turbine blade base. It can be classified as impulse blades, reaction blades, and impulse-reaction blades.
						</p>
						<ul class="bullet-list">
							<li><b>Impulse Turbine Blades</b> – the blades merely change the direction of airflow coming from the turbine nozzle and cause relatively no change in gas pressure or velocity.</li>
							<li><b>Reaction Turbine Blades</b> – produce a turning force based on an aerodynamic action. To do this, the turbine blades form a series of converging ducts that increase gas velocity and reduce pressure.</li>
						</ul>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_22.png', alt: 'Impulse and Reaction Turbine Blades' },
							{ src: '/images/turbofan-module3/img_24.1.png', alt: 'Turbine Blade Attachment Detail' },
							{ src: '/images/turbofan-module3/img_24.2.png', alt: 'Turbine Blade Shroud and Tip Detail' }
						]} columns={3} height="260px" />
						<ul class="bullet-list">
							<li><b>Impulse-Reaction Turbine Blades</b> – a combination of impulse and reaction blades, the workload along the length of the blade is evenly distributed. The blade base is impulse-shaped while the blade tip is reaction-shaped.</li>
						</ul>

						<h5 class="detail-heading">Shrouded Turbine Blades</h5>
						<p class="content-text">
							Turbine blades can be open or shrouded at their ends. Shroud is attached to the tips of the turbine blades to reduce vibration.
						</p>
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Cooling of the Turbine Section</h2>
					<div class="section-content">
						<p class="content-text">
							The most common ways of cooling the components in the turbine section is to use engine bleed air. There are two types of blade cooling: convection cooling/film cooling and transpiration cooling.
						</p>
						<ul class="bullet-list">
							<li><b>Convection Cooling/Film Cooling</b> – compressor bleed air is typically directed in through the hollow blades and out through holes in the tip, leading edge, and trailing edge.</li>
							<li><b>Transpiration Cooling</b> – only used on stationary nozzle vanes, bleed air is ducted into the vanes and exits through the porous material.</li>
						</ul>
						<p class="content-text">
							<b>Active Tip Clearance Control (ACC)</b> – ACC controls the thermal expansion rate of the turbine case by regulating the flow of cooling air around the turbine case.
						</p>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_23.1.png', alt: 'Active Tip Clearance Control 1' },
							{ src: '/images/turbofan-module3/img_23.2.png', alt: 'Active Tip Clearance Control 2' }
						]} columns={2} height="320px" />
						<p class="content-text">
							<b>Counter Counter-rotating turbines</b> – are chosen by engine designers for their effectiveness in dampening gyroscopic effects and reducing engine vibration, not for aerodynamic reasons.
						</p>
					</div>
				</section>
			{/if}

			<!-- Page 5: EXHAUST SECTION & ACCESSORIES -->
			{#if currentPageSections === 5}
				<section class="content-card">
					<h2 class="section-title">EXHAUST SECTION</h2>
					<div class="section-content">
						<div class="image-wrapper" style="height: 400px; width: 100%;">
							<ModelViewer modelPath="/models/Exhaust.glb" autoLoad={true} />
						</div>
						<p style="text-align: center; font-style: italic;">(3D SECTIONED VIEW OF EXHAUST ONLY)</p>
						<p class="content-text">
							A typical exhaust section extends from the rear of the turbine section to the point where the exhaust gases leave the engine. It must direct the flow of hot gases rearward in such a manner as to prevent turbulence and, at the same time, impart a high final or exit velocity to the gases. It is comprised of several components including the <b>exhaust cone, exhaust duct</b> or <b>tailpipe,</b> and <b>exhaust nozzle.</b>
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_26.png', alt: 'Exhaust Components' }]} columns={1} height="320px" />

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
						<ul class="bullet-list">
							<li><b>Converging Exhaust Nozzle</b> – the convergent shape produces a venturi that accelerates the exhaust gases and increases engine thrust.</li>
							<li><b>Converging-Diverging Nozzle</b> – the converging portion of the exhaust nozzle accelerates the turbine exhaust gases to supersonic speed at the narrowest part of the duct, then, they are accelerated further in the nozzle's divergent portion, so the exhaust gases exit the nozzle well above the speed of sound.</li>
						</ul>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_27.1.png', alt: 'Converging Exhaust Nozzle' },
							{ src: '/images/turbofan-module3/img_27.2.png', alt: 'Converging-Diverging Nozzle' }
						]} columns={2} height="260px" />

						<h5 class="detail-heading">Mixer Unit</h5>
						<p class="content-text">
							On fan or bypass type engines, there are two gas streams venting to the atmosphere; high temperature gases are discharged by the turbine and cool air mass moved rearward by the fan section. In a low by-pass engine, the flow of cool and hot air are combined in a mixer unit that ensures mixing of the two streams prior to exiting the engine.
						</p>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_28.1.png', alt: 'Mixer Unit 1' },
							{ src: '/images/turbofan-module3/img_28.2.png', alt: 'Mixer Unit 2' }
						]} columns={2} height="260px" />

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
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Accessory Section</h2>
					<div class="section-content">
						<p class="content-text">
							The accessory section, or accessory drive, of a gas turbine engine is used to power both engine and aircraft accessories such as electric generators, hydraulic pumps, fuel pumps, and oil pumps. Secondary functions include acting as an oil reservoir, or sump, and housing the accessory drive gears and reduction gears.
						</p>
						<p class="content-text">
							Typical places where an accessory drive is located include the engine's midsection, or the front or rear of the engine. The power needed for Accessory drives is typically designed to blend with the engine profile to minimize drag.
						</p>
						<p class="content-text">
							A set of beveled gears is used to drive an accessory shaft, which, in turn, drives an accessory gearbox. Since turbine engines operate at a relatively high rpm, reduction gearing is necessary in the accessory drive system to provide appropriate drive speeds for the accessories. In some installations, an intermediate or transfer gearbox is necessary to obtain the appropriate reduction gearing for the accessories.
						</p>
						<ImageGrid images={[{ src: '/images/turbofan-module3/img_29.png', alt: 'Accessory Section' }]} columns={1} height="260px" />
					</div>
				</section>

				<section class="content-card">
					<h2 class="section-title">Auxiliary Power Units</h2>
					<div class="section-content">
						<p class="content-text">
							The Auxiliary Power Unit (APU) is a constant-speed gas turbine engine. The APU is a self-contained unit, which enables the aircraft to be independent of external pneumatic and electrical power sources. To meet the demands for ground power when the aircraft engines are not running, for example, large amounts of electrical power for passenger amenities such as lighting, entertainment, and food preparation, most large turbine aircraft are equipped with auxiliary power units, or APUs. APU provides:
						</p>
						<ul class="bullet-list">
							<li>Electrical power for the aircraft systems,</li>
							<li>Bleed air for engine starting and air conditioning on the ground,</li>
							<li>Bleed air for air conditioning/pressurization and wing anti-ice in flight.</li>
						</ul>
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_30.png', alt: 'APU 1' },
							{ src: '/images/turbofan-module3/img_31.png', alt: 'APU 2' },
							{ src: '/images/turbofan-module3/img_33.1.png', alt: 'APU 3' },
							{ src: '/images/turbofan-module3/img_33.2.png', alt: 'APU 4' }
						]} columns={2} height="260px" />
						<ImageGrid images={[
							{ src: '/images/turbofan-module3/img_32.1.png', alt: 'APU 3' },
							{ src: '/images/turbofan-module3/img_32.2.png', alt: 'APU 4' }
						]} columns={2} height="260px" />
					</div>
				</section>
			{/if}

			<!-- Bottom Navigation -->
			<div class="bottom-nav">
				<button onclick={prevPageSections} class="nav-link prev">
					<span class="nav-arrow">←</span>
					<span>{currentPageSections === 1 ? 'Previous: Overview' : 'Previous'}</span>
				</button>
				
				<div class="page-numbers">
					{#each Array(totalPagesSections) as _, i}
						<button
							class="page-number {currentPageSections === i + 1 ? 'active' : ''}"
							onclick={() => goToPageSections(i + 1)}
							aria-label="Go to page {i + 1}"
						>
							{i + 1}
						</button>
					{/each}
				</div>

				<button onclick={nextPageSections} class="nav-link next">
					<span>{currentPageSections === totalPagesSections ? 'Next: Overhaul Station' : 'Next'}</span>
					<span class="nav-arrow">→</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		overflow-x: hidden;
		margin: 0;
		padding: 0;
		background: transparent;
		color: var(--font-secondary);
		color: var(--font-primary, #E8F4FA);
		font-family: var(--font-body), 'Open Sans', sans-serif;
	}

	/* Main Page Layout */
	.turbofan-page {
		--turbofan-accent: #D35400;
		--turbofan-accent-rgb: 211, 84, 0;
		min-height: 100vh;
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl);
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	/* Header Section */
	.header-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 3rem;
		gap: 1.5rem;
		position: relative;
	}

	.title-group {
		text-align: center;
		width: 100%;
	}

	.main-title {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		text-align: center;
		margin: 0 0 1.5rem 0;
		color: #FFFFFF;
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	/* gradient-flash keyframes moved to global app.css */

	.main-description {
		font-family: 'Poppins', var(--font-body), sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		color: #FFFFFF;
		text-align: justify;
		line-height: 1.8;
		margin: 0 auto 2.5rem;
		max-width: 900px;
		background: transparent;
		padding: 0;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}

	/* Search Container */
	.search-container {
		align-self: flex-end;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(206, 85, 8, 0.3);
		border-radius: 50px;
		padding: 0.5rem var(--card-padding-mobile);
		min-width: 300px;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.search-container:focus-within {
		border-color: var(--turbofan-accent);
		box-shadow: 0 0 20px rgba(206, 85, 8, 0.3);
	}

	.search-input {
		background: transparent;
		border: none;
		outline: none;
		color: #0A1628;
		font-size: 1rem;
		flex: 1;
		padding: 0.2rem;
	}

	.search-input::placeholder {
		color: rgba(10, 22, 40, 0.5);
	}

	.search-button {
		background: transparent;
		border: none;
		color: var(--font-accent-cyan, #00CED1);
		cursor: pointer;
		padding: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.search-button:hover {
		color: var(--navbar-accent, var(--ui-yellow));
	}

	/* Tab Buttons */
	.tab-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 2rem;
		margin-bottom: 2rem;
		padding-right: 2rem;
	}

	.tab-button {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		font-weight: 700;
		padding: 0.5rem var(--card-padding-mobile);
		border-radius: 0;
		border: none;
		background: transparent;
		color: var(--font-primary);
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: none;
		position: relative;
		opacity: 0.7;
	}

	.tab-button:hover {
		background: transparent;
		transform: translateY(-2px);
		opacity: 1;
	}

	.tab-button.active {
		background: transparent;
		color: var(--turbofan-accent);
		box-shadow: none;
		font-weight: 900;
		opacity: 1;
		border-bottom: 3px solid var(--turbofan-accent);
	}

	/* Overview Content */
	.overview-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}

	/* Content Card Style (from Hangar Zone) */
	.content-card {
		background: transparent;
		border: none;
		border-radius: 0;
		padding: 0;
		box-shadow: none;
		overflow: visible;
		margin-bottom: 3rem;
	}

	.section-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #FFFFFF;
		background: var(--turbofan-accent);
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

	.section-content {
		background: #FFFFFF;
		border: 3px solid var(--turbofan-accent);
		border-radius: 0 30px 30px 30px;
		padding: var(--card-padding);
		color: #1a2b47;
		position: relative;
		z-index: 1;
		min-height: 300px;
	}

	/* Image grids and placeholders are managed by ImageGrid component now */

	/* three-column and parameter-image styles are handled by ImageGrid and caption use */

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
	}

	/* Zoom Icon */
	.zoom-icon {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		z-index: 10;
		color: var(--turbofan-accent);
	}

	.zoom-icon:hover {
		transform: scale(1.1);
		background: #FFFFFF;
		color: var(--turbofan-accent);
	}

	/* Text Content */
	.text-content-wrapper {
		line-height: 1.9;
	}

	.text-content-wrapper p {
		margin: 0 0 1.5rem 0;
		color: #2c3e50;
		font-size: 1.15rem;
		line-height: 1.9;
		text-align: justify;
	}

	.content-text {
		margin: 0 0 1.5rem 0;
		color: #2c3e50;
		font-size: 1.15rem;
		line-height: 1.9;
		text-align: justify;
	}

	.bullet-list {
		list-style: none;
		padding-left: 0;
		margin: 2rem 0;
	}

	.bullet-list li {
		position: relative;
		padding-left: 2.5rem;
		margin-bottom: 1.25rem;
		color: #2c3e50;
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.bullet-list li::before {
		content: '▸';
		position: absolute;
		left: 0.5rem;
		color: var(--turbofan-accent);
		font-weight: bold;
		font-size: 1.4rem;
	}

	/* Info Box */
	.info-box {
		background: linear-gradient(135deg, rgba(var(--turbofan-accent-rgb), 0.1) 0%, rgba(var(--turbofan-accent-rgb), 0.05) 100%);
		border-left: 5px solid var(--turbofan-accent);
		border-radius: 12px;
		padding: var(--card-padding-mobile);
		margin: 1.5rem 0;
		color: #1a2b47;
	}

	.info-box h5 {
		font-weight: 700;
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 2px solid rgba(var(--turbofan-accent-rgb), 0.2);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.8rem var(--card-padding-mobile);
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(var(--turbofan-accent-rgb), 0.3);
		border-radius: 10px;
		color: #0A1628;
		font-weight: 600;
		transition: all 0.3s ease;
		width: fit-content;
		min-width: 140px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.nav-link:not(:disabled):hover {
		border-color: var(--turbofan-accent);
		/* Keep background unchanged — apply a soft glow */
		box-shadow: 0 6px 30px rgba(var(--turbofan-accent-rgb), 0.25), 0 0 18px rgba(var(--turbofan-accent-rgb), 0.18) inset;
		transform: translateY(-2px);
	}

	.nav-link:hover .nav-arrow {
		color: var(--turbofan-accent);
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
		color: var(--turbofan-accent);
	}

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
		color: #1a2b47; /* Dark text for white background in Overview */
		font-weight: 600;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	/* Specific override for Engine Sections pagination */
	.sections-content .page-number {
		color: #FFFFFF;
	}
	
	.sections-content .page-number:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	/* Specific override for Overview pagination */
	.more-info-container .page-number {
		color: #FFFFFF;
	}

	.more-info-container .page-number:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.page-number.active {
		background: var(--turbofan-accent);
		color: #FFFFFF !important;
		font-weight: 800;
		transform: scale(1.1);
	}

	/* Engine Sections Side-by-Side Layout */
	#engine-sections-tab .section-content::after {
		content: "";
		display: table;
		clear: both;
	}

	#engine-sections-tab .section-content .image-wrapper,
	#engine-sections-tab .section-content :global(.image-grid) {
		float: right;
		width: 45%;
		margin: 0 0 1.5rem 2rem;
		clear: right;
	}

	/* Adjust ModelViewer container when floated */
	#engine-sections-tab .section-content .image-wrapper {
		height: 350px !important; /* Reduce height slightly */
	}

	@media (max-width: 1024px) {
		#engine-sections-tab .section-content .image-wrapper,
		#engine-sections-tab .section-content :global(.image-grid) {
			float: none;
			width: 100%;
			margin: 2rem 0;
		}
		
		#engine-sections-tab .section-content .image-wrapper {
			height: 400px !important;
		}
	}

	.module-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 900;
		margin: 0 0 3rem 0;
		color: var(--font-secondary); /* allow gradient or normal text as needed */
		text-align: center;
		text-transform: uppercase;
		line-height: 1.1;
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	@media (max-width: 768px) {
		.bottom-nav {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		.nav-link.prev, .nav-link.next {
			justify-self: center;
			width: 100%;
		}
		:global(.image-grid) {
			grid-template-columns: 1fr;
		}
	}

	/* Jaja Tip */
	.jaja-tip-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
		padding: 0 1rem;
	}

	.jaja-avatar img {
		width: 80px;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
	}

	.jaja-bubble {
		background: #FFFFFF;
		border: 4px solid var(--turbofan-accent);
		border-radius: 12px;
		padding: 0.8rem var(--card-padding-mobile);
		position: relative;
		box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
		font-family: var(--font-body);
		font-weight: 600;
		color: #1a2b47;
		text-transform: none;
		letter-spacing: normal;
		display: flex;
		align-items: center;
	}

	/* Ensure MarkdownRenderer output doesn't add unexpected margins inside the bubble */
	.jaja-bubble :global(.markdown-body) {
		margin: 0;
	}

	.jaja-text :global(.markdown-body) {
		color: inherit;
		font-family: inherit;
		font-weight: inherit;
		line-height: 1.2;
	}

	.zoom-icon-inline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--turbofan-accent);
		vertical-align: middle;
	}
</style>