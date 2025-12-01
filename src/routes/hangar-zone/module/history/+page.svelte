<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { searchQuery, showSearchModal, performSearch } from '$lib/stores/searchStore';
	import { MODULE_CONTENT } from '$lib/data/searchContent';
	import SearchModal from '$lib/components/SearchModal.svelte';
	
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
	
	function goToPage(pageNum: number) {
		if (pageNum >= 1 && pageNum <= totalPages) {
			goto(`/hangar-zone/module/history?page=${pageNum}`);
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
</script>

<!-- Page Container -->
<div class="page-container">
	<SearchModal />
	
	<!-- Header Section -->
	<div class="header-section">
		<h1 class="module-title">LEARNING MODULE 01: HISTORY OF GAS TURBINE ENGINES</h1>
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
	<div class="content-sections">
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
					<li>Isaac Newton's Third Law of Motion states that for every force acting on a body, there is an opposite and equal reaction.</li>
					<li>Jet propulsion is the force which is generated in the opposite direction to that of a discharge of fluid under pressure, escaping through an opening.</li>
					<li>Whatever form the device utilizes for jet propulsion, it is essentially a reaction engine that operates according to Sir Isaac Newton's Third Law of Motion.</li>
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
						<p>The history of mechanical jet propulsion began in 1900, when <strong>Dr. Sanford Moss</strong> applied some of his concepts in the development of the turbo-supercharger. This unique supercharger consisted of a small turbine wheel that was driven by exhaust gases. The turbine was then used to drive a supercharger.</p>
						<p>Research done by Dr. Moss influenced Frank Whittle of England in the development of what became the first successful turbojet engine.</p>
					</div>
				</div>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 2: Modern Development (1930-1941) -->
	{#if currentPage === 2}
	<div class="content-sections">
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
	<div class="content-sections">
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
	<div class="content-sections">
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

	<!-- Pagination Controls -->
	<div class="pagination-controls">
		<!-- Previous Button -->
		<button 
			class="pagination-button prev" 
			on:click={prevPage}
			disabled={currentPage === 1}
			aria-label="Previous Page"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6"/>
			</svg>
			<span>Previous</span>
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

		<!-- Next Button -->
		<button 
			class="pagination-button next" 
			on:click={nextPage}
			disabled={currentPage === totalPages}
			aria-label="Next Page"
		>
			<span>Next</span>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</button>
	</div>

	<!-- Bottom Navigation -->
	<div class="bottom-nav">
		<button on:click={prevPage} class="nav-link prev">
			<span class="nav-arrow">←</span>
			<span>Previous: {currentPage === 1 ? 'Hangar Zone' : `Page ${currentPage - 1}`}</span>
		</button>
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
		padding: 6rem 2rem 4rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Header Section */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.module-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: 700;
		margin: 0;
		color: #0A1628;
		text-align: left;
		flex: 1;
	}

	/* Search Container */
	.search-container {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 25px;
		padding: 0.5rem 1rem;
		min-width: 280px;
		transition: all 0.3s ease;
	}

	.search-container:focus-within {
		border-color: var(--font-accent-cyan, #00CED1);
		box-shadow: 0 0 20px rgba(0, 206, 209, 0.3);
	}

	.search-input {
		background: transparent;
		border: none;
		outline: none;
		color: var(--font-primary, #E8F4FA);
		font-size: 1rem;
		flex: 1;
		padding: 0.5rem;
	}

	.search-input::placeholder {
		color: rgba(232, 244, 250, 0.5);
	}

	.search-button {
		background: transparent;
		border: none;
		color: var(--font-accent-cyan, #00CED1);
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.search-button:hover {
		color: var(--ui-yellow, #FFD966);
	}

	/* Content Sections */
	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.content-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 24px;
		padding: 0;
		transition: all 0.4s ease;
		overflow: hidden;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
	}

	.content-card:hover {
		border-color: rgba(0, 206, 209, 0.6);
		box-shadow: 0 12px 48px rgba(0, 206, 209, 0.2), 
		            0 0 60px rgba(0, 206, 209, 0.1);
		transform: translateY(-6px);
	}

	.section-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #0A1628;
		background: linear-gradient(135deg, rgba(0, 206, 209, 0.12) 0%, rgba(255, 255, 255, 0.95) 50%);
		padding: 1.5rem 2rem;
		border-bottom: 3px solid var(--font-accent-cyan, #00CED1);
		box-shadow: 0 2px 8px rgba(0, 206, 209, 0.15);
		position: relative;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 4px;
		background: linear-gradient(180deg, var(--ui-yellow, #FFD966), var(--font-accent-cyan, #00CED1));
	}

	.section-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 50px;
		height: 50px;
		background: linear-gradient(135deg, var(--font-accent-cyan, #00CED1), var(--ui-light-blue, #87CEEB));
		border-radius: 12px;
		font-size: 1.25rem;
		font-weight: 900;
		color: var(--ui-dark-blue, #0A1628);
		box-shadow: 0 4px 12px rgba(0, 206, 209, 0.4);
		text-shadow: none;
		-webkit-text-fill-color: var(--ui-dark-blue, #0A1628);
	}

	.section-content {
		color: #1a2332;
		line-height: 2;
		padding: 2.5rem;
		font-size: 1.05rem;
	}

	.section-content p {
		color: #2d3f66;
		margin-bottom: 1.5rem;
	}

	.section-content strong {
		color: #0A1628;
		font-weight: 700;
	}

	/* Image Placeholder */
	.image-placeholder {
		background: linear-gradient(135deg, rgba(0, 206, 209, 0.08), rgba(135, 206, 235, 0.05));
		border: 3px solid rgba(0, 206, 209, 0.25);
		border-radius: 16px;
		padding: 2.5rem;
		margin: 2.5rem 0;
		min-height: 250px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: all 0.3s ease;
		position: relative;
	}

	.image-placeholder::before {
		position: absolute;
		top: 1rem;
		left: 1.5rem;
		font-size: 0.9rem;
		color: #00838F;
		font-weight: 600;
		opacity: 0.7;
		background: rgba(255, 255, 255, 0.8);
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
	}

	.image-placeholder:hover {
		border-color: rgba(0, 206, 209, 0.5);
		box-shadow: 0 8px 24px rgba(0, 206, 209, 0.2);
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
		gap: 2rem;
		margin: 2rem 0;
	}

	.image-row img {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(0, 206, 209, 0.2);
		transition: all 0.3s ease;
	}

	.image-row img:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 32px rgba(0, 206, 209, 0.3);
		border-color: rgba(0, 206, 209, 0.4);
	}

	/* Two Column Layout - Text and Diagram */
	.two-column-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: start;
		margin: 2rem 0;
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
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(0, 206, 209, 0.2);
		transition: all 0.3s ease;
	}

	.diagram-column img:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 32px rgba(0, 206, 209, 0.3);
		border-color: rgba(0, 206, 209, 0.4);
	}

	/* Bullet List */
	.bullet-list {
		list-style: none;
		padding: 0;
		margin: 2rem 0;
	}

	.bullet-list li {
		position: relative;
		padding-left: 2.5rem;
		margin-bottom: 1.5rem;
		font-size: 1.05rem;
		line-height: 1.9;
		color: #2d3f66;
	}

	.bullet-list li::before {
		content: "▸";
		position: absolute;
		left: 0;
		top: 0.1rem;
		color: var(--font-accent-cyan, #00CED1);
		font-size: 1.4rem;
		font-weight: bold;
		text-shadow: 0 0 10px rgba(0, 206, 209, 0.3);
	}

	/* Timeline */
	.timeline-item {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(0, 206, 209, 0.2);
	}

	.timeline-item:last-child {
		border-bottom: none;
	}

	.timeline-date {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #0A1628;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(255, 217, 102, 0.3), rgba(255, 217, 102, 0.15));
		border-left: 4px solid #FFD966;
		border-radius: 8px;
		height: fit-content;
		box-shadow: 0 2px 8px rgba(255, 217, 102, 0.2);
	}

	.timeline-content p {
		margin: 0 0 1rem 0;
		color: #2d3f66;
	}

	.highlight-text {
		font-weight: 600;
		color: #00838F;
		font-style: italic;
		background: rgba(0, 206, 209, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	/* Subsections */
	.subsection {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(0, 206, 209, 0.1);
	}

	.subsection:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.subsection-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #0A1628;
		margin: 0 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid rgba(255, 217, 102, 0.3);
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
		padding-left: 3rem;
		margin-bottom: 1.5rem;
		counter-increment: item;
		font-size: 1.05rem;
		line-height: 1.9;
		color: #2d3f66;
	}

	.numbered-list li::before {
		content: counter(item);
		position: absolute;
		left: 0;
		top: 0;
		width: 2rem;
		height: 2rem;
		background: linear-gradient(135deg, var(--font-accent-cyan, #00CED1), var(--ui-light-blue, #87CEEB));
		color: #0A1628;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.875rem;
		box-shadow: 0 2px 8px rgba(0, 206, 209, 0.3);
	}

	/* Engine Types */
	.engine-type {
		margin-bottom: 2.5rem;
		padding: 1.5rem 2rem;
		background: linear-gradient(135deg, rgba(0, 206, 209, 0.08), rgba(135, 206, 235, 0.05));
		border-radius: 12px;
		border-left: 5px solid var(--font-accent-cyan, #00CED1);
		box-shadow: 0 2px 8px rgba(0, 206, 209, 0.1);
	}

	.engine-type:last-child {
		margin-bottom: 0;
	}

	.engine-type-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #0A1628;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Pagination Controls */
	.pagination-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin: 3rem 0;
		flex-wrap: wrap;
	}

	.pagination-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 12px;
		color: #0A1628;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.pagination-button:not(:disabled):hover {
		border-color: var(--font-accent-cyan, #00CED1);
		background: rgba(0, 206, 209, 0.15);
		box-shadow: 0 4px 20px rgba(0, 206, 209, 0.3);
		transform: translateY(-2px);
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination-button svg {
		color: var(--font-accent-cyan, #00CED1);
	}

	.page-numbers {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-number {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 50%;
		color: #0A1628;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.page-number:hover {
		border-color: var(--font-accent-cyan, #00CED1);
		background: rgba(0, 206, 209, 0.15);
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 206, 209, 0.3);
	}

	.page-number.active {
		background: linear-gradient(135deg, var(--font-accent-cyan, #00CED1), var(--ui-light-blue, #87CEEB));
		border-color: var(--font-accent-cyan, #00CED1);
		color: #FFFFFF;
		box-shadow: 0 4px 20px rgba(0, 206, 209, 0.5);
		transform: scale(1.15);
		font-weight: 700;
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 2px solid rgba(0, 206, 209, 0.2);
		flex-wrap: wrap;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(0, 206, 209, 0.3);
		border-radius: 12px;
		color: #0A1628;
		font-weight: 600;
		transition: all 0.3s ease;
		min-width: 200px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.nav-link:not(:disabled):hover {
		border-color: var(--font-accent-cyan, #00CED1);
		background: rgba(0, 206, 209, 0.15);
		box-shadow: 0 4px 20px rgba(0, 206, 209, 0.3);
		transform: translateY(-2px);
	}

	.nav-link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.nav-link.prev {
		justify-content: flex-start;
	}

	.nav-link.next {
		justify-content: flex-end;
		margin-left: auto;
	}

	.nav-arrow {
		font-size: 1.5rem;
		color: var(--font-accent-cyan, #00CED1);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.image-row {
			grid-template-columns: 1fr;
			gap: 1.5rem;
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
			font-size: 1.35rem;
			padding: 1.25rem 1.5rem;
			gap: 1rem;
		}

		.section-number {
			min-width: 40px;
			height: 40px;
			font-size: 1rem;
		}

		.timeline-item {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.timeline-date {
			width: fit-content;
		}

		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.image-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.pagination-controls {
			gap: 1rem;
		}

		.pagination-button {
			padding: 0.6rem 1rem;
			font-size: 0.9rem;
		}

		.pagination-button span {
			display: none;
		}

		.pagination-button svg {
			margin: 0;
		}

		.page-number {
			width: 40px;
			height: 40px;
			font-size: 0.9rem;
		}

		.bottom-nav {
			flex-direction: column;
			gap: 1rem;
		}

		.nav-link.next {
			margin-left: 0;
		}

		.nav-link {
			min-width: auto;
			width: 100%;
			font-size: 0.95rem;
		}
	}
</style>
