<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import SkyBackground from '$lib/components/SkyBackground.svelte';

	let { data, form } = $props<{ data: PageData, form?: ActionData }>();







	const signInWithGoogle = async () => {
		const { error } = await data.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
		if (error) {
			console.error(error);
		}
	};
</script>

<SkyBackground evening={true} />

<div class="signup-container">
	<div class="signup-card animate-scale">
		<h1 class="gradient-animated gradient-text">Join ThrustLab</h1>

		<form class="signup-form animate-on-scroll" method="POST" use:enhance>
			{#if form?.error}
				<div class="alert error">
					{form.error}
				</div>
			{/if}
			{#if form?.success}
				<div class="alert success">
					{form.message}
				</div>
			{/if}

			<div class="form-group">
				<label for="fullName">Full Name</label>
				<input type="text" id="fullName" name="fullName" placeholder="Enter your full name" value={form?.fullName ?? ''} required />
			</div>

			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" placeholder="Choose a username" value={form?.username ?? ''} required />
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" placeholder="your@email.com" value={form?.email ?? ''} required />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" placeholder="Create a secure password" required />
			</div>

			<button type="submit" class="signup-button">
				Create Account
			</button>
		</form>

		<div class="divider">
			<span>or</span>
		</div>

		<button type="button" class="google-button" onclick={signInWithGoogle}>
			<svg class="google-icon" viewBox="0 0 24 24">
				<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
				<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
				<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
				<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
			</svg>
			Sign up with Google
		</button>

		<p class="login-link">
			Already have an account? <a href="/login">Log in</a>
		</p>
	</div>
</div>

<style>
	/* Using global `gradient-flash` keyframes (moved to src/app.css) */

	.signup-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--spacing-xxl) * 2) var(--container-side-padding) var(--spacing-xxl);
	}

	.signup-card {
		background: rgba(10, 47, 53, 0.6); /* Dark Teal Glass */
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: var(--card-padding);
		max-width: 500px;
		width: 100%;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(135, 206, 235, 0.3);
		transition: all 0.4s ease;
	}

	.signup-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
		border-color: var(--font-accent-cyan);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 900;
		margin: 0 0 0.5rem 0;
		text-align: center;
		/* Gradient handled by .gradient-text class */
	}

	.gradient-text {
		background: linear-gradient(
			90deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 50%,
			var(--navbar-accent, var(--ui-yellow)) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash var(--gradient-duration) ease-in-out infinite;
	}

	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-family: var(--font-body);
		font-weight: 600;
		color: var(--ui-light-blue);
		font-size: 0.95rem;
		letter-spacing: 0.5px;
	}

	input {
		padding: var(--spacing-sm) var(--spacing-sm);
		border: 1px solid rgba(135, 206, 235, 0.3);
		border-radius: 0.75rem;
		font-family: var(--font-body);
		font-size: 1rem;
		transition: all 0.3s ease;
		background: rgba(0, 0, 0, 0.3);
		color: white;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}

	input:focus {
		outline: none;
		border-color: var(--navbar-accent, var(--ui-yellow));
		box-shadow: 0 0 0 3px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.2);
		background: rgba(0, 0, 0, 0.5);
	}

	.signup-button {
		position: relative;
		background: linear-gradient(135deg, var(--navbar-accent, var(--ui-yellow)) 0%, #ffe66d 100%);
		color: #000000;
		border: none;
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6px 20px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.5);
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.signup-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
	}

	.signup-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.signup-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 30px rgba(var(--navbar-accent-rgb, 255, 217, 102), 0.6);
	}

	.divider {
		text-align: center;
		position: relative;
		margin: 2rem 0;
	}

	.divider::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 1px;
		background: rgba(135, 206, 235, 0.2);
	}

	.divider span {
		background: rgba(10, 47, 53, 0.8);
		padding: 0 1rem;
		position: relative;
		color: var(--font-secondary);
		opacity: 0.8;
		font-family: var(--font-body);
		font-size: 0.9rem;
		border-radius: 10px;
	}

	.login-link {
		text-align: center;
		font-family: var(--font-body);
		color: var(--font-secondary);
		opacity: 0.9;
		margin: 0 0 2rem 0;
	}

	.login-link a {
		color: var(--navbar-accent, var(--ui-yellow));
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.login-link a:hover {
		color: #fff;
		text-shadow: 0 0 10px var(--navbar-accent, var(--ui-yellow));
	}

	.google-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: white;
		color: #3c4043;
		border: none;
		padding: 0.8rem;
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 10px rgba(0,0,0,0.2);
	}

	.google-button:hover {
		background: #f8f9fa;
		transform: translateY(-2px);
		box-shadow: 0 6px 15px rgba(0,0,0,0.3);
	}

	.google-button:active {
		transform: translateY(0);
	}

	.google-icon {
		width: 18px;
		height: 18px;
	}

	.alert {
		padding: var(--spacing-sm);
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.alert.error {
		background: rgba(255, 107, 107, 0.2);
		border: 1px solid #ff6b6b;
		color: #ffc9c9;
	}

	.alert.success {
		background: rgba(81, 207, 102, 0.2);
		border: 1px solid #51cf66;
		color: #b2f2bb;
	}

	@media (max-width: 768px) {
		.signup-container {
			padding: calc(var(--spacing-xxl) * 1.5) var(--spacing-sm) var(--spacing-lg);
		}

		.signup-card {
			padding: var(--card-padding) var(--spacing-md);
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>
