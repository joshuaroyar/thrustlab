<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { user = null, isTransparent = false } = $props<{ user: any; isTransparent?: boolean }>();

	let mobileMenuOpen = $state(false);
	let isScrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

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

<nav class="navbar" class:scrolled={isScrolled} class:transparent={isTransparent && !isScrolled}>
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
		background: rgba(34, 58, 94, 0.95); /* Deep Blue with transparency */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(56, 193, 114, 0.2);
		position: sticky;
		top: 0;
		z-index: 1000;
		width: 100%;
		transition: all 0.3s ease;
	}

	.navbar.transparent {
		background: transparent; /* Fully transparent on home page */
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: none;
		border-bottom: none;
	}

	/* Add text shadow for better readability on transparent navbar */
	.navbar.transparent .logo-text,
	.navbar.transparent .nav-link {
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7);
	}

	.navbar.scrolled {
		background: rgba(34, 58, 94, 0.95); /* Solid when scrolled */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(56, 193, 114, 0.2);
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
		font-family: 'Montserrat', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #F6F7FA; /* Soft Slate */
		letter-spacing: 0.5px;
		transition: color 0.3s ease;
	}

	.logo-link:hover .logo-text {
		color: #FFA726; /* Orange */
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
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: #F6F7FA; /* Soft Slate */
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.nav-link:hover {
		background-color: rgba(56, 193, 114, 0.1); /* Fresh Green with opacity */
		color: #38C172; /* Fresh Green */
	}

	.nav-link.active {
		background-color: #38C172; /* Fresh Green */
		color: #223A5E; /* Deep Blue */
		font-weight: 600;
	}

	.mobile-menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: none;
		border: none;
		color: #F6F7FA; /* Soft Slate */
		cursor: pointer;
		border-radius: 0.375rem;
		transition: background-color 0.3s ease;
	}

	.mobile-menu-button:hover {
		background-color: rgba(56, 193, 114, 0.1);
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
		background: rgba(26, 45, 71, 0.95); /* Slightly darker than Deep Blue with transparency */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-top: 1px solid rgba(56, 193, 114, 0.2);
	}

	@media (min-width: 768px) {
		.mobile-menu {
			display: none;
		}
	}

	.mobile-nav-link {
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: #F6F7FA; /* Soft Slate */
		text-decoration: none;
		padding: 0.75rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.3s ease;
		margin-bottom: 0.25rem;
	}

	.mobile-nav-link:hover {
		background-color: rgba(56, 193, 114, 0.1);
		color: #38C172; /* Fresh Green */
	}

	.mobile-nav-link.active {
		background-color: #38C172; /* Fresh Green */
		color: #223A5E; /* Deep Blue */
		font-weight: 600;
	}

	.logout-button {
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}

	.logout-button:hover {
		background-color: rgba(255, 60, 126, 0.1); /* Magenta with opacity */
		color: #FF3C7E; /* Magenta */
	}
</style>
