<script lang="ts">
	import SkyBackground from '$lib/components/SkyBackground.svelte';
	import type { PageData } from './$types';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { data } = $props<{ data: PageData }>();

	let selectedTest = $state<any>(null);
	let showFeedbackModal = $state(false);
	let aiFeedback = $state<any[] | null>(null);
	let isLoadingFeedback = $state(false);

	function openFeedback(test: any) {
		selectedTest = test;
		showFeedbackModal = true;
		aiFeedback = null;
	}

	function closeFeedback() {
		showFeedbackModal = false;
		selectedTest = null;
		aiFeedback = null;
	}

	async function getAiAnalysis() {
		if (!selectedTest) return;

		const incorrectQuestions = selectedTest.questions.filter(
			(q: any) => q.userAnswer !== q.correctAnswer
		);

		if (incorrectQuestions.length === 0) {
			aiFeedback = [
				{
					questionText: 'Perfect Score!',
					explanation: 'You answered all questions correctly. Keep up the great work!',
					topicToReview: 'Advanced Topics'
				}
			];
			return;
		}

		isLoadingFeedback = true;
		try {
			const res = await fetch('/api/ai-feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ questions: incorrectQuestions })
			});
			const data = await res.json();
			aiFeedback = data.feedback;
		} catch (e) {
			console.error('Error getting AI feedback:', e);
		} finally {
			isLoadingFeedback = false;
		}
	}
</script>

<SkyBackground useRealTime={true} />

