<script lang="ts">
	import { onMount } from 'svelte';
	
	let mouseX = $state(0);
	let mouseY = $state(0);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	function getParallaxStyle(depth: number) {
		if (!mounted) return '';
		const moveX = (mouseX - window.innerWidth / 2) * depth;
		const moveY = (mouseY - window.innerHeight / 2) * depth;
		return `transform: translate(${moveX}px, ${moveY}px)`;
	}
</script>

<div class="parallax-background">
	<div class="parallax-layer layer-1" style={getParallaxStyle(0.01)}></div>
	<div class="parallax-layer layer-2" style={getParallaxStyle(0.02)}></div>
	<div class="parallax-layer layer-3" style={getParallaxStyle(0.03)}></div>
	<div class="parallax-layer layer-4" style={getParallaxStyle(0.015)}></div>
</div>

<style>
	.parallax-background {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.parallax-layer {
		position: absolute;
		inset: -15%;
		transition: transform 0.3s ease-out;
		will-change: transform;
	}

	.layer-1 {
		background: radial-gradient(circle at 30% 40%, rgba(56, 193, 114, 0.08) 0%, transparent 50%);
	}

	.layer-2 {
		background: radial-gradient(circle at 70% 60%, rgba(255, 167, 38, 0.06) 0%, transparent 50%);
	}

	.layer-3 {
		background: radial-gradient(circle at 50% 80%, rgba(255, 60, 126, 0.06) 0%, transparent 50%);
	}

	.layer-4 {
		background: radial-gradient(circle at 85% 20%, rgba(34, 58, 94, 0.05) 0%, transparent 50%);
	}
</style>
