<script lang="ts">
	import type { ActionData } from './$types';

	let { form } = $props<{ form?: ActionData }>();
</script>

<!-- Parallax Background matching homepage -->
<div class="parallax-background">
	<canvas class="sky-layer" width="1920" height="1080"></canvas>
</div>

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
	/* Parallax Background */
	.parallax-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
		overflow: hidden;
		background: linear-gradient(to bottom, #87CEEB 0%, #5FA3C8 50%, #4A8BB5 100%);
	}

	.sky-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.login-container {
		position: relative;
		z-index: 1;
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.login-card {
		/* Glassmorphism Effect matching homepage */
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 1.5rem;
		padding: 2.5rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(135, 206, 235, 0.3);
		transition: all 0.4s ease;
	}

	.login-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(255, 217, 102, 0.3);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 900;
		color: #FFE66D;
		margin: 0 0 0.5rem 0;
		text-align: center;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
	}

	.subtitle {
		font-family: var(--font-body);
		color: var(--font-secondary);
		text-align: center;
		margin: 0 0 2rem 0;
		font-size: 0.95rem;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-box {
		background: rgba(28, 46, 58, 0.6);
		border-left: 4px solid var(--ui-yellow);
		padding: 1.5rem;
		border-radius: 0.5rem;
		backdrop-filter: blur(10px);
	}

	.info-box h3 {
		font-family: var(--font-heading);
		color: var(--font-accent-yellow);
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 900;
	}

	.info-box p {
		font-family: var(--font-body);
		color: var(--font-secondary);
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.info-box ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		font-family: var(--font-body);
		color: var(--font-secondary);
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.note {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
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
		background: rgba(10, 47, 53, 0.6);
		padding: 0 1rem;
		position: relative;
		color: rgba(255, 255, 255, 0.7);
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.signup-link {
		text-align: center;
		font-family: var(--font-body);
		color: var(--font-secondary);
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
