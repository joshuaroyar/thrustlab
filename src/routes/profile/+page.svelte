<script lang="ts">
	import type { PageData } from './$types';
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<AnimatedBackground variant="magenta" />

<div class="page-container">
	<div class="content-card animate-on-scroll">
		<h1>👤 Profile</h1>
		<p class="subtitle">Manage your ThrustLab account</p>

		<div class="profile-section animate-slide-left">
			<div class="avatar">
				<span class="avatar-text">{data.user?.username?.charAt(0).toUpperCase() || 'T'}</span>
			</div>
			
			<div class="profile-info">
				<h2>{data.user?.username || 'Test User'}</h2>
				<p class="user-id">ID: {data.user?.id || 'N/A'}</p>
			</div>
		</div>

		<div class="details-section animate-slide-right">
			<h3>Account Details</h3>
			<div class="detail-item">
				<span class="label">Username:</span>
				<span class="value">{data.user?.username || 'N/A'}</span>
			</div>
			<div class="detail-item">
				<span class="label">User ID:</span>
				<span class="value">{data.user?.id || 'N/A'}</span>
			</div>
			<div class="detail-item">
				<span class="label">Account Type:</span>
				<span class="value badge">Test Account</span>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		background: #F6F7FA;
	}

	.content-card {
		max-width: 800px;
		margin: 0 auto;
		background: white;
		border-radius: 1rem;
		padding: 2.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 2rem;
	}

	.profile-section {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		border-radius: 0.75rem;
		margin-bottom: 2rem;
		color: white;
		transition: all 0.4s ease;
	}

	.profile-section:hover {
		transform: translateX(5px);
		box-shadow: 0 8px 20px rgba(34, 58, 94, 0.3);
	}

	.avatar {
		width: 100px;
		height: 100px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.avatar-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		color: #223A5E;
	}

	.profile-info h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
	}

	.user-id {
		font-family: 'Roboto', sans-serif;
		opacity: 0.9;
		font-size: 0.95rem;
	}

	.details-section {
		padding: 1.5rem;
		background: #F6F7FA;
		border-radius: 0.75rem;
	}

	.details-section h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 1.5rem;
		margin: 0 0 1.5rem 0;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-bottom: 1px solid #ddd;
	}

	.detail-item:last-child {
		border-bottom: none;
	}

	.label {
		font-family: 'Roboto', sans-serif;
		font-weight: 600;
		color: #222831;
	}

	.value {
		font-family: 'Roboto', sans-serif;
		color: #666;
	}

	.badge {
		background: #38C172;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.9rem;
	}
</style>
