<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to dashboard with profile tab
		goto('/dashboard');
	});
</script>

<div class="redirect-container">
	<div class="redirect-message">
		<div class="spinner"></div>
		<p>Redirecting to Dashboard...</p>
	</div>
</div>

<style>
	.redirect-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #F6F7FA;
	}

	.redirect-message {
		text-align: center;
		padding: 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #E8E8E8;
		border-top-color: #223A5E;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 1.1rem;
		margin: 0;
	}
</style>
