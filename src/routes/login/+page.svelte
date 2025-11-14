<script lang="ts">
	import type { ActionData } from './$types';
	import SkyParallax from '$lib/components/ui/SkyParallax.svelte';

	let { form } = $props<{ form?: ActionData }>();
</script>

<SkyParallax skyMode="evening" staticSky={true} enableDrift={true} />

<div class="login-container">
	<div class="login-card animate-scale">
		<h1>Log In to ThrustLab</h1>
		<p class="subtitle">Test authentication</p>

		<form method="POST" action="?/mockLogin" class="login-form animate-on-scroll">
			<div class="info-box">
				<h3>Demo Login</h3>
				<p>Click the button below to log in as a test user:</p>
				<ul>
					<li><strong>Username:</strong> testuser</li>
					<li><strong>User ID:</strong> test-user-123</li>
				</ul>
				<p class="note">This will grant you access to all protected routes without using a database.</p>
			</div>

			<button type="submit" class="login-button">
				Log In as Test User
			</button>
		</form>

		<div class="divider">
			<span>or</span>
		</div>

		<p class="signup-link">
			Don't have an account? <a href="/sign-up">Sign up</a>
		</p>
	</div>
</div>

<style>
	.login-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8rem 2rem 4rem;
	}

	.login-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		padding: 2.5rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.5);
		transition: all 0.4s ease;
	}

	.login-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 900;
		color: var(--font-primary);
		margin: 0 0 0.5rem 0;
		text-align: center;
	}

	.subtitle {
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.8;
		text-align: center;
		margin: 0 0 2rem 0;
		font-size: 1rem;
	}	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-box {
		background: rgba(135, 206, 235, 0.1);
		border: 2px solid rgba(135, 206, 235, 0.3);
		padding: 1.5rem;
		border-radius: 1rem;
	}

	.info-box h3 {
		font-family: var(--font-heading);
		color: var(--font-primary);
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 900;
	}

	.info-box p {
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.9;
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.info-box ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.9;
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.note {
		font-size: 0.9rem;
		color: var(--font-primary);
		opacity: 0.7;
		font-style: italic;
		margin-top: 1rem !important;
	}

	.login-button {
		position: relative;
		background: var(--ui-yellow);
		color: #000000;
		border: none;
		padding: 1rem 2rem;
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.5);
		overflow: hidden;
	}

	.login-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
	}

	.login-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.login-button:hover {
		background: #FFE66D;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.6), 0 0 30px rgba(255, 217, 102, 0.3);
	}

	.login-button:active {
		transform: translateY(0);
	}

	.divider {
		text-align: center;
		position: relative;
		margin: 1.5rem 0;
	}

	.divider::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 1px;
		background: rgba(135, 206, 235, 0.3);
	}

	.divider span {
		background: rgba(255, 255, 255, 0.95);
		padding: 0 1rem;
		position: relative;
		color: var(--font-primary);
		opacity: 0.7;
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.signup-link {
		text-align: center;
		font-family: var(--font-body);
		color: var(--font-primary);
		opacity: 0.9;
		margin: 0;
	}

	.signup-link a {
		color: var(--ui-yellow);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.signup-link a:hover {
		color: var(--font-accent-yellow);
		text-decoration: underline;
	}
</style>
