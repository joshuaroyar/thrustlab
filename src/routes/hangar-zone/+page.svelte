<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('zone-hangar');

		// Safety: Ensure scrolling is enabled when page loads
		if (typeof document !== 'undefined') {
			document.body.classList.remove('page-transitioning');
			document.body.style.removeProperty('overflow');
			document.documentElement.style.removeProperty('overflow');
			console.log('Hangar Zone mounted - scroll enabled');
		}

		return () => {
			document.body.classList.remove('zone-hangar');
			// Safety: Ensure scroll remains enabled on cleanup
			if (typeof document !== 'undefined') {
				document.body.style.removeProperty('overflow');
				document.documentElement.style.removeProperty('overflow');
			}
		};
	});
</script>

<div class="relative z-10 mx-auto min-h-screen max-w-7xl px-4 pt-32 pb-24 md:px-8 md:pt-40">
	<div class="mb-12 text-center">
		<h1
			class="animate-gradient-flash font-heading mb-6 bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-300 bg-clip-text pb-4 text-6xl font-black tracking-tight text-transparent drop-shadow-[0_0_25px_rgba(14,165,233,0.6)] md:text-8xl"
		>
			Hangar Zone
		</h1>
		<p
			class="mx-auto max-w-[900px] text-center text-xl leading-relaxed font-bold text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-2xl"
			style="font-family: 'Gotham', 'Gotham Bold', sans-serif;"
		>
			Welcome to the Hangar Zone, a <span class="text-sky-400"
				>learning space where students journey through the history and evolution of gas turbine
				engines</span
			>. Here, they'll discover how these powerful machines have developed over time—from early
			designs to the advanced engines that power today's aircraft—building a strong foundation for
			deeper exploration ahead.
		</p>
	</div>

	<div class="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/hangar-zone/module/history"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] border-2 border-white/10 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD966] hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(255,217,102,0.4)]"
		>
			<div class="relative z-10 flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-sky-400/80 uppercase"
					>LEARNING</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-white uppercase"
					>MODULE 01:</span
				>
				<h3
					class="font-heading animate-gradient-flash bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-300 bg-clip-text text-2xl leading-tight font-black tracking-wide text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-3xl"
				>
					HISTORY OF<br />GAS TURBINE<br />ENGINES
				</h3>
			</div>
			<div
				class="absolute right-6 bottom-6 text-yellow-400 opacity-60 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100"
			>
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</div>
		</a>

		<a
			href="/hangar-zone/module/types"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] border-2 border-white/10 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD966] hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(255,217,102,0.4)]"
		>
			<div class="relative z-10 flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-sky-400/80 uppercase"
					>LEARNING</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-white uppercase"
					>MODULE 02:</span
				>
				<h3
					class="font-heading animate-gradient-flash bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-300 bg-clip-text text-2xl leading-tight font-black tracking-wide text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-3xl"
				>
					TYPES OF GAS<br />TURBINE<br />ENGINES
				</h3>
			</div>
			<div
				class="absolute right-6 bottom-6 text-yellow-400 opacity-60 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100"
			>
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</div>
		</a>
	</div>
</div>

<style>
	/* Keep page-entry animation if needed, or rely on global styles */
</style>
