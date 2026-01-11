<script lang="ts">
	export let title: string;
	export let color: string = '#1b3558'; // Default to Hangar Zone styling
	export let textColor: string = 'text-white';
</script>

<h2
	class="font-heading clip-path-custom relative z-20 mx-auto flex w-full max-w-6xl items-center justify-center gap-3 rounded-t-2xl px-12 py-4 text-2xl font-extrabold {textColor} uppercase shadow-lg md:text-3xl"
	style="background-color: {color};"
>
	{@html title}
</h2>
