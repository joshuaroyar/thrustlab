<script lang="ts">
	import { onMount } from 'svelte';

	let cursorX = $state(0);
	let cursorY = $state(0);
	let cursorFollowX = $state(0);
	let cursorFollowY = $state(0);
	let isPointer = $state(false);
	let isHidden = $state(false);
	let trail: Array<{x: number, y: number, id: number}> = $state([]);
	let trailId = 0;

	onMount(() => {
		let animationFrame: number;

		const handleMouseMove = (e: MouseEvent) => {
			cursorX = e.clientX;
			cursorY = e.clientY;

			// Add trail point
			trail = [...trail, { x: e.clientX, y: e.clientY, id: trailId++ }];
			
			// Limit trail length
			if (trail.length > 8) {
				trail = trail.slice(-8);
			}

			const target = e.target as HTMLElement;
			isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
						target.tagName === 'A' || 
						target.tagName === 'BUTTON' ||
						target.closest('a') !== null ||
						target.closest('button') !== null;
		};

		const handleMouseLeave = () => {
			isHidden = true;
			trail = [];
		};

		const handleMouseEnter = () => {
			isHidden = false;
		};

		const animate = () => {
			const dx = cursorX - cursorFollowX;
			const dy = cursorY - cursorFollowY;
			
			cursorFollowX += dx * 0.15;
			cursorFollowY += dy * 0.15;

			animationFrame = requestAnimationFrame(animate);
		};

		window.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);
		
		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});
</script>

<div class="custom-cursor" class:hidden={isHidden}>
	<!-- Trail particles -->
	{#each trail as point, i (point.id)}
		<div 
			class="trail-particle"
			style="
				transform: translate({point.x}px, {point.y}px);
				opacity: {(i + 1) / trail.length * 0.5};
				scale: {(i + 1) / trail.length};
			"
		></div>
	{/each}

	<div 
		class="cursor-dot" 
		class:pointer={isPointer}
		style="transform: translate({cursorX}px, {cursorY}px)"
	></div>
	<div 
		class="cursor-outline" 
		class:pointer={isPointer}
		style="transform: translate({cursorFollowX}px, {cursorFollowY}px)"
	></div>
</div>

<style>
	.custom-cursor {
		pointer-events: none;
		position: fixed;
		inset: 0;
		z-index: 10000;
		transition: opacity 0.3s ease;
	}

	.custom-cursor.hidden {
		opacity: 0;
	}

	.cursor-dot {
		position: absolute;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: #38C172;
		border-radius: 50%;
		transform-origin: center center;
		transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
		mix-blend-mode: difference;
		margin: -4px 0 0 -4px;
	}

	.cursor-dot.pointer {
		width: 12px;
		height: 12px;
		background: #FFA726;
		margin: -6px 0 0 -6px;
	}

	.cursor-outline {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		border: 2px solid #38C172;
		border-radius: 50%;
		transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
		margin: -20px 0 0 -20px;
		opacity: 0.5;
	}

	.cursor-outline.pointer {
		width: 60px;
		height: 60px;
		border-color: #FFA726;
		margin: -30px 0 0 -30px;
	}

	.trail-particle {
		position: absolute;
		top: 0;
		left: 0;
		width: 6px;
		height: 6px;
		background: linear-gradient(135deg, #38C172, #FFA726);
		border-radius: 50%;
		margin: -3px 0 0 -3px;
		pointer-events: none;
		transition: opacity 0.3s ease, scale 0.3s ease;
	}

	@media (hover: none) or (pointer: coarse) {
		.custom-cursor {
			display: none;
		}
	}
</style>
