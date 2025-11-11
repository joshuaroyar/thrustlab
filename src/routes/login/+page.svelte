<script lang="ts">
	import type { ActionData } from './$types';
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';

	let { form } = $props<{ form?: ActionData }>();
</script>

<AnimatedBackground variant="blue" />

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
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
	}

	.login-card {
		background: white;
		border-radius: 1rem;
		padding: 2.5rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		transition: all 0.4s ease;
	}

	.login-card:hover {
		transform: scale(1.02);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		color: #223A5E;
		margin: 0 0 0.5rem 0;
		text-align: center;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		text-align: center;
		margin: 0 0 2rem 0;
		font-size: 0.95rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-box {
		background: #F6F7FA;
		border-left: 4px solid #38C172;
		padding: 1.5rem;
		border-radius: 0.5rem;
	}

	.info-box h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
	}

	.info-box p {
		font-family: 'Roboto', sans-serif;
		color: #222831;
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.info-box ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		font-family: 'Roboto', sans-serif;
		color: #222831;
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.note {
		font-size: 0.9rem;
		color: #666;
		font-style: italic;
		margin-top: 1rem !important;
	}

	.login-button {
		position: relative;
		background: #38C172;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(56, 193, 114, 0.3);
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
		background: rgba(255, 255, 255, 0.2);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
	}

	.login-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.login-button:hover {
		background: #2da85f;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(56, 193, 114, 0.4);
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
		background: #ddd;
	}

	.divider span {
		background: white;
		padding: 0 1rem;
		position: relative;
		color: #999;
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
	}

	.signup-link {
		text-align: center;
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0;
	}

	.signup-link a {
		color: #38C172;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.signup-link a:hover {
		color: #2da85f;
		text-decoration: underline;
	}
</style>
