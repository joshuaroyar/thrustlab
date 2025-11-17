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
				opacity: {(i + 1) / trail.length * 0.4};
				scale: {(i + 1) / trail.length * 0.8};
			"
		></div>
	{/each}

	<!-- Custom Hand Cursor -->
	<div 
		class="cursor-hand" 
		class:pointer={isPointer}
		style="transform: translate({cursorX}px, {cursorY}px)"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
			<path d="M13 2v8h8c0-4.42-3.58-8-8-8zM11 2C6.58 2 3 5.58 3 10h8V2zm10 9h-8v8c4.42 0 8-3.58 8-8zM11 11H3c0 4.42 3.58 8 8 8v-8z"/>
		</svg>
	</div>
	
	<!-- Following glow effect -->
	<div 
		class="cursor-glow" 
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

	/* Custom Hand Cursor */
	.cursor-hand {
		position: absolute;
		top: 0;
		left: 0;
		width: 28px;
		height: 28px;
		transform-origin: center center;
		transition: width 0.3s ease, height 0.3s ease, color 0.3s ease, transform 0.1s ease;
		margin: -14px 0 0 -14px;
		pointer-events: none;
		z-index: 2;
	}

	.cursor-hand svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
		color: #FFD966; /* Golden yellow color */
		transition: color 0.3s ease;
	}

	.cursor-hand.pointer {
		width: 36px;
		height: 36px;
		margin: -18px 0 0 -18px;
		animation: pulse-cursor 1s ease-in-out infinite;
	}

	.cursor-hand.pointer svg {
		color: #FFA726; /* Orange color on hover */
		filter: drop-shadow(0 4px 12px rgba(255, 167, 38, 0.6));
	}

	@keyframes pulse-cursor {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	/* Following glow effect */
	.cursor-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 50px;
		height: 50px;
		background: radial-gradient(circle, rgba(255, 217, 102, 0.4) 0%, transparent 70%);
		border-radius: 50%;
		transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
		margin: -25px 0 0 -25px;
		opacity: 0.6;
		pointer-events: none;
		z-index: 1;
	}

	.cursor-glow.pointer {
		width: 70px;
		height: 70px;
		margin: -35px 0 0 -35px;
		background: radial-gradient(circle, rgba(255, 167, 38, 0.5) 0%, transparent 70%);
		opacity: 0.8;
	}

	.trail-particle {
		position: absolute;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: linear-gradient(135deg, #FFD966, #FFA726);
		border-radius: 50%;
		margin: -4px 0 0 -4px;
		pointer-events: none;
		transition: opacity 0.3s ease, scale 0.3s ease;
		box-shadow: 0 2px 6px rgba(255, 167, 38, 0.4);
		z-index: 0;
	}

	@media (hover: none) or (pointer: coarse) {
		.custom-cursor {
			display: none;
		}
	}
</style>
