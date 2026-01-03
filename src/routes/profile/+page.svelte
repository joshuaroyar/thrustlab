<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import SkyBackground from '$lib/components/ui/SkyBackground.svelte';
	import { fade, fly, scale } from 'svelte/transition';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<SkyBackground useRealTime={true} />

<div class="dashboard-container">
	<header class="dashboard-header" in:fly={{ y: -20, duration: 800, delay: 200 }}>
		<div class="welcome-text">
			<h1>Profile Settings</h1>
			<p>Manage your account details and security preferences.</p>
		</div>
	</header>

	{#if form?.message}
		<div class="alert success glass-panel" in:fly={{ y: 20, duration: 400 }}>
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="alert error glass-panel" in:fly={{ y: 20, duration: 400 }}>
			{form.error}
		</div>
	{/if}

	<div class="main-content-grid">
		<!-- Left Column: Profile Card & Activity -->
		<div class="left-column">
			<section
				class="profile-card glass-panel"
				in:scale={{ duration: 500, delay: 300, start: 0.9 }}
			>
				<div class="avatar-container">
					<div class="avatar">
						<span class="avatar-text"
							>{data.profile?.username?.charAt(0).toUpperCase() ||
								data.user?.email?.charAt(0).toUpperCase() ||
								'T'}</span
						>
					</div>
				</div>
				<div class="profile-info">
					<h2>{data.profile?.fullName || data.user?.user_metadata?.full_name || 'Pilot'}</h2>
					<p class="username-display">
						@{data.profile?.username || data.user?.user_metadata?.username || 'username'}
					</p>
				</div>
			</section>

			<section class="activity-section glass-panel" in:fly={{ y: 20, duration: 600, delay: 400 }}>
				<h3>Recent Activity</h3>
				<div class="activity-list">
					<div class="activity-item">
						<span class="activity-icon">🔐</span>
						<div class="activity-content">
							<p class="activity-title">Logged In</p>
							<p class="activity-time">Just now</p>
						</div>
					</div>
					<div class="activity-item">
						<span class="activity-icon">🚀</span>
						<div class="activity-content">
							<p class="activity-title">Visited Dashboard</p>
							<p class="activity-time">2 minutes ago</p>
						</div>
					</div>
					<div class="activity-item">
						<span class="activity-icon">📝</span>
						<div class="activity-content">
							<p class="activity-title">Updated Profile</p>
							<p class="activity-time">1 hour ago</p>
						</div>
					</div>
				</div>
			</section>
		</div>

		<!-- Right Column: Forms -->
		<div class="right-column">
			<section class="form-section glass-panel" in:fly={{ x: 20, duration: 600, delay: 500 }}>
				<h3>Edit Profile</h3>
				<form method="POST" action="?/updateProfile" use:enhance class="profile-form">
					<div class="form-group">
						<label for="fullName">Full Name</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={data.profile?.fullName || data.user?.user_metadata?.full_name || ''}
							placeholder="Enter full name"
						/>
					</div>
					<div class="form-group">
						<label for="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={data.profile?.username || data.user?.user_metadata?.username || ''}
							placeholder="Enter username"
						/>
					</div>
					<button type="submit" class="btn-primary">Update Profile</button>
				</form>
			</section>

			<section class="form-section glass-panel" in:fly={{ x: 20, duration: 600, delay: 600 }}>
				<h3>Security</h3>
				<form method="POST" action="?/changePassword" use:enhance class="profile-form">
					<div class="form-group">
						<label for="password">New Password</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="New password"
							required
						/>
					</div>
					<div class="form-group">
						<label for="confirmPassword">Confirm Password</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							placeholder="Confirm new password"
							required
						/>
					</div>
					<button type="submit" class="btn-secondary">Change Password</button>
				</form>
			</section>

			<section class="danger-zone glass-panel" in:fly={{ x: 20, duration: 600, delay: 700 }}>
				<h3>Danger Zone</h3>
				<p>Once you delete your account, there is no going back. Please be certain.</p>
				<form method="POST" action="?/deleteAccount" use:enhance>
					<button
						type="submit"
						class="btn-danger"
						onclick={(e) => {
							if (
								!confirm(
									'Are you sure you want to delete your account? This action cannot be undone.'
								)
							)
								e.preventDefault();
						}}>Delete Account</button
					>
				</form>
			</section>
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.dashboard-container {
		position: relative;
		z-index: 10;
		max-width: 1400px;
		margin: 0 auto;
		padding: 6rem 2rem 2rem; /* align with dashboard spacing under navbar */
		min-height: 100vh;
		color: var(--sky-text);
		text-shadow: var(--sky-text-shadow);
	}

	.glass-panel {
		background: var(--sky-surface-soft);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--sky-border);
		border-radius: 24px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		padding: var(--spacing-lg);
	}

	.glass-panel:hover {
		transform: translateY(-5px);
		box-shadow: 0 14px 44px rgba(0, 0, 0, 0.22);
	}

	/* Header */
	.dashboard-header {
		margin-bottom: 3rem;
	}

	.welcome-text h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #ffffff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.welcome-text p {
		font-size: 1.1rem;
		color: var(--sky-text-muted);
		margin: 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* Layout */
	.main-content-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
	}

	.left-column,
	.right-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 900px) {
		.main-content-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.dashboard-container {
			padding: 6rem 1rem 1.25rem;
		}

		.welcome-text h1 {
			font-size: 2rem;
		}

		.glass-panel {
			padding: var(--spacing-md);
		}
	}

	/* Profile Card */
	.profile-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
	}

	.avatar-container {
		margin-bottom: 1.5rem;
	}

	.avatar {
		width: 120px;
		height: 120px;
		background: linear-gradient(
			135deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 100%
		);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
		border: 4px solid rgba(255, 255, 255, 0.6);
	}

	.avatar-text {
		font-size: 3.5rem;
		font-weight: 700;
		color: white;
	}

	.profile-info h2 {
		font-size: 1.8rem;
		color: var(--sky-text);
		margin: 0 0 0.25rem 0;
	}

	.username-display {
		color: var(--font-accent-cyan);
		font-weight: 600;
		font-size: 1rem;
		margin: 0 0 0.5rem 0;
	}

	/* Activity Section */
	.activity-section h3 {
		font-size: 1.2rem;
		color: var(--sky-text);
		margin: 0 0 1.5rem 0;
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: var(--sky-surface);
		border-radius: 12px;
		border: 1px solid var(--sky-border-soft);
	}

	.activity-icon {
		font-size: 1.2rem;
	}

	.activity-title {
		font-weight: 600;
		color: var(--sky-text);
		margin: 0;
		font-size: 0.95rem;
	}

	.activity-time {
		font-size: 0.8rem;
		color: var(--sky-text-subtle);
		margin: 0;
	}

	/* Forms */
	.form-section h3 {
		font-size: 1.5rem;
		color: var(--sky-text);
		margin: 0 0 1.5rem 0;
	}

	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: var(--sky-text-muted);
		font-size: 0.9rem;
	}

	input {
		padding: 0.8rem 1rem;
		border: 1px solid var(--sky-border);
		border-radius: 12px;
		background: var(--sky-surface-soft);
		font-size: 1rem;
		transition: all 0.2s;
		color: var(--sky-text);
	}

	input::placeholder {
		color: var(--sky-text-subtle);
	}

	input:focus {
		outline: none;
		border-color: var(--font-accent-cyan);
		background: var(--sky-surface);
		box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.25);
	}

	button {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 100%
		);
		color: var(--ui-dark-teal);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
	}

	.btn-secondary {
		background: var(--sky-surface-soft);
		color: var(--sky-text);
		border: 1px solid var(--sky-border);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.btn-secondary:hover {
		background: var(--sky-surface);
		transform: translateY(-2px);
	}

	/* Danger Zone */
	.danger-zone {
		border-color: rgba(244, 63, 94, 0.35);
		background: var(--sky-surface);
	}

	.danger-zone h3 {
		color: #f43f5e;
		margin: 0 0 0.5rem 0;
	}

	.danger-zone p {
		color: var(--sky-text-subtle);
		margin-bottom: 1.5rem;
	}

	.btn-danger {
		background: #f43f5e;
		color: white;
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
	}

	.btn-danger:hover {
		background: #e11d48;
		transform: translateY(-2px);
	}

	/* Alerts */
	.alert {
		padding: var(--spacing-sm) var(--spacing-md);
		margin-bottom: 2rem;
		font-weight: 500;
	}

	.alert.success {
		background: rgba(34, 197, 94, 0.12);
		border-color: rgba(34, 197, 94, 0.35);
		color: #bbf7d0;
	}

	.alert.error {
		background: rgba(244, 63, 94, 0.12);
		border-color: rgba(244, 63, 94, 0.35);
		color: #fecdd3;
	}
</style>
