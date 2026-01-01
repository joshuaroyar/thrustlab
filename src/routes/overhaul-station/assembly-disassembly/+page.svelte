<script lang="ts">
	import AssemblyActivity from '$lib/components/AssemblyActivity.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		document.body.classList.add('zone-overhaul');
		return () => document.body.classList.remove('zone-overhaul');
	});
</script>

<div class="activity-wrapper">
	{#if !data.session || !data.user}
		<!-- Auth Required Section -->
		<div class="auth-required-section">
			<div class="auth-card">
				<div class="lock-icon">🔒</div>
				<h1 class="auth-title">Authentication Required</h1>
				<p class="auth-message">
					You need to be signed in to access the Assembly and Disassembly activity. Track your
					progress, save your scores, and compete with others!
				</p>
				<div class="auth-buttons">
					<a href="/login" class="auth-btn login-btn">Login</a>
					<a href="/sign-up" class="auth-btn signup-btn">Sign Up</a>
				</div>
				<div class="auth-benefits">
					<h3>Why Sign In?</h3>
					<ul>
						<li>✓ Save your assembly scores</li>
						<li>✓ Track your learning progress</li>
						<li>✓ Access personalized feedback</li>
						<li>✓ Compete on leaderboards</li>
					</ul>
				</div>
			</div>
		</div>
	{:else}
		<!-- Header Section -->
		<div class="header-section">
			<div class="jaja-group">
				<!-- Speech Bubble Box -->
				<div class="speech-bubble">
					<p class="speech-text">
						<span class="speech-label">JAJA:</span> Yey! You've mastered the fundamentals of the turbofan
						engine! Now it's time to put that knowledge into action.
					</p>
				</div>

				<!-- Character Image -->
				<div class="character-container">
					<img src="/images/jaja-standing.png" alt="Jaja Character" class="character-image" />
				</div>
			</div>

			<!-- Title Card -->
			<div class="title-card">
				<h1 class="activity-title gradient-animated">
					Assembly and Disassembly
					<br />
					<span class="title-sub">Activity</span>
				</h1>
				<p class="instruction-text">
					<span class="instruction-label">Instruction:</span> Drag and drop each component of the turbofan
					engine to its correct position inside the casing. Pay attention to the order and orientation
					— each part has its special place in the engine!
				</p>
			</div>
		</div>

		<!-- Full Screen Activity -->
		<AssemblyActivity />
	{/if}
</div>

<style>
	/* Wrapper */
	.activity-wrapper {
		min-height: 100vh;
		width: 100%;
		position: relative;
		padding: 6rem 1rem 1rem; /* navbar-safe spacing */
		display: flex;
		flex-direction: column;
	}

	/* Header Section */
	.header-section {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 100;
		margin-bottom: 1rem;
	}

	.jaja-group {
		position: relative;
		display: flex;
		align-items: flex-end;
		margin-bottom: -1.5rem; /* Overlap with title card */
		z-index: 20;
		transform: none;
	}

	/* Speech Bubble */
	.speech-bubble {
		position: relative;
		overflow: hidden;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.16) 0%,
			rgba(255, 255, 255, 0.08) 60%,
			rgba(255, 255, 255, 0.12) 100%
		);
		backdrop-filter: blur(16px) saturate(140%);
		-webkit-backdrop-filter: blur(16px) saturate(140%);
		border: 1px solid rgba(255, 255, 255, 0.22);
		padding: 1.5rem 2.4rem;
		border-radius: 1.5rem;
		box-shadow:
			0 18px 40px rgba(0, 0, 0, 0.22),
			inset 0 1px 0 rgba(255, 255, 255, 0.18);
		margin-right: 1.5rem;
		margin-bottom: 2.5rem;
		width: min(760px, calc(100vw - 11rem));
		max-width: 760px;
	}

	.speech-bubble::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 22% 20%, rgba(255, 255, 255, 0.22), transparent 55%),
			radial-gradient(circle at 78% 85%, rgba(255, 255, 255, 0.12), transparent 60%);
		pointer-events: none;
	}

	.speech-text {
		font-family: var(--font-body);
		font-size: 1.25rem;
		color: var(--font-primary);
		font-weight: 650;
		line-height: 1.5;
		text-shadow: none;
	}

	.speech-label {
		font-weight: 800;
		color: var(--navbar-accent, var(--ui-yellow));
	}

	/* Character */
	.character-container {
		width: 8rem;
		height: 9.75rem;
		z-index: 20;
	}

	.character-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
	}

	/* Title Card */
	.title-card {
		background: rgba(30, 58, 95, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 1.5rem;
		padding: 2.5rem 4rem;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: none;
		position: relative;
		z-index: 10;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.activity-title {
		font-family: var(--font-heading, sans-serif);
		font-size: 3.5rem;
		font-weight: 900;
		text-transform: uppercase;
		margin: 0 0 1.5rem 0;
		line-height: 1.1;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.title-sub {
		opacity: 0.95;
	}

	.instruction-text {
		font-family: var(--font-body, sans-serif);
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.2rem;
		line-height: 1.6;
		max-width: 1000px;
		margin: 0 auto;
	}

	.instruction-label {
		color: var(--navbar-accent, var(--ui-yellow));
		font-weight: 700;
	}

	/* Auth Required Section */
	.auth-required-section {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		padding: 2rem;
	}

	.auth-card {
		background: rgba(30, 58, 95, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 1.5rem;
		padding: 3rem;
		max-width: 600px;
		width: 100%;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.lock-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.auth-title {
		font-family: var(--font-heading, sans-serif);
		font-size: 2.5rem;
		font-weight: 900;
		color: #ffffff;
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.auth-message {
		font-family: var(--font-body, sans-serif);
		color: rgba(255, 255, 255, 0.8);
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0 0 2rem 0;
	}

	.auth-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.auth-btn {
		padding: 1rem 2.5rem;
		border-radius: 0.75rem;
		font-family: var(--font-body, sans-serif);
		font-weight: 700;
		font-size: 1.1rem;
		text-decoration: none;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		display: inline-block;
	}

	.login-btn {
		background: linear-gradient(
			135deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 100%
		);
		color: var(--ui-dark-teal);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
	}

	.login-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 14px 36px rgba(0, 0, 0, 0.3);
	}

	.signup-btn {
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.25);
	}

	.signup-btn:hover {
		background: rgba(255, 255, 255, 0.12);
		transform: translateY(-2px);
	}

	.auth-benefits {
		background: rgba(255, 255, 255, 0.06);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-top: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.auth-benefits h3 {
		font-family: var(--font-heading, sans-serif);
		color: #ffffff;
		font-size: 1.3rem;
		margin: 0 0 1rem 0;
	}

	.auth-benefits ul {
		list-style: none;
		padding: 0;
		margin: 0;
		text-align: left;
	}

	.auth-benefits li {
		font-family: var(--font-body, sans-serif);
		color: rgba(255, 255, 255, 0.8);
		font-size: 1rem;
		padding: 0.5rem 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	@media (max-width: 900px) {
		.jaja-group {
			flex-direction: column;
			align-items: center;
			margin-bottom: 1rem;
		}

		.speech-bubble {
			margin-right: 0;
			margin-bottom: 1rem;
			width: min(760px, calc(100vw - 2rem));
			max-width: 760px;
		}

		.title-card {
			padding: 2rem 1.25rem;
		}

		.activity-title {
			font-size: 2.4rem;
		}

		.instruction-text {
			font-size: 1.05rem;
		}
	}
</style>
