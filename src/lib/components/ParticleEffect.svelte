<script lang="ts">
	import { onMount } from 'svelte';

	let canvasRef: HTMLCanvasElement;
	let particles: Particle[] = [];
	let mouseX = 0;
	let mouseY = 0;

	class Particle {
		x: number;
		y: number;
		size: number;
		baseX: number;
		baseY: number;
		density: number;
		color: string;
		speedX: number;
		speedY: number;

		constructor(x: number, y: number, color: string) {
			this.x = x;
			this.y = y;
			this.baseX = x;
			this.baseY = y;
			this.size = Math.random() * 3 + 1;
			this.density = Math.random() * 30 + 10;
			this.color = color;
			this.speedX = Math.random() * 0.5 - 0.25;
			this.speedY = Math.random() * 0.5 - 0.25;
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}

		update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
			const dx = mouseX - this.x;
			const dy = mouseY - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const forceDirectionX = dx / distance;
			const forceDirectionY = dy / distance;
			const maxDistance = 150;
			const force = (maxDistance - distance) / maxDistance;
			const directionX = forceDirectionX * force * this.density;
			const directionY = forceDirectionY * force * this.density;

			if (distance < maxDistance) {
				this.x -= directionX;
				this.y -= directionY;
			} else {
				if (this.x !== this.baseX) {
					const dx = this.x - this.baseX;
					this.x -= dx / 10;
				}
				if (this.y !== this.baseY) {
					const dy = this.y - this.baseY;
					this.y -= dy / 10;
				}
			}

			this.x += this.speedX;
			this.y += this.speedY;

			if (this.x < 0 || this.x > ctx.canvas.width) this.speedX *= -1;
			if (this.y < 0 || this.y > ctx.canvas.height) this.speedY *= -1;

			this.draw(ctx);
		}
	}

	onMount(() => {
		const canvas = canvasRef;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			particles = [];
			initParticles();
		};

		const initParticles = () => {
			const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
			const colors = [
				'rgba(56, 193, 114, 0.5)',
				'rgba(255, 167, 38, 0.5)',
				'rgba(255, 60, 126, 0.5)',
				'rgba(34, 58, 94, 0.5)'
			];

			for (let i = 0; i < numberOfParticles; i++) {
				const x = Math.random() * canvas.width;
				const y = Math.random() * canvas.height;
				const color = colors[Math.floor(Math.random() * colors.length)];
				particles.push(new Particle(x, y, color));
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			particles.forEach(particle => {
				particle.update(ctx, mouseX, mouseY);
			});

			// Connect nearby particles
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.strokeStyle = `rgba(56, 193, 114, ${0.2 * (1 - distance / 100)})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			requestAnimationFrame(animate);
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', handleMouseMove);
		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<canvas bind:this={canvasRef} class="particle-canvas"></canvas>

<style>
	.particle-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}
</style>
