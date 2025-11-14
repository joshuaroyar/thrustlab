<script lang="ts">
	import SkyParallax from '$lib/components/ui/SkyParallax.svelte';
</script>

<SkyParallax skyMode="day" staticSky={true} enableDrift={true} />

<slot />