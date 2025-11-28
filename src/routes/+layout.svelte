<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import ChatbotPopup from '$lib/components/chatbot/ChatbotPopup.svelte';
	import type { LayoutData } from './$types';

	let { children, data } = $props<{ children: any; data: LayoutData }>();

	// Check if we're on the Test Bay page to hide the popup
	let isTestBayPage = $derived(page.url.pathname === '/test-bay');
	// Check if we're on the home page for transparent navbar and JAJA icon
	let isHomePage = $derived(page.url.pathname === '/');

	onMount(() => {
		// Scroll-triggered animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -100px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Observe all elements with animate-on-scroll class
		const animateElements = document.querySelectorAll(
			'.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-fade'
		);
		animateElements.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@400;500;600&family=Open+Sans:wght@400;600&family=Lato:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Navbar user={data.user} isTransparent />

<main class:home-page={isHomePage}>
	{@render children()}
</main>

{#if !isTestBayPage}
	<ChatbotPopup />
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: transparent;
		color: #222831; /* Charcoal Gray */
		font-family: 'Roboto', sans-serif;
		cursor: none;
	}

	main {
		min-height: 100vh;
		position: relative;
	}

	/* Add padding for non-home pages */
	main:not(.home-page) {
		padding-top: 64px;
		margin-top: -64px;
	}
</style>
