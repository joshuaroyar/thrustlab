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
			class="animate-gradient-flash font-heading mb-6 bg-gradient-to-r from-yellow-400 via-cyan-400 to-yellow-400 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-xl md:text-7xl"
		>
			Hangar Zone
		</h1>
		<p
			class="font-body mx-auto max-w-3xl text-justify text-xl leading-relaxed font-bold text-slate-200 md:text-justify md:text-2xl"
		>
			Welcome to the Hangar Zone, a learning space where students journey through the history and
			evolution of gas turbine engines. Here, they'll discover how these powerful machines have
			developed over time—from early designs to the advanced engines that power today's
			aircraft—building a strong foundation for deeper exploration ahead.
		</p>
	</div>

	<div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/hangar-zone/module/history"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/90 hover:shadow-2xl"
		>
			<div class="relative z-10 flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-sky-400/80 uppercase"
					>LEARNING</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-white uppercase"
					>MODULE 01:</span
				>
				<h3
					class="font-heading bg-gradient-to-r from-white to-sky-200 bg-clip-text text-3xl leading-tight font-black tracking-wide text-transparent uppercase md:text-4xl"
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
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/90 hover:shadow-2xl"
		>
			<div class="relative z-10 flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-sky-400/80 uppercase"
					>LEARNING</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-white uppercase"
					>MODULE 02:</span
				>
				<h3
					class="font-heading bg-gradient-to-r from-white to-sky-200 bg-clip-text text-3xl leading-tight font-black tracking-wide text-transparent uppercase md:text-4xl"
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
