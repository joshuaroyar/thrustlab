<script lang="ts">
	import { onMount } from 'svelte';

	let { children } = $props<{ children: any }>();
	let visible = $state(false);

	onMount(() => {
		// Trigger entrance animation
		setTimeout(() => {
			visible = true;
		}, 50);

		// Set up intersection observer for scroll animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Observe all elements with animate-on-scroll class
		setTimeout(() => {
			const animateElements = document.querySelectorAll('.animate-on-scroll');
			animateElements.forEach(el => observer.observe(el));
		}, 100);

		return () => {
			observer.disconnect();
		};
	});
</script>

<div class="page-wrapper" class:visible>
	{@render children()}
</div>

<style>
	.page-wrapper {
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: translateY(30px);
		animation: fadeInUp 0.8s ease forwards;
	}

	.page-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-on-scroll) {
		opacity: 0;
		transform: translateY(50px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.animate-on-scroll.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(.animate-slide-left) {
		opacity: 0;
		transform: translateX(-50px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.animate-slide-left.visible) {
		opacity: 1;
		transform: translateX(0);
	}

	:global(.animate-slide-right) {
		opacity: 0;
		transform: translateX(50px);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.animate-slide-right.visible) {
		opacity: 1;
		transform: translateX(0);
	}

	:global(.animate-scale) {
		opacity: 0;
		transform: scale(0.9);
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.animate-scale.visible) {
		opacity: 1;
		transform: scale(1);
	}

	:global(.animate-fade) {
		opacity: 0;
		transition: opacity 0.8s ease;
	}

	:global(.animate-fade.visible) {
		opacity: 1;
	}
</style>
