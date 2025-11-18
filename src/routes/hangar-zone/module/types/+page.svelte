<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let searchQuery = '';
	const totalPages = 4; // 9 sections divided into 4 pages
	
	// Reactive statement to get current page from URL
	$: currentPage = parseInt($page.url.searchParams.get('page') || '1');
	
	// Ensure currentPage is within valid range
	$: if (currentPage < 1) currentPage = 1;
	$: if (currentPage > totalPages) currentPage = totalPages;
	
	function handleSearch() {
		if (searchQuery.trim()) {
			console.log('Searching for:', searchQuery);
		}
	}
	
	function goToPage(pageNum: number) {
		if (pageNum >= 1 && pageNum <= totalPages) {
			goto(`/hangar-zone/module/types?page=${pageNum}`);
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
</script>

<!-- Page Container -->
<div class="page-container">
	<!-- Header Section -->
	<div class="header-section">
		<h1 class="module-title">LEARNING MODULE 02: TYPES OF GAS TURBINE ENGINES</h1>
		<div class="search-container">
			<input 
				type="text" 
				placeholder="Looking for something?" 
				bind:value={searchQuery}
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
	<div class="content-sections">
		<!-- Section 1: TURBO JET -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">01</span>
				TURBO JET
			</h2>
			<div class="section-content">
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/1_1.png" alt="Turbojet Engine Diagram 1" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/1_2.png" alt="Turbojet Engine Diagram 2" />
					</div>
				</div>
				<p class="intro-text">The basic operating principles of a turbojet engine are relatively straight forward:</p>
				<ul class="bullet-list">
					<li>Air is compressed in the compressor, burned in the combustion chamber, expands and spins the turbine, which in turn drives the compressor (self-sustaining), and leaves the exhaust at high velocities.</li>
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
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/2_1.png" alt="Airflow Through Turbojet 1" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/2_2.png" alt="Airflow Through Turbojet 2" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/2_3.png" alt="Airflow Through Turbojet 3" />
					</div>
				</div>
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
	<div class="content-sections">
		<!-- Section 3: TURBOPROP -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">03</span>
				TURBOPROP
			</h2>
			<div class="section-content">
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/3_1.png" alt="Turboprop Engine Diagram 1" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/3_2.png" alt="Turboprop Engine Diagram 2" />
					</div>
				</div>
				<ul class="bullet-list">
					<li>A gas turbine engine that delivers power to a propeller is referred to as a turboprop engine.</li>
					<li>Turboprop engines are similar in design to turbojet engines except that the power produced by a turboprop engine is delivered to a reduction gear system that spins a propeller</li>
					<li>Reduction gearing is necessary in turboprop engines because optimum propeller performance is achieved at much slower speeds than the engine's operating rpm.</li>
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
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/4_1.png" alt="Turboprop Parameters Diagram 1" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/4_2.png" alt="Turboprop Parameters Diagram 2" />
					</div>
				</div>
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
	<div class="content-sections">
		<!-- Section 5: TURBOSHAFT -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">05</span>
				TURBOSHAFT
			</h2>
			<div class="section-content">
				<div class="two-column-layout">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/5.png" alt="Turboshaft Engine" />
					</div>
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
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/6_1.png" alt="Airflow Through Turboshaft 1" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/6_2.png" alt="Airflow Through Turboshaft 2" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/6_3.png" alt="Airflow Through Turboshaft 3" />
					</div>
				</div>
				<ul class="bullet-list">
					<li>A gas turbine engine that delivers power to a shaft that can drive something else is referred to as a turboshaft engine.</li>
					<li>In addition, turboshaft engines are widely used as auxiliary power units and in industrial applications to drive electrical generators and surface transportation systems.</li>
					<li>Output of a turboprop or turboshaft engine is measured by shaft horsepower rather than thrust.</li>
				</ul>
			</div>
		</section>
	</div>
	{/if}

	<!-- Content Sections - Page 4 -->
	{#if currentPage === 4}
	<div class="content-sections">
		<!-- Section 7: TURBOPROP AND TURBOSHAFT -->
		<section class="content-card">
			<h2 class="section-title">
				<span class="section-number">07</span>
				TURBOPROP AND TURBOSHAFT
			</h2>
			<div class="section-content">
				<ul class="bullet-list">
					<li>Most turboshaft engine incorporates a free power turbine.</li>
					<li>Single spool, turboshaft engine has a reverse flow combustion chamber system allowing it to be shorter, stiffer, and lighter. It does however add the requirement for a centrifugal compressor to be used in the high-pressure stage. This throws the air out radially so that it can enter the combustion chamber in the correct direction.</li>
				</ul>
				<div class="image-placeholder">
					<img src="/images/hangar-zone/types/9_1.png" alt="Airflow Diagram 1" />
				</div>
				<div class="image-placeholder">
					<img src="/images/hangar-zone/types/9_2.png" alt="Airflow Diagram 2" />
				</div>
				<div class="two-column-layout">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/10.png" alt="Turbine System" />
					</div>
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
				<div class="image-placeholder">
					<img src="/images/hangar-zone/types/11.png" alt="Turboprop and Turboshaft Comparison" />
				</div>
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
				<div class="image-row">
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/12_1.png" alt="Ducted Prop Fan" />
					</div>
					<div class="image-placeholder">
						<img src="/images/hangar-zone/types/12_2.png" alt="Unducted Prop Fan" />
					</div>
				</div>
				<ul class="bullet-list">
					<li>These new designs utilize titanium, lightweight stainless steel, and composite materials to surpass the fuel economy of several high bypass turbofan engines by more than 15 percent.</li>
					<li>The use of composite blades reduces weight and allows safe operation at tip speeds higher than conventional blades.</li>
					<li>Another design encases the propfan in a conventional cowl-type inlet which can achieve Mach 0.9. These engines are known as <strong>ducted ultra high bypass engines</strong>.</li>
				</ul>
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
			<span>Previous: {currentPage === 1 ? 'History of Gas Turbine Engines' : `Page ${currentPage - 1}`}</span>
		</button>
		<button on:click={nextPage} class="nav-link next">
			<span>Next: {currentPage === totalPages ? 'Turbofan Zone' : `Page ${currentPage + 1}`}</span>
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
		padding: 7rem 2rem 5rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Header Section */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4rem;
		gap: 2rem;
		flex-wrap: wrap;
		padding-bottom: 2rem;
		border-bottom: 2px solid rgba(0, 206, 209, 0.2);
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

	.intro-text {
		font-size: 1.2rem;
		margin-bottom: 1.75rem;
		font-weight: 600;
		color: #0A1628;
		line-height: 1.9;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(0, 206, 209, 0.15);
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

	.bullet-list li strong {
		color: #0A1628;
		font-weight: 700;
	}

	/* Definition Box */
	.definition-box {
		background: linear-gradient(135deg, rgba(255, 217, 102, 0.2) 0%, rgba(255, 217, 102, 0.1) 100%);
		border-left: 5px solid var(--ui-yellow, #FFD966);
		border-radius: 12px;
		padding: 1.5rem 2rem;
		margin: 2rem 0;
		box-shadow: 0 4px 16px rgba(255, 217, 102, 0.15);
		position: relative;
		overflow: hidden;
	}

	.definition-box::before {
		content: '📌';
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 2rem;
		opacity: 0.2;
	}

	.definition-box strong {
		color: #0A1628;
		font-size: 1.15rem;
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

	/* Image Row - Multiple images side by side */
	.image-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.image-row .image-placeholder {
		margin: 0;
		min-height: 200px;
	}

	.image-row .image-placeholder img {
		max-width: 90%;
	}

	/* Two Column Layout - Image on left, text on right */
	.two-column-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
		margin: 2rem 0;
	}

	.two-column-layout .image-placeholder {
		margin: 0;
		min-height: 300px;
	}

	.two-column-layout .image-placeholder img {
		max-width: 100%;
	}

	.two-column-layout .bullet-list {
		margin: 0;
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
	@media (max-width: 768px) {
		.page-container {
			padding: 5rem 1.25rem 3rem;
		}

		.header-section {
			flex-direction: column;
			align-items: flex-start;
			margin-bottom: 3rem;
		}

		.module-title {
			font-size: clamp(1.25rem, 5vw, 2rem);
		}

		.search-container {
			width: 100%;
		}

		.content-sections {
			gap: 2rem;
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

		.section-content {
			padding: 2rem 1.5rem;
			font-size: 1rem;
		}

		.intro-text {
			font-size: 1.1rem;
		}

		.bullet-list li {
			font-size: 1rem;
			padding-left: 2rem;
			margin-bottom: 1.25rem;
		}

		.definition-box {
			padding: 1.25rem 1.5rem;
			margin: 1.5rem 0;
		}

		.image-placeholder {
			padding: 2rem 1.5rem;
			min-height: 200px;
		}

		.image-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.two-column-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.two-column-layout .image-placeholder {
			min-height: 200px;
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

	/* Large Desktop Optimization */
	@media (min-width: 1440px) {
		.page-container {
			max-width: 1600px;
		}

		.section-title {
			font-size: 2rem;
		}

		.section-content {
			font-size: 1.1rem;
			line-height: 2.1;
		}

		.bullet-list li {
			font-size: 1.1rem;
		}
	}
</style>
