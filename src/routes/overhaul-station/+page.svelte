<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		document.body.classList.add('zone-overhaul');

		// Safety: Ensure scrolling is enabled when page loads
		if (typeof document !== 'undefined') {
			document.body.classList.remove('page-transitioning');
			document.body.style.removeProperty('overflow');
			document.documentElement.style.removeProperty('overflow');
			console.log('Overhaul Station mounted - scroll enabled');
		}

		return () => {
			document.body.classList.remove('zone-overhaul');
			// Safety: Ensure scroll remains enabled on cleanup
			if (typeof document !== 'undefined') {
				document.body.style.removeProperty('overflow');
				document.documentElement.style.removeProperty('overflow');
			}
		};
	});
</script>

<!-- Page Content -->
<div
	class="animate-on-scroll relative z-10 mx-auto min-h-screen max-w-[1400px] px-4 pt-32 pb-24 md:px-8 md:pt-40 md:pb-16"
>
	<div class="mb-12 text-center md:px-4">
		<h1
			class="animate-gradient-flash font-heading mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_4px_10px_rgba(255,191,0,0.4)] md:text-8xl"
		>
			Overhaul Station
		</h1>
		<p
			class="mx-auto mb-8 max-w-[900px] text-center text-xl leading-relaxed font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-2xl"
			style="font-family: 'Gotham', 'Gotham Bold', sans-serif;"
		>
			Welcome to the Test Bay, where learning turns into a challenge. Here, students face
			<span class="text-cyan-400"
				>interactive assessments designed to gauge their understanding</span
			> of the Hangar Zone, Turbofan Engine Zone, and Overhaul Bay. It's not just an activity—it's a test
			of mastery, confidence, and readiness to take flight.
		</p>
	</div>

	<div class="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/overhaul-station/preliminary-module"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[25px] border-2 border-white/50 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD966] hover:bg-white hover:shadow-[0_0_20px_rgba(255,217,102,0.4)]"
		>
			<div class="relative z-[2] flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-[#1b3558] uppercase"
					>LABORATORY</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-[#222831] uppercase"
					>MODULE:</span
				>
				<h3
					class="font-heading animate-gradient-flash mt-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-3xl leading-tight font-black tracking-wide text-transparent uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:text-4xl"
				>
					PRELIMINARY<br />LABORATORY<br />MODULE
				</h3>
			</div>
			<div
				class="absolute right-6 bottom-6 z-[2] text-[#FFD966] transition-transform duration-300 group-hover:translate-x-2"
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
			href="/overhaul-station/assembly-disassembly"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[25px] border-2 border-white/50 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD966] hover:bg-white hover:shadow-[0_0_20px_rgba(255,217,102,0.4)]"
		>
			<div class="relative z-[2] flex flex-col items-center gap-2">
				<span class="font-heading text-xl font-extrabold tracking-widest text-[#1b3558] uppercase"
					>ACTIVITY</span
				>
				<span class="font-heading mb-1 text-2xl font-black tracking-wider text-[#222831] uppercase"
					>MODULE:</span
				>
				<h3
					class="font-heading animate-gradient-flash mt-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-3xl leading-tight font-black tracking-wide text-transparent uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:text-3xl"
				>
					ASSEMBLY &<br />DISASSEMBLY ACTIVITY
				</h3>
			</div>
			<div
				class="absolute right-6 bottom-6 z-[2] text-[#FFD966] transition-transform duration-300 group-hover:translate-x-2"
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
