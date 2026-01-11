<script lang="ts">
	export let title: string;
	export let color: string = '#1b3558'; // Default to Hangar Zone styling
	export let className: string = '';
</script>

<h2
	class="font-heading clip-path-custom relative z-20 flex w-full items-center justify-center gap-3 rounded-t-2xl px-8 py-4 text-xl font-extrabold text-white uppercase shadow-lg md:text-3xl {className}"
	style="background-color: {color};"
>
	{@html title}
</h2>
