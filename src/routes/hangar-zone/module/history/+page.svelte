<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import { searchQuery, showSearchModal, performSearch } from '$lib/stores/searchStore';
	import { MODULE_CONTENT } from '$lib/data/searchContent';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import ImageModal from '$lib/components/ImageModal.svelte';
	
	const totalPages = 4;
	
	// Reactive statement to get current page from URL
	$: currentPage = parseInt($page.url.searchParams.get('page') || '1');
	
	// Ensure currentPage is within valid range
	$: if (currentPage < 1) currentPage = 1;
	$: if (currentPage > totalPages) currentPage = totalPages;
	
	function handleSearch() {
		if ($searchQuery.trim()) {
			performSearch($searchQuery, MODULE_CONTENT);
			showSearchModal.set(true);
		}
	}
	
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function goToPage(pageNum: number) {
		if (pageNum >= 1 && pageNum <= totalPages) {
			goto(`/hangar-zone/module/history?page=${pageNum}`);
			scrollToTop();
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			goToPage(currentPage + 1);
		} else {
			goto('/hangar-zone/module/types');
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		} else {
			goto('/hangar-zone');
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			prevPage();
		} else if (event.key === 'ArrowRight') {
			nextPage();
		}
	}

	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('zone-hangar');
		return () => document.body.classList.remove('zone-hangar');
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="page-container">
	<SearchModal />
	<ImageModal />
	
	<!-- Header Section -->
	<div class="header-section">
		<h1 class="module-title gradient-animated">LEARNING MODULE 01: HISTORY OF GAS TURBINE ENGINES</h1>
		<div class="search-container">
			<input 
				type="text" 
				placeholder="Looking for something?" 
				bind:value={$searchQuery}
				on:keydown={(e) => e.key === 'Enter' && handleSearch()}
				class="search-input"
			/>
			<button on:click={handleSearch} class="search-button" aria-label="Search">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Content Sections - Page 1: Principle & Early History -->
	{#if currentPage === 1}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 1: Principle of Jet Propulsion -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">01</span>
				PRINCIPLE OF JET PROPULSION
			</h2>
			<div class="section-content">
				<div class="image-placeholder">
					<img src="/images/hangar-zone/history/1.png" alt="Principle of Jet Propulsion" />
				</div>
				<ul class="bullet-list">
					<li><strong>Isaac Newton's Third Law of Motion</strong> states that for every force acting on a body, there is an opposite and equal reaction.</li>
					<li><strong>Jet propulsion</strong> is the force which is generated in the opposite direction to that of a discharge of fluid under pressure, escaping through an opening.</li>
					<li>Whatever form the device utilizes for jet propulsion, it is essentially a reaction engine that operates according to <strong>Sir Isaac Newton's Third Law of Motion</strong>.</li>
				</ul>
			</div>
		</section>

		<!-- Section 2: History of Jet Propulsion -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">02</span>
				HISTORY OF JET PROPULSION
			</h2>
			<div class="section-content">
				<div class="timeline-item">
					<div class="timeline-date">250 B.C.</div>
					<div class="timeline-content">
						<p>A writer and mathematician named <strong>Hero</strong> devised a toy that used the reaction principle. The toy, called the <strong>aeolipile</strong>, consisted of a covered kettle of water that was heated to produce steam.</p>
						<div class="image-placeholder">
							<img src="/images/hangar-zone/history/2.png" alt="Aeolipile" />
						</div>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-date">1791</div>
					<div class="timeline-content">
						<p>The first patent covering a gas turbine was granted to <strong>John Barber</strong> of England. It included all the essential elements of the modern gas turbine except that it had a reciprocating-type compressor.</p>
						<div class="image-placeholder">
							<img src="/images/hangar-zone/history/3.png" alt="John Barber's Gas Turbine Patent" />
						</div>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-date">1900</div>
					<div class="timeline-content">
						<p>The history of mechanical jet propulsion began in 1900, when <strong>Dr. Sanford Moss</strong> applied some of his concepts in the development of the <strong>turbo-supercharger</strong>. This unique supercharger consisted of a small turbine wheel that was driven by exhaust gases. The turbine was then used to drive a supercharger.</p>
						<p>Research done by Dr. Moss influenced <strong>Frank Whittle</strong> of England in the development of what became the first successful turbojet engine.</p>
					</div>
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 2: Modern Development (1930-1941) -->
	{#if currentPage === 2}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">03</span>
				MODERN JET ENGINE DEVELOPMENT
			</h2>
			<div class="section-content">
				<div class="timeline-item">
					<div class="timeline-date">1930</div>
					<div class="timeline-content">
						<p><strong>Frank Whittle</strong> of England developed what became the first successful turbojet engine and was granted his first patent for the jet engine.</p>
						<div class="image-placeholder">
							<img src="/images/hangar-zone/history/4.png" alt="Frank Whittle's Engine" />
						</div>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-date">1936</div>
					<div class="timeline-content">
						<p>While Whittle was developing the gas turbine engine in England, <strong>Hans von Ohain</strong>, a German engineer, designed and built a jet engine that produced 1,100 pounds of thrust. This engine was installed in the <strong>Heinkel He-178 aircraft</strong> in <strong>1939</strong>, which became recognized as the first practical flight by a jet-propelled aircraft.</p>
						<div class="image-placeholder">
							<img src="/images/hangar-zone/history/5.png" alt="Heinkel He-178 Aircraft" />
						</div>
					</div>
				</div>

				<div class="timeline-item">
					<div class="timeline-date">1941</div>
					<div class="timeline-content">
						<p>Frank Whittle's engine completed its first flight in a <strong>Gloster model E28/39</strong> aircraft. The engine produced about one thousand pounds of thrust and propelled the aircraft at speeds over 400 miles per hour.</p>
						<div class="image-row">
							<img src="/images/hangar-zone/history/6_1.png" alt="Gloster E28/39 Aircraft" />
							<img src="/images/hangar-zone/history/6_2.png" alt="Gloster E28/39 in Flight" />
						</div>
						<p class="highlight-text">The majority of commercial aircraft utilize some form of jet propulsion.</p>
						<p>Another step in the progression of commercial and military aviation was the ability to produce an engine that would propel an aircraft faster than the speed of sound. Such aircraft are the SR-71 Blackbird which flies in excess of Mach five and the Concorde capable of flying 2.2 times the speed of sound.</p>
						<div class="image-row">
							<img src="/images/hangar-zone/history/7_1.png" alt="SR-71 Blackbird" />
							<img src="/images/hangar-zone/history/7_2.png" alt="Concorde" />
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 3: Propulsion Devices & Basic Operation -->
	{#if currentPage === 3}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 4: Propulsion Devices -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">04</span>
				PROPULSION DEVICES
			</h2>
			<div class="section-content">
				<div class="subsection">
					<h3 class="subsection-title">AIR BREATHING</h3>
					<ul class="bullet-list">
						<li>Uses atmospheric air and some fuel as the main propellant.</li>
						<li>Examples are piston engines, ramjet, scramjet, pulsejet, and gas turbine engines.</li>
					</ul>
					<div class="image-row">
						<img src="/images/hangar-zone/history/8_1.png" alt="Air Breathing Engine Example 1" />
						<img src="/images/hangar-zone/history/8_2.png" alt="Air Breathing Engine Example 2" />
					</div>
				</div>

				<div class="subsection">
					<h3 class="subsection-title">ROCKETS</h3>
					<ul class="bullet-list">
						<li>Carries the entire propellant composed of liquid or solid fuel and oxygen.</li>
					</ul>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/history/9.png" alt="Rocket Engine" />
					</div>
				</div>
			</div>
		</section>

		<!-- Section 5: Jet Engines - Basic Operation -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">05</span>
				JET ENGINES – BASIC OPERATION
			</h2>
			<div class="section-content">
				<div class="two-column-layout">
					<div class="diagram-column">
						<img src="/images/hangar-zone/history/10.png" alt="Jet Engine Operation Diagram" />
					</div>
					<div class="text-column">
						<ol class="numbered-list">
							<li>Air enters the trough through the intake duct (cowl).</li>
							<li>Air is compressed by passage through the compressor.</li>
							<li>Mixed with fuel in the combustion chamber.</li>
							<li>Fuel is ignited, Pressure and Temperature raised.</li>
							<li>Some of the pressure used to turn a turbine;</li>
							<li>The turbine shaft drives the compressor.</li>
							<li>Hot, high-pressure air is forced through a nozzle.</li>
							<li>The reaction force is the engine thrust.</li>
						</ol>
					</div>
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 4: Types of Jet Engines -->
	{#if currentPage === 4}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">06</span>
				TYPES OF JET ENGINES
			</h2>
			<div class="section-content">
				<div class="engine-type">
					<h3 class="engine-type-title">RAMJET</h3>
					<ul class="bullet-list">
						<li>An athodyd (aero-thermodynamic-duct) which has no rotating parts and consists of a duct with a divergent entry and a convergent or convergent-divergent exit.</li>
						<li>With a forward motion imparted by an external source, air is forced into the divergent inlet (increasing its pressure). The total energy of air is further increased by the combustion of fuel, and the rapidly expanding gases accelerate to the atmosphere through the outlet duct.</li>
					</ul>
					<div class="image-row">
						<img src="/images/hangar-zone/history/11_1.png" alt="Ramjet Diagram" />
						<img src="/images/hangar-zone/history/11_2.png" alt="Ramjet Engine" />
					</div>
				</div>

				<div class="engine-type">
					<h3 class="engine-type-title">PULSE JET</h3>
					<div class="two-column-layout">
						<div class="text-column">
							<ul class="bullet-list">
								<li>It can be run at static conditions, unlike the ram jet, and is constructed with a robust construction.</li>
								<li>The inlet duct has spring-loaded inlet valves to the open position.</li>
								<li>As air passes to the combustion chamber, it produces high pressures to force the valves closed. As the exhaust gases exit, this creates a low pressure that allows the valves to open and repeat the cycle.</li>
								<li>Unstable as a power plant due to high fuel consumption, and cannot match the performance of modern gas turbine engines.</li>
							</ul>
						</div>
						<div class="diagram-column">
							<img src="/images/hangar-zone/history/12.png" alt="Pulse Jet Diagram" />
						</div>
					</div>
				</div>

				<div class="engine-type">
					<h3 class="engine-type-title">SCRAM JET</h3>
					<div class="two-column-layout">
						<div class="text-column">
							<ul class="bullet-list">
								<li>A scramjet (supersonic combustion ramjet) is a variant of a ramjet air-breathing jet engine in which combustion takes place in supersonic airflow.</li>
								<li>As in ramjets, a scramjet relies on high vehicle speed to compress the incoming air forcefully before combustion (hence ramjet), but whereas a ramjet decelerates the air to subsonic velocities before combustion, the airflow in a scramjet is supersonic throughout the entire engine. That allows the scramjet to operate efficiently at extremely high speeds.</li>
							</ul>
						</div>
						<div class="diagram-column">
							<img src="/images/hangar-zone/history/13.png" alt="Scram Jet Diagram" />
						</div>
					</div>
				</div>

				<div class="engine-type">
					<h3 class="engine-type-title">ROCKET ENGINE</h3>
					<div class="two-column-layout">
						<div class="text-column">
							<ul class="bullet-list">
								<li>A jet engine that does not use atmospheric air as a propulsive fluid stream (non-air breathing).</li>
								<li>Uses propellants, thus enabling outside atmosphere operations.</li>
							</ul>
						</div>
						<div class="diagram-column">
							<img src="/images/hangar-zone/history/14.png" alt="Rocket Engine" />
						</div>
					</div>
				</div>

				<div class="engine-type">
					<h3 class="engine-type-title">GAS TURBINE ENGINE</h3>
					<div class="two-column-layout">
						<div class="text-column">
							<ul class="bullet-list">
								<li>The gas turbine engine is by far the most practical form of jet engine in use today. In fact, the turbine engine has become the standard on nearly all transport category, business, and military aircraft.</li>
								<li>Works in the same manner as a reciprocating engine, but all events happen simultaneously.</li>
							</ul>
						</div>
						<div class="diagram-column">
							<img src="/images/hangar-zone/history/15.png" alt="Gas Turbine Engine" />
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Bottom Navigation -->
	<div class="bottom-nav">
		<button on:click={prevPage} class="nav-link prev">
			<span class="nav-arrow">←</span>
			<span>Previous: {currentPage === 1 ? 'Hangar Zone' : `Page ${currentPage - 1}`}</span>
		</button>

		<!-- Page Numbers -->
		<div class="page-numbers">
			{#each Array(totalPages) as _, i}
				<button
					class="page-number"
					class:active={currentPage === i + 1}
					on:click={() => goToPage(i + 1)}
					aria-label={`Go to page ${i + 1}`}
					aria-current={currentPage === i + 1 ? 'page' : undefined}
				>
					{i + 1}
				</button>
			{/each}
		</div>

		<button on:click={nextPage} class="nav-link next">
			<span>Next: {currentPage === totalPages ? 'Types of Gas Turbine Engines' : `Page ${currentPage + 1}`}</span>
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
	}

	/* Search Container */
	.search-container {
		align-self: flex-end;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border: 2px solid #1a2b47;
		border-radius: 30px;
		padding: 0.5rem 1rem;
		min-width: 300px;
		transition: all 0.3s ease;
	}

	.search-container:focus-within {
		box-shadow: 0 0 0 3px rgba(26, 43, 71, 0.2);
	}

	.search-input {
		background: transparent;
		border: none;
		outline: none;
		color: #1a2b47;
		font-size: 1rem;
		flex: 1;
		padding: 0.2rem;
		font-family: var(--font-body), 'Open Sans', sans-serif;
	}

	.search-input::placeholder {
		color: #8899a6;
	}

	.search-button {
		background: transparent;
		border: none;
		color: #1a2b47;
		cursor: pointer;
		padding: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
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

	.content-card:hover {
		transform: none;
		box-shadow: none;
	}

	.section-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #FFFFFF;
		background: #1a2b47;
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

	.section-title::before {
		display: none;
	}

	.section-number {
		display: none; /* Hide number as per image, or keep if desired. Image doesn't show numbers in the header explicitly but maybe they are there? I'll hide for now to match the clean look or keep it subtle. The image has "LEARNING MODULE 01" but the sections are "PRINCIPLE OF JET PROPULSION". I'll hide the number circle. */
	}

	.section-content {
		background: #FFFFFF;
		border: 3px solid #1a2b47;
		border-radius: 0 30px 30px 30px;
		padding: var(--card-padding);
		color: #1a2b47;
		position: relative;
		z-index: 1;
		min-height: 300px;
	}

	.section-content p {
		color: #2d3f66;
		margin-bottom: 1.25rem;
	}

	.section-content strong {
		color: #0A1628;
		font-weight: 700;
	}

	/* Image Placeholder */
	.image-placeholder {
		background: linear-gradient(135deg, rgba(27, 53, 88, 0.08), rgba(135, 206, 235, 0.05));
		border: 3px solid rgba(27, 53, 88, 0.25);
		border-radius: 16px;
		padding: 1.5rem; /* Reduced padding */
		margin: 0 0 1.5rem 2rem; /* Adjusted margin for float */
		min-height: 150px; /* Reduced height */
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: all 0.3s ease;
		position: relative;
		float: right; /* Float right for side-by-side */
		width: 40%; /* Reduced width */
		clear: right;
	}

	/* Clearfix for containers with floated images */
	.section-content::after,
	.timeline-content::after,
	.subsection::after {
		content: "";
		display: table;
		clear: both;
	}

	.image-placeholder::before {
		position: absolute;
		top: 1rem;
		left: 1.5rem;
		font-size: 0.85rem;
		color: #00838F;
		font-weight: 600;
		opacity: 0.7;
		background: rgba(255, 255, 255, 0.8);
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
	}

	.image-placeholder:hover {
		border-color: rgba(27, 53, 88, 0.5);
		box-shadow: 0 8px 24px rgba(27, 53, 88, 0.2);
	}

	.image-placeholder img {
		max-width: 70%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	/* Image Row - Side by Side Images */
	.image-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem; /* Reduced gap */
		margin: 0 0 1.5rem 2rem;
		float: right;
		width: 45%;
		clear: right;
	}

	.image-row img {
		width: auto;
		max-width: 90%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(0, 206, 209, 0.2);
		transition: all 0.3s ease;
		justify-self: center;
	}

	.image-row img:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 32px rgba(27, 53, 88, 0.3);
		border-color: rgba(27, 53, 88, 0.4);
	}

	/* Two Column Layout - Text and Diagram */
	.two-column-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem; /* Reduced gap */
		align-items: start;
		margin: 1.5rem 0;
	}

	.text-column {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.diagram-column {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.diagram-column img {
		width: auto;
		max-width: 90%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(27, 53, 88, 0.2);
		transition: all 0.3s ease;
	}

	.diagram-column img:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 32px rgba(27, 53, 88, 0.3);
		border-color: rgba(27, 53, 88, 0.4);
	}

	/* Bullet List */
	.bullet-list {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0;
	}

	.bullet-list li {
		position: relative;
		padding-left: 2rem; /* Reduced padding */
		margin-bottom: 1rem; /* Reduced margin */
		font-size: 1rem; /* Reduced font size */
		line-height: 1.7;
		color: #2d3f66;
	}

	.bullet-list li::before {
		content: "▸";
		position: absolute;
		left: 0;
		top: 0;
		color: var(--font-accent-cyan, #00CED1);
		font-size: 1.2rem; /* Reduced size */
		font-weight: bold;
		text-shadow: 0 0 10px rgba(27, 53, 88, 0.3);
	}

	/* Timeline */
	.timeline-item {
		display: grid;
		grid-template-columns: 100px 1fr; /* Reduced column width */
		gap: 1.5rem;
	margin-bottom: 1.5rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid rgba(27, 53, 88, 0.2);
}	.timeline-item:last-child {
		border-bottom: none;
	}

	.timeline-date {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.1rem; /* Reduced font size */
		font-weight: 700;
		color: #0A1628;
		padding: 0.4rem 0.8rem;
		background: linear-gradient(135deg, rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.3), rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.15));
		border-left: 4px solid var(--navbar-accent, var(--ui-yellow));
		border-radius: 8px;
		height: fit-content;
		box-shadow: 0 2px 8px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.2);
	}

	.timeline-content p {
		margin: 0 0 0.8rem 0;
		color: #2d3f66;
	}

	.highlight-text {
		font-weight: 600;
		color: #00838F;
		font-style: italic;
		background: rgba(27, 53, 88, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	/* Subsections */
	.subsection {
	margin-bottom: 1.5rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid rgba(27, 53, 88, 0.1);
}	.subsection:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.subsection-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.15rem; /* Reduced font size */
		font-weight: 600;
		color: #0A1628;
		margin: 0 0 0.8rem 0;
		padding-bottom: 0.4rem;
		border-bottom: 2px solid rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.3);
	}

	/* Numbered List */
	.numbered-list {
		list-style: none;
		counter-reset: item;
		padding: 0;
		margin: 1.5rem 0;
	}

	.numbered-list li {
		position: relative;
		padding-left: 2.5rem;
		margin-bottom: 1rem;
		counter-increment: item;
		font-size: 1rem;
		line-height: 1.7;
		color: #2d3f66;
	}

	.numbered-list li::before {
		content: counter(item);
		position: absolute;
		left: 0;
		top: 0;
		width: 1.75rem; /* Reduced size */
		height: 1.75rem; /* Reduced size */
		background: linear-gradient(135deg, var(--hangar-accent), var(--ui-light-blue));
		color: #0A1628;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.8rem;
		box-shadow: 0 2px 8px rgba(27, 53, 88, 0.3);
	}

	/* Engine Types */
	.engine-type {
		margin-bottom: 2rem;
		padding: 1.25rem 1.5rem; /* Reduced padding */
		background: linear-gradient(135deg, rgba(27, 53, 88, 0.08), rgba(135, 206, 235, 0.05));
		border-radius: 12px;
		border-left: 5px solid var(--hangar-accent);
		box-shadow: 0 2px 8px rgba(27, 53, 88, 0.1);
	}

	.engine-type:last-child {
		margin-bottom: 0;
	}

	.engine-type-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.15rem; /* Reduced font size */
		font-weight: 700;
		color: #0A1628;
		margin: 0 0 0.8rem 0;
		text-transform: uppercase;
		letter-spacing: 1px;
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
		color: #FFFFFF; /* White text for visibility */
		font-weight: 600;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-number:hover {
		background: rgba(255, 255, 255, 0.2);
		color: #FFFFFF;
	}

	.page-number.active {
		background: var(--navbar-accent, var(--font-accent-yellow));
		color: #FFFFFF;
		font-weight: 800;
		transform: scale(1.1);
		box-shadow: none;
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 2px solid rgba(27, 53, 88, 0.2);
	}
	
	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.8rem 1.5rem;
		background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	border: 2px solid rgba(27, 53, 88, 0.3);
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
		border-color: var(--font-accent-cyan, #00CED1);
		/* Do not change background on hover; instead add a colored glow */
		box-shadow: 0 6px 30px rgba(var(--hangar-accent-rgb, 27, 53, 88), 0.25), 0 0 18px rgba(var(--hangar-accent-rgb, 27, 53, 88), 0.18) inset;
		transform: translateY(-2px);
	}

	.nav-link:hover .nav-arrow {
		color: var(--hangar-accent, #1b3558);
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
		color: var(--font-accent-cyan, #00CED1);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.image-row,
		.image-placeholder {
			float: none;
			width: 100%;
			margin: 2rem 0;
		}

		.image-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	@media (max-width: 768px) {
		.header-section {
			flex-direction: column;
			align-items: flex-start;
		}

		.search-container {
			width: 100%;
		}

		.section-title {
			font-size: 1.25rem;
			padding: var(--spacing-sm) var(--spacing-sm);
			gap: 0.8rem;
		}

		.section-number {
			min-width: 36px;
			height: 36px;
			font-size: 0.9rem;
		}

		.timeline-item {
			grid-template-columns: 1fr;
			gap: 0.8rem;
		}

		.timeline-date {
			width: fit-content;
		}

		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}

		.image-row {
			grid-template-columns: 1fr;
			gap: 0.8rem;
		}

		.page-number {
			width: 36px;
			height: 36px;
			font-size: 0.85rem;
		}

		.bottom-nav {
			flex-direction: column;
			gap: 0.8rem;
		}

		.nav-link.next {
			margin-left: 0;
		}

		.nav-link {
			min-width: auto;
			width: 100%;
			font-size: 0.9rem;
		}
	}
</style>
