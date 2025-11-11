<script lang="ts">
	import type { PageData } from './$types';
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<AnimatedBackground variant="blue" />

<div class="page-container">
	<div class="content-card animate-on-scroll">
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
</div>

<style>
	.page-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		background: #F6F7FA;
	}

	.content-card {
		max-width: 1200px;
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
		margin: 0 0 1rem 0;
	}

	.welcome {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}

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
</style>
