<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ChatWidget from '$lib/components/ChatWidget.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col relative">
	<Navbar />
	<main class="grow">
		{@render children()}
	</main>
	<ChatWidget />
	<Footer />
</div>