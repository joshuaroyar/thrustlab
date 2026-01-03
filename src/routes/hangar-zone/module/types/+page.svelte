<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import { searchQuery, showSearchModal, performSearch } from '$lib/stores/searchStore';
	import { MODULE_CONTENT } from '$lib/data/searchContent';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import ImageModal from '$lib/components/ui/ImageModal.svelte';
	import ImageGrid from '$lib/components/ui/ImageGrid.svelte';
	
	const totalPages = 4; // 9 sections divided into 4 pages
	
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
			goto(`/hangar-zone/module/types?page=${pageNum}`);
			scrollToTop();
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			goToPage(currentPage + 1);
		} else {
			goto('/turbofan-engine');
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		} else {
			goto('/hangar-zone/module/history');
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
		<h1 class="module-title gradient-animated">LEARNING MODULE 02: TYPES OF GAS TURBINE ENGINES</h1>
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

	<!-- Content Sections - Page 1 -->
	{#if currentPage === 1}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 1: TURBO JET -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">01</span>
				TURBO JET
			</h2>
			<div class="section-content">
				<ImageGrid
					images={[
						{ src: '/images/hangar-zone/types/1_1.png', alt: 'Turbojet Engine Diagram 1' },
						{ src: '/images/hangar-zone/types/1_2.png', alt: 'Turbojet Engine Diagram 2' }
					]}
					columns={2}
					height="260px"
				/>
				<p class="intro-text">The basic operating principles of a turbojet engine are relatively straight forward:</p>
				<ul class="bullet-list">
					<li>Air is compressed in the <strong>compressor</strong>, burned in the <strong>combustion chamber</strong>, expands and spins the <strong>turbine</strong>, which in turn drives the compressor (self-sustaining), and leaves the exhaust at high velocities.</li>
					<li>The difference in velocity in the inlet and exit produces thrust.</li>
				</ul>
				<div class="definition-box">
					<strong>EPR</strong> – engine pressure ratio, which is the ratio of turbine discharge pressure to the inlet air pressure
				</div>
			</div>
		</section>

		<!-- Section 2: AIRFLOW THROUGH TURBOJET -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">02</span>
				AIRFLOW THROUGH TURBOJET
			</h2>
			<div class="section-content">
				<ImageGrid
					images={[
						{ src: '/images/hangar-zone/types/2_1.png', alt: 'Airflow Through Turbojet 1' },
						{ src: '/images/hangar-zone/types/2_2.png', alt: 'Airflow Through Turbojet 2' },
						{ src: '/images/hangar-zone/types/2_3.png', alt: 'Airflow Through Turbojet 3' }
					]}
					columns={3}
					height="220px"
				/>
				<ul class="bullet-list">
					<li>When a compressor and turbine are joined on one shaft, the unit is called a 'spool'.</li>
					<li>From the compressor, the air is fed directly into the combustion chambers. Fuel is added and the resulting mixture is ignited. The resultant increase in temperature causes a substantial increase in volume.</li>
					<li>The energy required to drive the compressor is extracted from the stream as it passes through the turbine. The remaining energy in the gas stream acts as thrust as the gases pass to atmosphere via the end of the jet pipe.</li>
				</ul>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 2 -->
	{#if currentPage === 2}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 3: TURBOPROP -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">03</span>
				TURBOPROP
			</h2>
			<div class="section-content">
				<ImageGrid
					images={[
						{ src: '/images/hangar-zone/types/3_1.png', alt: 'Turboprop Engine Diagram 1' },
						{ src: '/images/hangar-zone/types/3_2.png', alt: 'Turboprop Engine Diagram 2' }
					]}
					columns={2}
					height="260px"
				/>
				<ul class="bullet-list">
					<li>A gas turbine engine that delivers power to a propeller is referred to as a <strong>turboprop engine</strong>.</li>
					<li>Turboprop engines are similar in design to turbojet engines except that the power produced by a turboprop engine is delivered to a <strong>reduction gear system</strong> that spins a propeller</li>
					<li><strong>Reduction gearing</strong> is necessary in turboprop engines because optimum propeller performance is achieved at much slower speeds than the engine's operating rpm.</li>
				</ul>
			</div>
		</section>

		<!-- Section 4: TURBOPROP PARAMETERS -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">04</span>
				TURBOPROP PARAMETERS
			</h2>
			<div class="section-content">
				<ImageGrid
					images={[
						{ src: '/images/hangar-zone/types/4_1.png', alt: 'Turboprop Parameters Diagram 1' },
						{ src: '/images/hangar-zone/types/4_2.png', alt: 'Turboprop Parameters Diagram 2' }
					]}
					columns={2}
					height="260px"
				/>
				<ul class="bullet-list">
					<li>The output from a turboprop engine is the sum of the shaft horsepower developed at the turbine, and the residual jet thrust. This is called <strong>Equivalent Shaft Horsepower</strong> or <strong>ESHP.</strong></li>
					<li>In turboprop, almost all the energy in the gas stream is converted into mechanical power, to drive both the compressor and the propeller.</li>
				</ul>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 3 -->
	{#if currentPage === 3}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 5: TURBOSHAFT -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">05</span>
				TURBOSHAFT
			</h2>
			<div class="section-content">
				<div class="two-column-layout">
					<ImageGrid images={[{ src: '/images/hangar-zone/types/5.png', alt: 'Turboshaft Engine' }]} columns={1} height="320px" />
					<ul class="bullet-list">
						<li>Turboprop engines are used extensively in business and commuter type aircraft because the combination of jet power and propeller efficiency provides good performance characteristics at speeds between 300 and 400 miles per hour.</li>
						<li>In addition, most turboprop engines provide the best specific fuel consumption of any gas turbine engine.</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Section 6: AIRFLOW THROUGH TURBOSHAFT -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">06</span>
				AIRFLOW THROUGH TURBOSHAFT
			</h2>
			<div class="section-content">
				<ImageGrid images={[
					{ src: '/images/hangar-zone/types/6_1.png', alt: 'Airflow Through Turboshaft 1' },
					{ src: '/images/hangar-zone/types/6_2.png', alt: 'Airflow Through Turboshaft 2' },
					{ src: '/images/hangar-zone/types/6_3.png', alt: 'Airflow Through Turboshaft 3' }
				]} columns={3} height="220px" />
				<ul class="bullet-list">
					<li>A gas turbine engine that delivers power to a shaft that can drive something else is referred to as a <strong>turboshaft engine</strong>.</li>
					<li>In addition, turboshaft engines are widely used as auxiliary power units and in industrial applications to drive electrical generators and surface transportation systems.</li>
					<li>Output of a turboprop or turboshaft engine is measured by <strong>shaft horsepower</strong> rather than thrust.</li>
				</ul>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 4 -->
	{#if currentPage === 4}
	<div class="content-sections" in:fly={{ y: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
		<!-- Section 7: TURBOPROP AND TURBOSHAFT -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">07</span>
				TURBOPROP AND TURBOSHAFT
			</h2>
			<div class="section-content">
				<div class="two-column-layout">
					<div class="left-column">
						<ul class="bullet-list">
							<li>Most turboshaft engine incorporates a free power turbine.</li>
							<li>Single spool, turboshaft engine has a reverse flow combustion chamber system allowing it to be shorter, stiffer, and lighter. It does however add the requirement for a centrifugal compressor to be used in the high-pressure stage. This throws the air out radially so that it can enter the combustion chamber in the correct direction.</li>
						</ul>
					</div>
					<div class="right-column stacked-images">
						<ImageGrid images={[
							{ src: '/images/hangar-zone/types/9_1.png', alt: 'Airflow Diagram 1' },
							{ src: '/images/hangar-zone/types/9_2.png', alt: 'Airflow Diagram 2' }
						]} columns={2} height="220px" gap="1rem" />
					</div>
				</div>
				<div class="two-column-layout">
					<ImageGrid images={[{ src: '/images/hangar-zone/types/10.png', alt: 'Turbine System' }]} columns={1} height="260px" />
					<ul class="bullet-list">
						<li>Airflow is similar to turbojet up to a point where it leaves the first stage turbine.</li>
						<li>The first stage turbine drives the compressor and the free power turbine converts any remaining energy to mechanical energy.</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Section 8: TURBOPROP AND TURBOSHAFT (continued) -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">08</span>
				TURBOPROP AND TURBOSHAFT
			</h2>
			<div class="section-content">
				<ImageGrid images={[{ src: '/images/hangar-zone/types/11.png', alt: 'Turboprop and Turboshaft Comparison' }]} columns={1} height="260px" />
				<ul class="bullet-list">
					<li>Both turboprop [TP] and turboshaft [TS] engines use a gas turbine core engine to drive an output power shaft for a propeller or helicopter rotor</li>
					<li>The main difference between the two variants is that a TP engine might also produce a fraction of its overall thrust via a hot core exhaust jet, while a conventional TS engine will have a lower exhaust velocity but correspondingly somewhat higher shaft power as the tradeoff</li>
					<li>TPs commonly employ a free power turbine to drive the speed reduction gear that in turn drives the propeller at a lower rotation speed. This is typically also true for TS engines, in driving the main rotor at a significantly lower rotation speed.</li>
				</ul>
			</div>
		</section>

		<!-- Section 9: DUCTED AND UNDUCTED PROP FAN -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">09</span>
				DUCTED AND UNDUCTED PROP FAN
			</h2>
			<div class="section-content">
				<ImageGrid images={[
					{ src: '/images/hangar-zone/types/12_1.png', alt: 'Ducted Prop Fan' },
					{ src: '/images/hangar-zone/types/12_2.png', alt: 'Unducted Prop Fan' }
				]} columns={2} height="260px" />
				<ul class="bullet-list">
					<li>These new designs utilize titanium, lightweight stainless steel, and composite materials to surpass the fuel economy of several high bypass turbofan engines by more than 15 percent.</li>
					<li>The use of composite blades reduces weight and allows safe operation at tip speeds higher than conventional blades.</li>
					<li>Another design encases the propfan in a conventional cowl-type inlet which can achieve Mach 0.9. These engines are known as <strong>ducted ultra high bypass engines</strong>.</li>
				</ul>
			</div>
		</section>
	</div>
	{/if}

	<!-- Pagination Controls (Hidden/Moved to Bottom Nav) -->
	<div class="pagination-controls" style="display: none;">
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
			<span>Previous: {currentPage === 1 ? 'History of Gas Turbine Engines' : `Page ${currentPage - 1}`}</span>
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
			<span>Next: {currentPage === totalPages ? 'Turbofan Engine' : `Page ${currentPage + 1}`}</span>
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
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl); /* standard padding */
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
		display: none;
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

	.intro-text {
		font-size: 1.1rem; /* Reduced from 1.2rem */
		margin-bottom: 1.5rem; /* Reduced from 1.75rem */
		font-weight: 600;
		color: #0A1628;
		line-height: 1.7; /* Reduced from 1.9 */
		padding: 0.8rem 0; /* Reduced from 1rem */
		border-bottom: 1px solid rgba(27, 53, 88, 0.15);
	}

	/* Definition Box */
	.definition-box {
		background: linear-gradient(135deg, rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.2) 0%, rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.1) 100%);
		border-left: 5px solid var(--navbar-accent, var(--ui-yellow));
		border-radius: 12px;
		padding: 1.25rem var(--card-padding-mobile); /* use mobile card padding for horizontal spacing */
		margin: 1.5rem 0; /* Reduced from 2rem */
		box-shadow: 0 4px 16px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.15);
		position: relative;
		overflow: hidden;
	}

	.definition-box::before {
		content: '📌';
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem; /* Reduced from 2rem */
		opacity: 0.2;
	}

	.definition-box strong {
		color: #0A1628;
		font-size: 1.05rem; /* Reduced from 1.15rem */
		font-weight: 700;
	}

	/* Image grid and placeholder styles are handled by ImageGrid component now. */

	/* Two Column Layout - Text and Diagram */
	.two-column-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem; /* Reduced gap */
		align-items: start;
		margin: 1.5rem 0;
	}

	/* right-column children use ImageGrid, no manual image-placeholder rules here. */

	/* Left/Right column helpers for specific layouts */
	.two-column-layout .left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.two-column-layout .right-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Stacked image sizes for right column */
	.right-column :global(img),
	.stacked-images :global(img) {
		width: 100%;
		height: 220px;
		object-fit: contain;
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
		color: var(--hangar-accent, #1b3558);
		font-size: 1.2rem; /* Reduced size */
		font-weight: bold;
		text-shadow: 0 0 10px rgba(27, 53, 88, 0.3);
	}

	/* Pagination Controls */
	.pagination-controls {
		display: none;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 2rem 0;
	}

	.pagination-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: transparent;
		border: none;
		color: #1a2b47;
		font-weight: 700;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pagination-button:hover:not(:disabled) {
		background: rgba(26, 43, 71, 0.1);
	}

	.pagination-button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.pagination-button span {
		display: none; /* Hide text labels */
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
		padding: 0.8rem 1.5rem; /* Reduced padding */
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(27, 53, 88, 0.3);
		border-radius: 10px;
		color: #0A1628;
		font-weight: 600;
		transition: all 0.3s ease;
		width: fit-content; /* Allow button to size to content */
		min-width: 180px; /* Reduced width */
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.nav-link:not(:disabled):hover {
		border-color: var(--hangar-accent, #1b3558);
		/* Keep background unchanged; add a colored glow and subtle lift */
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
		color: var(--hangar-accent, #1b3558);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		:global(.image-grid) {
			float: none;
			width: 100%;
			margin: 2rem 0;
		}

		/* On tablet and smaller, stack three-column rows into a single column */
		/* ImageGrid stacks to single column by default on smaller screens */

		/* ImageGrid handles responsive image heights */

		/* ImageGrid stacks two-column grids automatically */

		/* rely on ImageGrid for image sizing */

		/* layout is managed by ImageGrid component */
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

		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}

		:global(.image-grid) {
			grid-template-columns: 1fr;
			gap: 0.8rem;
		}

		.pagination-controls {
			gap: 0.8rem;
		}

		.pagination-button {
			padding: 0.5rem 0.8rem;
			font-size: 0.85rem;
		}

		.pagination-button span {
			display: none;
		}

		.pagination-button svg {
			margin: 0;
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
