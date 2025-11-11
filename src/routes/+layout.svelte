<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';
	import ParallaxBackground from '$lib/components/ui/ParallaxBackground.svelte';
	import ChatbotPopup from '$lib/components/chatbot/ChatbotPopup.svelte';
	import type { LayoutData } from './$types';

	let { children, data } = $props<{ children: any; data: LayoutData }>();
	
	// Check if we're on the JAJA page to hide the popup
	let isJajaPage = $derived(page.url.pathname === '/jaja');
	// Check if we're on the home page for transparent navbar
	let isHomePage = $derived(page.url.pathname === '/');

	onMount(() => {
		// Scroll-triggered animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -100px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Observe all elements with animate-on-scroll class
		const animateElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-fade');
		animateElements.forEach(el => observer.observe(el));

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

{#if !isHomePage}
	<div class="global-background">
		<div class="image-overlay"></div>
	</div>
{/if}
<ParallaxBackground />
<CustomCursor />

<Navbar user={data.user} isTransparent={isHomePage} />

<main class:home-page={isHomePage}>
	{@render children()}
</main>

{#if !isJajaPage}
	<ChatbotPopup />
{/if}

<style>
	.global-background {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		background: linear-gradient(135deg, #0a1628 0%, #2d3f66 100%);
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: rgba(10, 22, 40, 0.2);
		z-index: 1;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background-color: transparent;
		color: #222831; /* Charcoal Gray */
		font-family: 'Roboto', sans-serif;
		cursor: none;
	}

	:global(a),
	:global(button) {
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

	:global(*) {
		cursor: none !important;
	}
</style>
