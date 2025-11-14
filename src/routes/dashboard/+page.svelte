<script lang="ts">
	import type { PageData } from './$types';
	import SkyParallax from '$lib/components/ui/SkyParallax.svelte';

	let { data } = $props<{ data: PageData }>();
	
	let activeTab = $state<'dashboard' | 'profile'>('dashboard');
</script>

<SkyParallax skyMode="day" staticSky={true} enableDrift={true} />

<div class="page-container">
	<div class="content-card animate-on-scroll">
		<!-- Tab Navigation -->
		<div class="tabs">
			<button 
				class="tab-button" 
				class:active={activeTab === 'dashboard'}
				onclick={() => activeTab = 'dashboard'}
			>
				🎯 Dashboard
			</button>
			<button 
				class="tab-button" 
				class:active={activeTab === 'profile'}
				onclick={() => activeTab = 'profile'}
			>
				👤 Profile
			</button>
		</div>

		<!-- Dashboard View -->
		{#if activeTab === 'dashboard'}
		<div class="tab-content">
			<h1>🎯 Dashboard</h1>
			<p class="welcome">Welcome back, <strong>{data.user?.username || 'User'}</strong>!</p>
			
			<div class="stats-grid animate-on-scroll">
				<div class="stat-card animate-scale" style="--delay: 0.1s">
					<div class="stat-icon">📊</div>
					<h3>Progress</h3>
					<p class="stat-value">75%</p>
					<p class="stat-label">Course Completion</p>
				</div>
				
				<div class="stat-card animate-scale" style="--delay: 0.2s">
					<div class="stat-icon">🎓</div>
					<h3>Assessments</h3>
					<p class="stat-value">8/10</p>
					<p class="stat-label">Tests Completed</p>
				</div>
				
				<div class="stat-card animate-scale" style="--delay: 0.3s">
					<div class="stat-icon">⭐</div>
					<h3>Score</h3>
					<p class="stat-value">92%</p>
					<p class="stat-label">Average Score</p>
				</div>
			</div>

			<div class="info-section animate-on-scroll">
				<h2>Recent Activity</h2>
				<ul class="activity-list">
					<li>✅ Completed Hangar Zone tutorial</li>
					<li>✅ Passed Turbofan Engine assessment</li>
					<li>🔄 Started Overhaul Station module</li>
				</ul>
			</div>
		</div>
		{/if}

		<!-- Profile View -->
		{#if activeTab === 'profile'}
		<div class="tab-content">
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
		{/if}
	</div>
</div>

<style>
	.page-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		padding: 8rem 2rem 4rem;
		background: transparent;
	}

	.content-card {
		max-width: 1200px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		padding: 0;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	/* Tab Navigation */
	.tabs {
		display: flex;
		border-bottom: 2px solid #E8E8E8;
		background: #F9F9F9;
	}

	.tab-button {
		flex: 1;
		padding: 1.25rem 2rem;
		background: transparent;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #666;
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
	}

	.tab-button:hover {
		background: rgba(34, 58, 94, 0.05);
		color: #223A5E;
	}

	.tab-button.active {
		background: white;
		color: #223A5E;
	}

	.tab-button.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #223A5E 0%, #38C172 100%);
	}

	/* Tab Content */
	.tab-content {
		padding: 2.5rem;
	}

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.welcome {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 2rem;
	}

	/* Dashboard Styles */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: linear-gradient(135deg, #223A5E 0%, #38C172 100%);
		color: white;
		padding: 2rem;
		border-radius: 0.75rem;
		text-align: center;
		box-shadow: 0 4px 12px rgba(34, 58, 94, 0.2);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--delay, 0s);
	}

	.stat-card:hover {
		transform: translateY(-10px) scale(1.05);
		box-shadow: 0 8px 20px rgba(34, 58, 94, 0.3);
	}

	.stat-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.stat-card h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.2rem;
		margin: 0 0 1rem 0;
	}

	.stat-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0.5rem 0;
	}

	.stat-label {
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.info-section {
		margin-top: 2rem;
	}

	h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.activity-list li {
		font-family: 'Roboto', sans-serif;
		font-size: 1.1rem;
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: #F6F7FA;
		border-left: 4px solid #38C172;
		border-radius: 0.5rem;
	}

	/* Profile Styles */
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

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.tab-content {
			padding: 1.5rem;
		}

		.tab-button {
			padding: 1rem;
			font-size: 0.95rem;
		}

		.profile-section {
			flex-direction: column;
			text-align: center;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>
