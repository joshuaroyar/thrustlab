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
	class="relative z-10 mx-auto min-h-screen max-w-[1400px] px-4 pt-32 pb-24 md:px-8 md:pt-40 md:pb-16"
>
	<div class="mb-12 text-center md:px-4">
		<h1
			class="animate-gradient-flash font-heading mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_4px_10px_rgba(255,191,0,0.4)] md:text-8xl"
		>
			Overhaul Station
		</h1>
		<p
			class="mx-auto max-w-[900px] text-center text-xl leading-relaxed font-bold text-[#1b3558] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-2xl"
			style="font-family: 'Gotham', 'Gotham Bold', sans-serif;"
		>
			Step into the Overhaul Station, where hands-on learning takes flight. In this interactive
			zone, students <span class="text-[#5da8cb]"
				>dive into the intricate process of assembling and disassembling turbofan engine components</span
			>—gaining a deeper understanding of each part's role and the essential principles of gas
			turbine engine overhaul. It's where theory meets practice, transforming knowledge into
			real-world technical skill.
		</p>
	</div>

	<div class="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/overhaul-station/preliminary-module"
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] bg-[#1a2b47] p-8 text-center text-[#E8F4FA] shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-400 hover:-translate-y-2 hover:bg-[#16213e] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
		>
			<div class="relative z-[2] flex flex-col items-center gap-2">
				<span
					class="font-heading text-2xl leading-tight font-extrabold tracking-widest uppercase md:text-3xl"
					>LABORATORY</span
				>
				<span
					class="font-heading text-4xl leading-tight font-extrabold tracking-widest uppercase md:text-5xl"
					>MODULE:</span
				>
				<h3
					class="font-heading animate-gradient-flash mt-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-4xl leading-tight font-extrabold tracking-widest text-transparent uppercase md:text-4xl"
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
			class="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[30px] bg-[#1a2b47] p-8 text-center text-[#E8F4FA] shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-400 hover:-translate-y-2 hover:bg-[#16213e] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
		>
			<div class="relative z-[2] flex flex-col items-center gap-2">
				<span
					class="font-heading text-2xl leading-tight font-extrabold tracking-widest uppercase md:text-3xl"
					>ACTIVITY</span
				>
				<span
					class="font-heading text-4xl leading-tight font-extrabold tracking-widest uppercase md:text-5xl"
					>MODULE:</span
				>
				<h3
					class="font-heading animate-gradient-flash mt-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-4xl leading-tight font-extrabold tracking-widest text-transparent uppercase md:text-4xl"
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

<style>
	/* Removed custom CSS in favor of Tailwind */
</style>
