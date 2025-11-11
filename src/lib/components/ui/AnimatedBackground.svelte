<script lang="ts">
	import { onMount } from 'svelte';

	type Variant = 'default' | 'blue' | 'green' | 'orange' | 'magenta';

	interface Props {
		variant?: Variant;
	}

	let { variant = 'default' }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const gradientColors: Record<Variant, string[]> = {
		default: ['#223A5E', '#38C172', '#FF3C7E'],
		blue: ['#223A5E', '#1a2d47', '#38C172'],
		green: ['#38C172', '#2da85f', '#223A5E'],
		orange: ['#FFA726', '#ff9800', '#223A5E'],
		magenta: ['#FF3C7E', '#e91e63', '#223A5E']
	};

	const colors = gradientColors[variant];
</script>

<div class="animated-background" class:mounted>
	<div class="gradient-orb orb-1" style="--color: {colors[0]}"></div>
	<div class="gradient-orb orb-2" style="--color: {colors[1]}"></div>
	<div class="gradient-orb orb-3" style="--color: {colors[2]}"></div>
	<div class="grid-overlay"></div>
	<div class="noise-overlay"></div>
</div>

<style>
	.animated-background {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: linear-gradient(135deg, #F6F7FA 0%, #e8eaf0 100%);
		overflow: hidden;
	}

	.gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0;
		transition: opacity 1s ease;
	}

	.mounted .gradient-orb {
		opacity: 0.9;
	}

	.orb-1 {
		width: 800px;
		height: 800px;
		background: radial-gradient(circle, var(--color) 0%, transparent 70%);
		top: -300px;
		left: -200px;
		animation: float-1 20s ease-in-out infinite;
	}

	.orb-2 {
		width: 700px;
		height: 700px;
		background: radial-gradient(circle, var(--color) 0%, transparent 70%);
		bottom: -250px;
		right: -150px;
		animation: float-2 25s ease-in-out infinite;
	}

	.orb-3 {
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, var(--color) 0%, transparent 70%);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: float-3 30s ease-in-out infinite;
	}

	@keyframes float-1 {
		0%, 100% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(100px, 150px);
		}
		66% {
			transform: translate(-50px, 100px);
		}
	}

	@keyframes float-2 {
		0%, 100% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(-120px, -100px);
		}
		66% {
			transform: translate(80px, -150px);
		}
	}

	@keyframes float-3 {
		0%, 100% {
			transform: translate(-50%, -50%);
		}
		33% {
			transform: translate(-40%, -60%);
		}
		66% {
			transform: translate(-60%, -40%);
		}
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		background-image: 
			linear-gradient(rgba(34, 58, 94, 0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(34, 58, 94, 0.06) 1px, transparent 1px);
		background-size: 50px 50px;
		animation: grid-scroll 60s linear infinite;
	}

	@keyframes grid-scroll {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(50px, 50px);
		}
	}

	.noise-overlay {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
		opacity: 0.04;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.orb-1 {
			width: 400px;
			height: 400px;
		}

		.orb-2 {
			width: 350px;
			height: 350px;
		}

		.orb-3 {
			width: 300px;
			height: 300px;
		}
	}
</style>
