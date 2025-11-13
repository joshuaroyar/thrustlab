<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
</script>

<AnimatedBackground variant="green" />

<div class="signup-container">
	<div class="signup-card animate-scale">
		<h1>Join ThrustLab</h1>
		<p class="subtitle">Start your journey in aerospace engineering education</p>

		<form class="signup-form animate-on-scroll">
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" placeholder="Choose a username" />
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" placeholder="your@email.com" />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" placeholder="Create a secure password" />
			</div>

			<button type="submit" class="signup-button">
				Create Account
			</button>
		</form>

		<div class="divider">
			<span>or</span>
		</div>

		<p class="login-link">
			Already have an account? <a href="/login">Log in</a>
		</p>

		<div class="features-list animate-on-scroll">
			<h3>What you'll get:</h3>
			<ul>
				<li>✅ Access to all learning zones</li>
				<li>✅ Interactive 3D simulations</li>
				<li>✅ AI-powered assistance</li>
				<li>✅ Progress tracking</li>
				<li>✅ Assessment tools</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.signup-container {
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-quaternary) 100%);
	}

	.signup-card {
		/* Glassmorphism Effect */
		background: rgba(10, 47, 53, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(135, 206, 235, 0.3);
		border-radius: 1.5rem;
		padding: 3rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		transition: all 0.4s ease;
	}

	.signup-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
		border-color: rgba(255, 217, 102, 0.4);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 900;
		color: var(--font-secondary);
		margin: 0 0 0.5rem 0;
		text-align: center;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
	}

	.subtitle {
		font-family: var(--font-body);
		color: var(--ui-light-blue);
		text-align: center;
		margin: 0 0 2rem 0;
		font-size: 1rem;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
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
		color: var(--font-accent-yellow);
		font-size: 0.95rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
	}

	input {
		padding: 1rem 1.25rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 0.75rem;
		font-family: var(--font-body);
		font-size: 1rem;
		transition: all 0.3s ease;
		background: rgba(28, 46, 58, 0.5);
		color: var(--font-secondary);
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	input:focus {
		outline: none;
		border-color: var(--ui-yellow);
		box-shadow: 0 0 0 3px rgba(255, 217, 102, 0.2);
		background: rgba(28, 46, 58, 0.7);
	}

	.signup-button {
		position: relative;
		background: var(--ui-yellow);
		color: var(--ui-dark-teal);
		border: none;
		padding: 1.25rem 2rem;
		border-radius: 50px;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6px 20px rgba(255, 217, 102, 0.4);
		overflow: hidden;
	}

	.signup-button::before {
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

	.signup-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.signup-button:hover {
		transform: translateY(-3px);
		background: var(--font-accent-yellow);
		box-shadow: 0 10px 30px rgba(255, 217, 102, 0.6), 0 0 30px rgba(255, 217, 102, 0.3);
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
		background: rgba(135, 206, 235, 0.3);
	}

	.divider span {
		background: rgba(10, 47, 53, 0.8);
		padding: 0 1rem;
		position: relative;
		color: var(--ui-light-blue);
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.login-link {
		text-align: center;
		font-family: var(--font-body);
		color: var(--font-secondary);
		margin: 0 0 2rem 0;
	}

	.login-link a {
		color: var(--ui-yellow);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.login-link a:hover {
		color: var(--font-accent-yellow);
		text-decoration: underline;
		text-shadow: 0 0 10px rgba(255, 217, 102, 0.5);
	}

	.features-list {
		background: rgba(28, 46, 58, 0.7);
		padding: 1.5rem;
		border-radius: 1rem;
		border: 1px solid rgba(135, 206, 235, 0.3);
	}

	.features-list h3 {
		font-family: var(--font-heading);
		color: var(--font-accent-yellow);
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		font-weight: 900;
	}

	.features-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features-list li {
		font-family: var(--font-body);
		color: var(--font-secondary);
		padding: 0.5rem 0;
		font-size: 0.95rem;
	}

	@media (max-width: 768px) {
		.signup-card {
			padding: 2rem;
		}
	}
</style>
