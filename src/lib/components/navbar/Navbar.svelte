<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { user = null, isTransparent = false } = $props<{ user: any; isTransparent?: boolean }>();

	let mobileMenuOpen = $state(false);
	let isScrolled = $state(false);
	let scrollProgress = $state(0); // 0 = day, 0.5 = evening, 1 = night
	let navbarBgColor = $state('rgba(135, 206, 235, 0.15)'); // Default day theme

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
			
			// Calculate scroll progress (0 to 1)
			const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
			const currentScroll = window.scrollY;
			const progress = Math.min(currentScroll / scrollHeight, 1);
			scrollProgress = progress;
			
			// Update navbar background color based on scroll progress
			updateNavbarColor(progress);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial call
		
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function updateNavbarColor(progress: number) {
		let bgColor;
		
		if (progress < 0.25) {
			// Day theme (sky blue tones)
			const t = progress / 0.25;
			bgColor = interpolateRGBA(
				{ r: 135, g: 206, b: 235, a: 0.15 }, // Light sky blue
				{ r: 255, g: 140, b: 100, a: 0.15 }, // Orange
				t
			);
		} else if (progress < 0.5) {
			// Evening theme (orange to deep blue tones)
			const t = (progress - 0.25) / 0.25;
			bgColor = interpolateRGBA(
				{ r: 255, g: 140, b: 100, a: 0.15 }, // Orange
				{ r: 26, g: 40, b: 71, a: 0.15 },    // Deep blue
				t
			);
		} else if (progress < 0.75) {
			// Night theme (dark blue/navy tones)
			bgColor = 'rgba(10, 22, 40, 0.15)'; // Deep navy
		} else {
			// Midnight theme (purple tones)
			const t = (progress - 0.75) / 0.25;
			bgColor = interpolateRGBA(
				{ r: 10, g: 22, b: 40, a: 0.15 },    // Deep navy
				{ r: 45, g: 27, b: 75, a: 0.15 },    // Deep purple
				t
			);
		}
		
		navbarBgColor = bgColor;
	}

	function interpolateRGBA(color1: {r: number, g: number, b: number, a: number}, color2: {r: number, g: number, b: number, a: number}, t: number): string {
		const r = Math.round(color1.r + (color2.r - color1.r) * t);
		const g = Math.round(color1.g + (color2.g - color1.g) * t);
		const b = Math.round(color1.b + (color2.b - color1.b) * t);
		const a = color1.a + (color2.a - color1.a) * t;
		
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	const publicLinks = [
		{ href: '/hangar-zone', label: 'Hangar Zone' },
		{ href: '/turbofan-zone', label: 'Turbofan Zone' },
		{ href: '/overhaul-station', label: 'Overhaul Station' },
		{ href: '/jaja', label: 'JAJA' }
	];

	const authLinks = [
		{ href: '/sign-up', label: 'Sign Up' },
		{ href: '/login', label: 'Log In' }
	];

	const protectedLinks = [
		{ href: '/test-bay', label: 'Test Bay' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/profile', label: 'Profile' }
	];

	function handleLogout() {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/login?/logout';
		document.body.appendChild(form);
		form.submit();
	}
</script>

<nav 
	class="navbar" 
	class:scrolled={isScrolled} 
	class:transparent={isTransparent && !isScrolled}
	style="--navbar-bg-color: {navbarBgColor};"
>
	<div class="navbar-container">
		<!-- Logo -->
		<div class="navbar-brand">
			<a href="/" class="logo-link">
				<span class="logo-text">ThrustLab</span>
			</a>
		</div>

		<!-- Desktop Navigation -->
		<div class="navbar-menu">
			<!-- Public Links -->
			{#each publicLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={page.url.pathname === link.href}
				>
					{link.label}
				</a>
			{/each}

			<!-- Auth or Protected Links -->
			{#if user}
				{#each protectedLinks as link}
					<a
						href={link.href}
						class="nav-link"
						class:active={page.url.pathname === link.href}
					>
						{link.label}
					</a>
				{/each}
				<button onclick={handleLogout} class="nav-link logout-button">
					Log Out
				</button>
			{:else}
				{#each authLinks as link}
					<a
						href={link.href}
						class="nav-link"
						class:active={page.url.pathname === link.href}
					>
						{link.label}
					</a>
				{/each}
			{/if}
		</div>

		<!-- Mobile Menu Button -->
		<button class="mobile-menu-button" onclick={toggleMobileMenu} aria-label="Toggle menu">
			{#if mobileMenuOpen}
				<svg class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="mobile-menu">
			{#each publicLinks as link}
				<a
					href={link.href}
					class="mobile-nav-link"
					class:active={page.url.pathname === link.href}
					onclick={closeMobileMenu}
				>
					{link.label}
				</a>
			{/each}

			{#if user}
				{#each protectedLinks as link}
					<a
						href={link.href}
						class="mobile-nav-link"
						class:active={page.url.pathname === link.href}
						onclick={closeMobileMenu}
					>
						{link.label}
					</a>
				{/each}
				<button onclick={handleLogout} class="mobile-nav-link logout-button">
					Log Out
				</button>
			{:else}
				{#each authLinks as link}
					<a
						href={link.href}
						class="mobile-nav-link"
						class:active={page.url.pathname === link.href}
						onclick={closeMobileMenu}
					>
						{link.label}
					</a>
				{/each}
			{/if}
		</div>
	{/if}
</nav>

<style>
	.navbar {
		/* Glassmorphism / Liquid Glass Effect */
		background: var(--navbar-bg-color, rgba(135, 206, 235, 0.15));
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.18);
		position: sticky;
		top: 0;
		z-index: 1000;
		width: 100%;
		transition: all 0.5s ease;
	}

	.navbar.transparent {
		background: transparent;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: none;
		border-bottom: none;
	}

	.navbar.scrolled {
		background: var(--navbar-bg-color, rgba(135, 206, 235, 0.15));
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	.navbar-container {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
	}

	.navbar-brand {
		flex-shrink: 0;
	}

	.logo-link {
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.logo-text {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 900;
		color: #FFFFFF;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
		transition: all 0.3s ease;
	}

	.logo-link:hover .logo-text {
		color: var(--ui-yellow);
		text-shadow: 0 2px 8px rgba(255, 217, 102, 0.6);
	}

	.navbar-menu {
		display: none;
		align-items: center;
		gap: 0.5rem;
	}

	@media (min-width: 768px) {
		.navbar-menu {
			display: flex;
		}
	}

	.nav-link {
		font-family: var(--font-heading); /* Match logo/title font */
		font-size: 1rem;
		font-weight: 700;
		color: #FFFFFF; /* Pure white for maximum readability */
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.3s ease;
		white-space: nowrap;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
		text-transform: uppercase; /* ALL CAPS */
		letter-spacing: 0.5px;
	}

	.nav-link:hover {
		background-color: rgba(255, 217, 102, 0.2); /* Yellow with opacity */
		color: #FFFFFF;
	}

	.nav-link.active {
		background-color: var(--ui-yellow); /* Yellow */
		color: #000000; /* Black for maximum contrast */
		font-weight: 600;
		text-shadow: none;
	}

	.mobile-menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: none;
		border: none;
		color: var(--font-secondary); /* White */
		cursor: pointer;
		border-radius: 0.375rem;
		transition: background-color 0.3s ease;
	}

	.mobile-menu-button:hover {
		background-color: rgba(0, 206, 209, 0.2);
	}

	@media (min-width: 768px) {
		.mobile-menu-button {
			display: none;
		}
	}

	.menu-icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		padding: 1rem 1.5rem;
		/* Glassmorphism Effect */
		background: var(--navbar-bg-color, rgba(135, 206, 235, 0.12));
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-top: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 768px) {
		.mobile-menu {
			display: none;
		}
	}

	.mobile-nav-link {
		font-family: var(--font-heading); /* Match logo/title font */
		font-size: 1rem;
		font-weight: 700;
		color: #FFFFFF; /* Pure white for maximum readability */
		text-decoration: none;
		padding: 0.75rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.3s ease;
		text-transform: uppercase; /* ALL CAPS */
		letter-spacing: 0.5px;
		margin-bottom: 0.25rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
	}

	.mobile-nav-link:hover {
		background-color: rgba(255, 217, 102, 0.2); /* Yellow with opacity */
		color: #FFFFFF;
	}

	.mobile-nav-link.active {
		background-color: var(--ui-yellow); /* Yellow */
		color: #000000; /* Black for maximum contrast */
		font-weight: 600;
		text-shadow: none;
	}

	.logout-button {
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}

	.logout-button:hover {
		background-color: rgba(215, 94, 46, 0.2); /* Orange with opacity */
		color: var(--bg-secondary); /* Orange */
	}
</style>
