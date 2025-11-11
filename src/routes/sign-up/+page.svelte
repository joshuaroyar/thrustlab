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
		background: linear-gradient(135deg, #223A5E 0%, #FF3C7E 50%, #FFA726 100%);
	}

	.signup-card {
		background: white;
		border-radius: 1.5rem;
		padding: 3rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		transition: all 0.4s ease;
	}

	.signup-card:hover {
		transform: scale(1.01);
		box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
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
		font-size: 1rem;
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
		font-family: 'Roboto', sans-serif;
		font-weight: 600;
		color: #223A5E;
		font-size: 0.95rem;
	}

	input {
		padding: 1rem 1.25rem;
		border: 2px solid #E0E0E0;
		border-radius: 0.75rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	input:focus {
		outline: none;
		border-color: #38C172;
		box-shadow: 0 0 0 3px rgba(56, 193, 114, 0.1);
	}

	.signup-button {
		position: relative;
		background: linear-gradient(135deg, #38C172 0%, #2da85f 100%);
		color: white;
		border: none;
		padding: 1.25rem 2rem;
		border-radius: 0.75rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6px 20px rgba(56, 193, 114, 0.3);
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
		background: rgba(255, 255, 255, 0.2);
		transform: translate(-50%, -50%);
		transition: width 0.6s ease, height 0.6s ease;
	}

	.signup-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.signup-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 30px rgba(56, 193, 114, 0.4);
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
		background: #E0E0E0;
	}

	.divider span {
		background: white;
		padding: 0 1rem;
		position: relative;
		color: #999;
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
	}

	.login-link {
		text-align: center;
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin: 0 0 2rem 0;
	}

	.login-link a {
		color: #38C172;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.login-link a:hover {
		color: #2da85f;
		text-decoration: underline;
	}

	.features-list {
		background: linear-gradient(135deg, rgba(56, 193, 114, 0.05) 0%, rgba(255, 167, 38, 0.05) 100%);
		padding: 1.5rem;
		border-radius: 1rem;
		border: 2px solid #E0E0E0;
	}

	.features-list h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
	}

	.features-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features-list li {
		font-family: 'Roboto', sans-serif;
		color: #666;
		padding: 0.5rem 0;
		font-size: 0.95rem;
	}

	@media (max-width: 768px) {
		.signup-card {
			padding: 2rem;
		}
	}
</style>
