<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { invalidate, afterNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import ChatbotPopup from '$lib/components/chatbot/ChatbotPopup.svelte';
	import ImageModal from '$lib/components/ImageModal.svelte';
	import TransitionOverlay from '$lib/components/TransitionOverlay.svelte';
	import type { LayoutData } from './$types';
	import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

	const TITLE_MAP: Record<string, string> = {
		'/': 'ThrustLab | Home',
		'/dashboard': 'ThrustLab | Dashboard',
		'/login': 'ThrustLab | Login',
		'/sign-up': 'ThrustLab | Join ThrustLab',
		'/profile': 'ThrustLab | Pilot Profile',
		'/hangar-zone': 'ThrustLab | Hangar Zone',
		'/overhaul-station': 'ThrustLab | Overhaul Station',
		'/overhaul-station/assembly-disassembly': 'ThrustLab | Assembly & Disassembly',
		'/overhaul-station/preliminary-module': 'ThrustLab | Preliminary Module',
		'/test-bay': 'ThrustLab | Test Bay',
		'/turbofan-engine': 'ThrustLab | Turbofan Engine'
	};
	const DEFAULT_TITLE = 'ThrustLab';

	function formatPathToTitle(pathname: string) {
		if (!pathname || pathname === '/') return TITLE_MAP['/'];
		const segment = pathname.split('/').filter(Boolean).pop() ?? '';
		const words = segment
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
		return `ThrustLab | ${words || 'Explorer'}`;
	}

	let { children, data } = $props<{ children: any; data: LayoutData }>();
	let { supabase, session } = $derived(data);

	// Check if we're on the Test Bay page to hide the popup
	let isTestBayPage = $derived(page.url.pathname === '/test-bay');
	// Check if we're on the JAJA fullscreen page to hide the popup
	let isJajaPage = $derived(page.url.pathname === '/jaja');
	// Check if we're on the assembly disassembly page to hide the popup
	let isAssemblyDisassemblyPage = $derived(page.url.pathname === '/overhaul-station/assembly-disassembly');
	// Check if we're on the home page for transparent navbar and JAJA icon
	let isHomePage = $derived(page.url.pathname === '/');

	let observer: IntersectionObserver;
	let pageTitle = $derived(TITLE_MAP[page.url.pathname] ?? formatPathToTitle(page.url.pathname) ?? DEFAULT_TITLE);

	function observeElements() {
		if (!observer) return;
		// Small delay to ensure DOM is updated
		setTimeout(() => {
			const animateElements = document.querySelectorAll(
				'.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-fade'
			);
			animateElements.forEach((el) => observer.observe(el));
		}, 100);
	}

	afterNavigate(() => {
		observeElements();
	});

	onMount(() => {
		// Safety: Ensure scrolling is enabled on layout mount
		if (typeof document !== 'undefined') {
			document.body.classList.remove('page-transitioning');
			document.body.style.removeProperty('overflow');
			document.documentElement.style.removeProperty('overflow');
			console.log('Layout mounted - scroll enabled');
		}

		const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, _session: Session | null) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		// Scroll-triggered animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -100px 0px'
		};

		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Initial observation
		observeElements();

		return () => {
			subscription.unsubscribe();
			observer.disconnect();
			
			// Safety cleanup: ensure scroll is re-enabled
			if (typeof document !== 'undefined') {
				document.body.classList.remove('page-transitioning');
				document.body.style.removeProperty('overflow');
				document.documentElement.style.removeProperty('overflow');
			}
		};
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
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

{#if !isTestBayPage && !isJajaPage && !isAssemblyDisassemblyPage}
	<ChatbotPopup />
{/if}

<ImageModal />

<TransitionOverlay />

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
		padding-top: 5rem;
		margin-top: -5rem;
	}
</style>