<div class="dashboard-container">
	<header class="dashboard-header" in:fly={{ y: -20, duration: 800, delay: 200 }}>
		<div class="welcome-text">
			<h1>Welcome back, <span class="username">{data.user?.fullName}</span></h1>
		</div>
		<div class="date-display">
			{new Date().toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</div>
	</header>

	<div class="stats-grid">
		<div class="stat-card glass-panel" in:scale={{ duration: 500, delay: 300, start: 0.9 }}>
			<div class="stat-icon progress-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"
					></path>
					<polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"
					></polyline>
				</svg>
			</div>
			<div class="stat-content">
				<h3>Course Progress</h3>
				<div class="stat-value">{data.stats.progress}%</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {data.stats.progress}%"></div>
				</div>
			</div>
		</div>

		<div class="stat-card glass-panel" in:scale={{ duration: 500, delay: 400, start: 0.9 }}>
			<div class="stat-icon tests-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
					<polyline points="14 2 14 8 20 8" stroke-linecap="round" stroke-linejoin="round"
					></polyline>
					<line x1="16" y1="13" x2="8" y2="13" stroke-linecap="round" stroke-linejoin="round"
					></line>
					<line x1="16" y1="17" x2="8" y2="17" stroke-linecap="round" stroke-linejoin="round"
					></line>
					<polyline points="10 9 9 9 8 9" stroke-linecap="round" stroke-linejoin="round"
					></polyline>
				</svg>
			</div>
			<div class="stat-content">
				<h3>Tests Completed</h3>
				<div class="stat-value">{data.stats.totalTests}</div>
				<p class="stat-subtitle">Assessments taken</p>
			</div>
		</div>

		<div class="stat-card glass-panel" in:scale={{ duration: 500, delay: 500, start: 0.9 }}>
			<div class="stat-icon score-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
					<line x1="9" y1="9" x2="9.01" y2="9"></line>
					<line x1="15" y1="9" x2="15.01" y2="9"></line>
				</svg>
			</div>
			<div class="stat-content">
				<h3>Average Score</h3>
				<div class="stat-value">{data.stats.averageScore}%</div>
				<p class="stat-subtitle">Across all modules</p>
			</div>
		</div>
	</div>

	<div class="main-content-grid">
		<section class="recent-activity glass-panel" in:fly={{ y: 20, duration: 600, delay: 600 }}>
			<div class="section-header">
				<h2>Recent Activity</h2>
				<a href="/test-bay" class="action-link">Go to Test Bay →</a>
			</div>

			{#if data.recentActivity.length > 0}
				<div class="activity-list">
					{#each data.recentActivity as activity, i}
						<div
							class="activity-item"
							in:fly={{ x: -20, duration: 400, delay: 700 + i * 100 }}
						>
							<div class="activity-status {activity.passed ? 'passed' : 'failed'}">
								{activity.passed ? 'PASS' : 'FAIL'}
							</div>
							<div class="activity-details">
								<h4>{activity.moduleName}</h4>
								<p class="activity-date">{new Date(activity.date).toLocaleDateString()}</p>
							</div>
							<div class="activity-score">
								<span class="score-number">{activity.score}%</span>
							</div>
							<button class="view-btn" onclick={() => openFeedback(activity)}>
								View Feedback
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p>No recent activity found. Start your first assessment!</p>
					<a href="/test-bay" class="cta-button">Start Assessment</a>
				</div>
			{/if}
		</section>

		<section class="quick-actions glass-panel" in:fly={{ y: 20, duration: 600, delay: 700 }}>
			<h2>Quick Actions</h2>
			<div class="actions-grid">
				<a href="/test-bay" class="action-card">
					<div class="action-icon">
						<img src="/icons/test-bay.png" alt="Test Bay" />
					</div>
					<span>Test Bay</span>
				</a>
				<a href="/hangar-zone" class="action-card">
					<div class="action-icon">
						<img src="/icons/hangar-zone.png" alt="Hangar Zone" />
					</div>
					<span>Hangar Zone</span>
				</a>
				<a href="/turbofan-engine" class="action-card">
					<div class="action-icon">
						<img src="/icons/turbofan-engine.png" alt="Turbofan Zone" />
					</div>
					<span>Turbofan Zone</span>
				</a>
				<a href="/overhaul-station" class="action-card">
					<div class="action-icon">
						<img src="/icons/overhaul-station.png" alt="Overhaul Station" />
					</div>
					<span>Overhaul Station</span>
				</a>
				<a href="/profile" class="action-card">
					<div class="action-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
					<span>Edit Profile</span>
				</a>
				<form action="/login?/logout" method="POST" class="action-card-form">
					<button type="submit" class="action-card logout-btn">
						<div class="action-icon">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16 17 21 12 16 7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
						</div>
						<span>Logout</span>
					</button>
				</form>
			</div>
		</section>
	</div>
</div>

{#if showFeedbackModal && selectedTest}
	<div 
		class="modal-backdrop" 
		transition:fade={{ duration: 200 }} 
		aria-label="Close feedback modal"
		tabindex="0"
		onclick={closeFeedback}
		onkeydown={(e) => { if(e.key === 'Escape' || e.key === 'Enter') closeFeedback(); }}
	>
		<div
			class="modal-content glass-panel"
			transition:scale={{ duration: 300, start: 0.95, easing: quintOut }}
			onclick={(e) => e.stopPropagation()}
			role="document"
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="modal-header">
				<h2>Assessment Feedback</h2>
				<button class="close-btn" onclick={closeFeedback}>&times;</button>
			</div>

			<div class="modal-body">
				<div class="test-summary">
					<div class="summary-item">
						<span class="label">Module:</span>
						<span class="value">{selectedTest.moduleName}</span>
					</div>
					<div class="summary-item">
						<span class="label">Score:</span>
						<span class="value {selectedTest.passed ? 'text-green' : 'text-red'}"
							>{selectedTest.score}%</span
						>
					</div>
					<div class="summary-item">
						<span class="label">Date:</span>
						<span class="value">{new Date(selectedTest.date).toLocaleDateString()}</span>
					</div>
				</div>

				{#if !aiFeedback && !isLoadingFeedback}
					<div class="ai-cta">
						<div class="ai-icon">🤖</div>
						<p>Want detailed insights on your performance?</p>
						<button class="ai-btn" onclick={getAiAnalysis}> Generate AI Analysis </button>
					</div>
				{/if}

				{#if isLoadingFeedback}
					<div class="loading-state">
						<div class="spinner"></div>
						<p>Analyzing your answers...</p>
					</div>
				{/if}

				{#if aiFeedback}
					<div class="feedback-results" in:fly={{ y: 20, duration: 400 }}>
						<h3>AI Analysis Results</h3>
						<div class="feedback-list">
							{#each aiFeedback as item}
								<div class="feedback-item">
									<h4>{item.questionText}</h4>
									<p class="explanation">{item.explanation}</p>
									<div class="review-topic">
										<strong>Review Topic:</strong>
										{item.topicToReview}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="questions-review">
					<h3>Question Breakdown</h3>
					{#if selectedTest.questions && selectedTest.questions.length > 0}
						{#each selectedTest.questions as q, i}
							<div
								class="question-item {q.userAnswer === q.correctAnswer
									? 'correct'
									: 'incorrect'}"
							>
								<div class="q-header">
									<span class="q-num">Q{i + 1}</span>
									<span class="q-status"
										>{q.userAnswer === q.correctAnswer ? 'Correct' : 'Incorrect'}</span
									>
								</div>
								<p class="q-text">{q.questionText}</p>
								<div class="q-answer">
									<span class="label">Your Answer:</span>
									<span class="value">{q.userAnswer}</span>
								</div>
								{#if q.userAnswer !== q.correctAnswer}
									<div class="q-correct">
										<span class="label">Correct Answer:</span>
										<span class="value">{q.correctAnswer}</span>
									</div>
								{/if}
							</div>
						{/each}
					{:else}
						<p class="no-details">Detailed question data not available for this test.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.dashboard-container {
		position: relative;
		z-index: 10;
		max-width: 1400px;
		margin: 0 auto;
		padding: 6rem 2rem 2rem;
		min-height: 100vh;
		color: var(--font-primary);
	}

	.glass-panel {
		background: rgba(255, 255, 255, 0.65);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-radius: 24px;
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.glass-panel:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.15);
	}

	/* Header */
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 3rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.welcome-text h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #ffffff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.username {
		background: linear-gradient(120deg, #84fab0, #8fd3f4);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	.date-display {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: #223a5e;
		background: rgba(255, 255, 255, 0.5);
		padding: 0.5rem 1rem;
		border-radius: 12px;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.stat-icon {
		width: 60px;
		height: 60px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.stat-icon svg {
		width: 30px;
		height: 30px;
	}

	.progress-icon {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	}
	.tests-icon {
		background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
	}
	.score-icon {
		background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
	}

	.stat-content {
		flex: 1;
	}

	.stat-content h3 {
		font-size: 1rem;
		color: #666;
		margin: 0 0 0.25rem 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 600;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 800;
		color: #223a5e;
		line-height: 1.2;
	}

	.stat-subtitle {
		font-size: 0.85rem;
		color: #888;
		margin: 0;
	}

	.progress-bar {
		height: 6px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		margin-top: 0.5rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #4facfe;
		border-radius: 3px;
	}

	/* Main Content Grid */
	.main-content-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 1024px) {
		.main-content-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.dashboard-container {
			padding: 5rem 1rem 1rem;
		}

		.dashboard-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.welcome-text h1 {
			font-size: 2rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.stat-card {
			padding: 1rem;
		}

		.actions-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Recent Activity */
	.recent-activity {
		padding: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.section-header h2 {
		font-size: 1.5rem;
		margin: 0;
		color: #223a5e;
	}

	.action-link {
		color: #38c172;
		font-weight: 600;
		text-decoration: none;
		transition: color 0.2s;
	}

	.action-link:hover {
		color: #2da85f;
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-item {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		transition: background 0.2s;
	}

	.activity-item:hover {
		background: rgba(255, 255, 255, 0.6);
	}

	.activity-status {
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.25rem 0.75rem;
		border-radius: 8px;
		margin-right: 1rem;
		min-width: 60px;
		text-align: center;
	}

	.activity-status.passed {
		background: rgba(56, 193, 114, 0.2);
		color: #2da85f;
	}

	.activity-status.failed {
		background: rgba(255, 60, 126, 0.2);
		color: #ff3c7e;
	}

	.activity-details {
		flex: 1;
	}

	.activity-details h4 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		color: #223a5e;
	}

	.activity-date {
		margin: 0;
		font-size: 0.85rem;
		color: #888;
	}

	.activity-score {
		margin-right: 1.5rem;
		font-weight: 800;
		font-size: 1.2rem;
		color: #223a5e;
	}

	.view-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		color: #555;
		cursor: pointer;
		transition: all 0.2s;
	}

	.view-btn:hover {
		background: #f5f5f5;
		border-color: #ccc;
	}

	/* Quick Actions */
	.quick-actions {
		padding: 2rem;
	}

	.quick-actions h2 {
		font-size: 1.5rem;
		margin: 0 0 1.5rem 0;
		color: #223a5e;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.action-card {
		background: rgba(255, 255, 255, 0.4);
		padding: 1.5rem;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: #223a5e;
		border: 1px solid rgba(255, 255, 255, 0.3);
		transition: all 0.2s;
		text-align: center;
	}

	.action-card:hover {
		background: rgba(255, 255, 255, 0.7);
		transform: translateY(-3px);
	}

	.action-card-form {
		display: contents;
	}

	.logout-btn {
		width: 100%;
		border: 1px solid rgba(255, 60, 126, 0.3);
		cursor: pointer;
		font-family: inherit;
	}

	.logout-btn:hover {
		background: rgba(255, 60, 126, 0.1);
		border-color: rgba(255, 60, 126, 0.5);
	}

	.action-icon {
		width: 48px;
		height: 48px;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-icon img,
	.action-icon svg {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.action-card span {
		font-weight: 600;
		font-size: 0.9rem;
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(5px);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.modal-content {
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		overflow-y: auto;
		background: rgba(255, 255, 255, 0.95);
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		background: rgba(255, 255, 255, 0.95);
		z-index: 10;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #223a5e;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		color: #888;
	}

	.modal-body {
		padding: 2rem;
	}

	.test-summary {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.summary-item {
		display: flex;
		flex-direction: column;
	}

	.summary-item .label {
		font-size: 0.85rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.summary-item .value {
		font-size: 1.2rem;
		font-weight: 700;
		color: #223a5e;
	}

	.text-green {
		color: #2da85f !important;
	}
	.text-red {
		color: #ff3c7e !important;
	}

	.ai-cta {
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border: 1px solid #bae6fd;
		border-radius: 16px;
		padding: 1.5rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	.ai-icon {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.ai-cta p {
		margin: 0 0 1rem 0;
		color: #0369a1;
		font-weight: 500;
	}

	.ai-btn {
		background: #0284c7;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
	}

	.ai-btn:hover {
		background: #0369a1;
	}

	.loading-state {
		text-align: center;
		padding: 2rem;
		color: #666;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #0284c7;
		border-radius: 50%;
		margin: 0 auto 1rem auto;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.feedback-results {
		margin-bottom: 2rem;
		background: #f8fafc;
		border-radius: 16px;
		padding: 1.5rem;
		border: 1px solid #e2e8f0;
	}

	.feedback-results h3 {
		margin: 0 0 1rem 0;
		color: #223a5e;
	}

	.feedback-item {
		background: white;
		padding: 1rem;
		border-radius: 12px;
		margin-bottom: 1rem;
		border: 1px solid #f1f5f9;
	}

	.feedback-item h4 {
		margin: 0 0 0.5rem 0;
		color: #223a5e;
	}

	.explanation {
		color: #475569;
		line-height: 1.5;
		margin: 0 0 0.5rem 0;
	}

	.review-topic {
		font-size: 0.9rem;
		color: #0284c7;
	}

	.questions-review h3 {
		margin: 0 0 1rem 0;
		color: #223a5e;
	}

	.question-item {
		padding: 1rem;
		border-radius: 12px;
		margin-bottom: 1rem;
		border: 1px solid #e2e8f0;
	}

	.question-item.correct {
		background: #f0fdf4;
		border-color: #bbf7d0;
	}

	.question-item.incorrect {
		background: #fef2f2;
		border-color: #fecaca;
	}

	.q-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.q-num {
		font-weight: 700;
		color: #64748b;
	}

	.q-status {
		font-weight: 700;
		font-size: 0.85rem;
		text-transform: uppercase;
	}

	.correct .q-status {
		color: #16a34a;
	}
	.incorrect .q-status {
		color: #dc2626;
	}

	.q-text {
		margin: 0 0 0.75rem 0;
		font-weight: 500;
		color: #1e293b;
	}

	.q-answer,
	.q-correct {
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
	}

	.q-answer .label,
	.q-correct .label {
		font-weight: 600;
		color: #64748b;
		margin-right: 0.5rem;
	}

	.no-details {
		color: #94a3b8;
		font-style: italic;
	}
</style>
