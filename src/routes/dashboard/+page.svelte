<script lang="ts">
	import { onMount } from 'svelte';
	import SkyBackground from '$lib/components/ui/SkyBackground.svelte';
	import type { PageData } from './$types';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { data } = $props<{ data: PageData }>();

	// --- State ---
	let selectedTest = $state<any>(null);
	let showFeedbackModal = $state(false);
	let aiFeedback = $state<any[] | null>(null);
	let isLoadingFeedback = $state(false);

	// --- Actions ---
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

	// --- Helpers ---
	function getGreeting() {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) return 'Good Morning';
		if (hour >= 12 && hour < 17) return 'Good Afternoon';
		if (hour >= 17 && hour < 21) return 'Good Evening';
		return 'Good Night';
	}

	onMount(() => {
		if (typeof document === 'undefined') return;
		document.body.classList.add('dashboard-page');
		document.documentElement.classList.add('dashboard-page');
		return () => {
			document.body.classList.remove('dashboard-page');
			document.documentElement.classList.remove('dashboard-page');
		};
	});
</script>

<SkyBackground useRealTime={true} />

<div class="dashboard-wrapper">
	<div class="dashboard-content">
		<!-- Header Section -->
		<header class="header-section" in:fly={{ y: -30, duration: 800, delay: 100 }}>
			<div class="pilot-info">
				<div class="avatar-ring">
					<div class="avatar">
						{data.user?.fullName?.charAt(0) || 'P'}
					</div>
				</div>
				<div class="text-content">
					<h1 class="pilot-name">{getGreeting()}, {data.user?.fullName}</h1>
				</div>
			</div>
			<div class="date-widget">
				<div class="date-day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
				<div class="date-full">
					{new Date().toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
			</div>
		</header>

		<!-- Stats Grid -->
		<section class="stats-row">
			<!-- Progress Card -->
			<div class="stat-card" in:scale={{ duration: 500, delay: 200, start: 0.9 }}>
				<div class="stat-icon-wrapper blue">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline
							points="22 4 12 14.01 9 11.01"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="stat-details">
					<span class="stat-label">Training Progress</span>
					<div class="stat-value-row">
						<span class="stat-number">{data.stats.progress}%</span>
					</div>
					<div class="progress-track">
						<div class="progress-bar" style="width: {data.stats.progress}%"></div>
					</div>
				</div>
			</div>

			<!-- Tests Card -->
			<div class="stat-card" in:scale={{ duration: 500, delay: 300, start: 0.9 }}>
				<div class="stat-icon-wrapper green">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline points="14 2 14 8 20 8" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="16" y1="13" x2="8" y2="13" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="16" y1="17" x2="8" y2="17" stroke-linecap="round" stroke-linejoin="round" />
						<polyline points="10 9 9 9 8 9" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
				<div class="stat-details">
					<span class="stat-label">Modules Completed</span>
					<div class="stat-value-row">
						<span class="stat-number">{data.stats.totalTests}</span>
						<span class="stat-unit">missions</span>
					</div>
				</div>
			</div>

			<!-- Score Card -->
			<div class="stat-card" in:scale={{ duration: 500, delay: 400, start: 0.9 }}>
				<div class="stat-icon-wrapper orange">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<path d="M8 14s1.5 2 4 2 4-2 4-2" />
						<line x1="9" y1="9" x2="9.01" y2="9" />
						<line x1="15" y1="9" x2="15.01" y2="9" />
					</svg>
				</div>
				<div class="stat-details">
					<span class="stat-label">Performance Rating</span>
					<div class="stat-value-row">
						<span class="stat-number">{data.stats.averageScore}%</span>
						<span class="stat-grade">
							{#if data.stats.averageScore >= 90}A
							{:else if data.stats.averageScore >= 80}B
							{:else if data.stats.averageScore >= 70}C
							{:else}D{/if}
						</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Main Grid -->
		<div class="main-grid">
			<!-- Left Column: Activity Log -->
			<section class="panel activity-panel" in:fly={{ y: 20, duration: 600, delay: 500 }}>
				<div class="panel-header">
					<h2>Mission Log</h2>
					<a href="/test-bay" class="view-all">View All History →</a>
				</div>

				<div class="activity-list">
					{#if data.recentActivity.length > 0}
						{#each data.recentActivity as activity, i}
							<div
								class="activity-row"
								in:slide={{ axis: 'y', duration: 300, delay: 600 + i * 100 }}
							>
								<div class="activity-status-indicator {activity.passed ? 'pass' : 'fail'}"></div>
								<div class="activity-main">
									<div class="activity-info">
										<span class="activity-type"
											>{activity.type === 'test' ? 'Assessment' : 'Simulation'}</span
										>
										<h3 class="activity-title">{activity.moduleName}</h3>
									</div>
									<div class="activity-meta">
										<span class="activity-date">{new Date(activity.date).toLocaleDateString()}</span
										>
										<span class="activity-score {activity.passed ? 'score-pass' : 'score-fail'}">
											{activity.score}%
										</span>
									</div>
								</div>
								{#if activity.type === 'test'}
									<button
										class="btn-icon"
										onclick={() => openFeedback(activity)}
										aria-label="View Feedback"
									>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									</button>
								{/if}
							</div>
						{/each}
					{:else}
						<div class="empty-state">
							<div class="empty-icon">📝</div>
							<p>No missions recorded yet.</p>
							<a href="/test-bay" class="btn-primary">Start First Mission</a>
						</div>
					{/if}
				</div>
			</section>

			<!-- Right Column: Quick Actions -->
			<section class="panel actions-panel" in:fly={{ y: 20, duration: 600, delay: 600 }}>
				<div class="panel-header">
					<h2>Quick Access</h2>
				</div>
				<div class="actions-grid">
					<a href="/test-bay" class="action-tile">
						<img src="/icons/test-bay.png" alt="Test Bay" class="tile-icon" />
						<span>Test Bay</span>
					</a>
					<a href="/hangar-zone" class="action-tile">
						<img src="/icons/hangar-zone.png" alt="Hangar Zone" class="tile-icon" />
						<span>Hangar Zone</span>
					</a>
					<a href="/turbofan-engine" class="action-tile">
						<img src="/icons/turbofan-engine.png" alt="Turbofan Engine" class="tile-icon" />
						<span>Turbofan Engine</span>
					</a>
					<a href="/overhaul-station" class="action-tile">
						<img src="/icons/overhaul-station.png" alt="Overhaul Station" class="tile-icon" />
						<span>Overhaul Station</span>
					</a>
					<a href="/jaja" class="action-tile">
						<img src="/icons/jaja.png" alt="Ask JAJA" class="tile-icon" />
						<span>Ask JAJA</span>
					</a>
					<a href="/profile" class="action-tile">
						<div class="tile-icon text-icon">👤</div>
						<span>Profile</span>
					</a>
				</div>

				<div class="logout-wrapper">
					<form action="/login?/logout" method="POST">
						<button type="submit" class="btn-logout">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
								<polyline points="16 17 21 12 16 7" />
								<line x1="21" y1="12" x2="9" y2="12" />
							</svg>
							Sign Out
						</button>
					</form>
				</div>
			</section>
		</div>
	</div>
</div>

<!-- Feedback Modal (Refined) -->
{#if showFeedbackModal && selectedTest}
	<div
		class="modal-overlay"
		transition:fade={{ duration: 200 }}
		onclick={closeFeedback}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && closeFeedback()}
	>
		<div
			class="modal-card"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			transition:scale={{ duration: 300, start: 0.95, easing: quintOut }}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal-header">
				<div>
					<h2 class="modal-title">Mission Debrief</h2>
					<p class="modal-subtitle">{selectedTest.moduleName}</p>
				</div>
				<button class="btn-close" onclick={closeFeedback}>&times;</button>
			</div>

			<div class="modal-body">
				<div class="score-banner {selectedTest.passed ? 'banner-pass' : 'banner-fail'}">
					<div class="score-value">{selectedTest.score}%</div>
					<div class="score-label">
						{selectedTest.passed ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
					</div>
				</div>

				{#if !aiFeedback && !isLoadingFeedback}
					<div class="ai-prompt">
						<p>Request AI analysis of mission performance?</p>
						<button class="btn-ai" onclick={getAiAnalysis}>
							<span>✨</span> Analyze Data
						</button>
					</div>
				{/if}

				{#if isLoadingFeedback}
					<div class="loading-indicator">
						<div class="spinner"></div>
						<span>Processing mission data...</span>
					</div>
				{/if}

				{#if aiFeedback}
					<div class="ai-results" in:slide>
						<h3>AI Tactical Analysis</h3>
						{#each aiFeedback as item}
							<div class="ai-item">
								<div class="ai-q">{item.questionText}</div>
								<div class="ai-exp">{item.explanation}</div>
								<div class="ai-topic">Review: {item.topicToReview}</div>
							</div>
						{/each}
					</div>
				{/if}

				<div class="questions-list">
					<h3>Flight Recorder Data</h3>
					{#if selectedTest.questions && selectedTest.questions.length > 0}
						{#each selectedTest.questions as q, i}
							<div class="q-item {q.userAnswer === q.correctAnswer ? 'q-correct' : 'q-incorrect'}">
								<div class="q-header">
									<span class="q-idx">#{i + 1}</span>
									<span class="q-status"
										>{q.userAnswer === q.correctAnswer ? 'CORRECT' : 'INCORRECT'}</span
									>
								</div>
								<p class="q-text">{q.questionText}</p>
								<div class="q-details">
									<div class="q-ans">
										<span class="label">Pilot Input:</span>
										<span class="val">{q.userAnswer}</span>
									</div>
									{#if q.userAnswer !== q.correctAnswer}
										<div class="q-ans correct">
											<span class="label">Optimal Input:</span>
											<span class="val">{q.correctAnswer}</span>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					{:else}
						<p class="no-data">Telemetry data unavailable.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* --- Layout & Container --- */
	.dashboard-wrapper {
		min-height: 100vh;
		padding: 6rem 2rem 2rem; /* Top padding for navbar */
		position: relative;
		z-index: 1;
		color: var(--sky-text);
		font-family: var(--font-body);
		text-shadow: var(--sky-text-shadow);
	}

	.dashboard-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* --- Header --- */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: transparent;
		backdrop-filter: none;
		padding: 0;
		border-radius: 0;
		border: none;
		box-shadow: none;
	}

	.pilot-info {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.avatar-ring {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: transparent;
		padding: 0;
		box-shadow: none;
	}

	.avatar {
		width: 100%;
		height: 100%;
		background: var(--sky-surface-strong);
		border-radius: 50%;
		border: 1px solid var(--sky-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--sky-text);
	}

	.text-content {
		display: flex;
		flex-direction: column;
	}

	.pilot-name {
		font-family: 'Poppins', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0;
		color: var(--sky-text);
	}

	.date-widget {
		text-align: right;
	}

	.date-day {
		font-size: 1.2rem;
		font-weight: 800;
		color: var(--sky-text);
	}

	.date-full {
		font-size: 1rem;
		font-weight: 700;
		color: var(--sky-text-muted);
	}

	/* --- Stats Row --- */
	.stats-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.stat-card {
		background: var(--sky-surface);
		backdrop-filter: blur(12px);
		border: 1px solid var(--sky-border-soft);
		border-radius: 20px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		background: var(--sky-surface-strong);
	}

	.stat-icon-wrapper {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.stat-icon-wrapper svg {
		width: 28px;
		height: 28px;
	}

	.stat-icon-wrapper.blue {
		background: rgba(56, 189, 248, 0.2);
		color: #38bdf8;
	}
	.stat-icon-wrapper.green {
		background: rgba(74, 222, 128, 0.2);
		color: #4ade80;
	}
	.stat-icon-wrapper.orange {
		background: rgba(251, 146, 60, 0.2);
		color: #fb923c;
	}

	.stat-details {
		flex: 1;
	}

	.stat-label {
		font-size: 1rem;
		color: var(--sky-text-subtle);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0.25rem 0;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--sky-text);
		line-height: 1;
	}

	.stat-unit {
		font-size: 1.1rem;
		color: var(--sky-text-subtle);
	}

	.stat-grade {
		font-size: 2rem;
		font-weight: 800;
		color: #fb923c;
	}

	.progress-track {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 3px;
		margin-top: 0.5rem;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #38bdf8, #818cf8);
		border-radius: 3px;
	}

	/* --- Main Grid --- */
	.main-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 2rem;
	}

	.panel {
		background: var(--sky-surface-soft);
		backdrop-filter: blur(12px);
		border: 1px solid var(--sky-border-soft);
		border-radius: 24px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--sky-border-soft);
	}

	.panel-header h2 {
		font-family: 'Poppins', sans-serif;
		font-size: 1.5rem;
		margin: 0;
		color: var(--sky-text);
	}

	.view-all {
		font-size: 1rem;
		color: #38bdf8;
		text-decoration: none;
		transition: color 0.2s;
	}

	.view-all:hover {
		color: #7dd3fc;
	}

	/* --- Activity List --- */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--sky-surface-soft);
		border-radius: 16px;
		border: 1px solid var(--sky-border-soft);
		transition: background 0.2s;
	}

	.activity-row:hover {
		background: var(--sky-surface);
	}

	.activity-status-indicator {
		width: 4px;
		height: 40px;
		border-radius: 2px;
	}

	.activity-status-indicator.pass {
		background: #4ade80;
		box-shadow: 0 0 10px rgba(74, 222, 128, 0.4);
	}
	.activity-status-indicator.fail {
		background: #f43f5e;
		box-shadow: 0 0 10px rgba(244, 63, 94, 0.4);
	}

	.activity-main {
		flex: 1;
	}

	.activity-info {
		display: flex;
		flex-direction: column;
	}

	.activity-type {
		font-size: 0.9rem;
		color: var(--sky-text-subtle);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.activity-title {
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0;
		color: var(--sky-text);
	}

	.activity-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.25rem;
	}

	.activity-date {
		font-size: 1rem;
		color: var(--sky-text-subtle);
	}

	.activity-score {
		font-size: 1.1rem;
		font-weight: 700;
	}

	.score-pass {
		color: #4ade80;
	}
	.score-fail {
		color: #f43f5e;
	}

	.btn-icon {
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: #fff;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-icon:hover {
		background: #38bdf8;
		color: #0f172a;
	}

	.btn-icon svg {
		width: 20px;
		height: 20px;
	}

	/* --- Quick Actions --- */
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.action-tile {
		background: var(--sky-surface-soft);
		border: 1px solid var(--sky-border-soft);
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--sky-text);
		transition: all 0.2s;
	}

	.action-tile:hover {
		background: var(--sky-surface);
		transform: translateY(-2px);
		border-color: var(--sky-border);
	}

	.tile-icon {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.tile-icon.text-icon {
		width: auto;
		height: auto;
		font-size: 1.5rem;
	}

	.action-tile span {
		font-size: 1.1rem;
		font-weight: 500;
	}

	.logout-wrapper {
		margin-top: auto;
		padding-top: 1.5rem;
	}

	.btn-logout {
		width: 100%;
		background: rgba(244, 63, 94, 0.1);
		border: 1px solid rgba(244, 63, 94, 0.3);
		color: #f43f5e;
		padding: 0.75rem;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: all 0.2s;
	}

	.btn-logout:hover {
		background: rgba(244, 63, 94, 0.2);
	}

	.btn-logout svg {
		width: 18px;
		height: 18px;
	}

	/* --- Modal --- */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(8px);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.modal-card {
		background: #1e293b;
		width: 100%;
		max-width: 700px;
		max-height: 85vh;
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: #fff;
	}

	.modal-header {
		padding: 1.5rem 2rem;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.modal-title {
		font-size: 1.8rem;
		margin: 0;
		color: #fff;
	}

	.modal-subtitle {
		margin: 0.25rem 0 0;
		color: #94a3b8;
		font-size: 1.1rem;
	}

	.btn-close {
		background: none;
		border: none;
		color: #94a3b8;
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
	}

	.btn-close:hover {
		color: #fff;
	}

	.modal-body {
		padding: 2rem;
		overflow-y: auto;
	}

	.score-banner {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		border-radius: 16px;
		margin-bottom: 2rem;
	}

	.banner-pass {
		background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(74, 222, 128, 0.05));
		border: 1px solid rgba(74, 222, 128, 0.2);
	}
	.banner-fail {
		background: linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.05));
		border: 1px solid rgba(244, 63, 94, 0.2);
	}

	.score-value {
		font-size: 4rem;
		font-weight: 800;
		line-height: 1;
	}

	.banner-pass .score-value {
		color: #4ade80;
	}
	.banner-fail .score-value {
		color: #f43f5e;
	}

	.score-label {
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: 1px;
		margin-top: 0.5rem;
		opacity: 0.9;
	}

	.ai-prompt {
		background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent);
		border-left: 4px solid #38bdf8;
		padding: 1rem 1.5rem;
		border-radius: 0 12px 12px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.btn-ai {
		background: #38bdf8;
		color: #0f172a;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background 0.2s;
	}

	.btn-ai:hover {
		background: #7dd3fc;
	}

	.ai-results {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.ai-results h3 {
		margin: 0 0 1rem;
		color: #38bdf8;
		font-size: 1.3rem;
	}

	.ai-item {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.ai-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.ai-q {
		font-weight: 600;
		margin-bottom: 0.25rem;
		font-size: 1.1rem;
	}
	.ai-exp {
		font-size: 1.1rem;
		color: #cbd5e1;
		margin-bottom: 0.5rem;
	}
	.ai-topic {
		font-size: 0.8rem;
		color: #94a3b8;
		text-transform: uppercase;
	}

	.questions-list h3 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: var(--sky-text);
	}

	.q-item {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1rem;
		border: 1px solid transparent;
	}

	.q-item.q-correct {
		border-color: rgba(74, 222, 128, 0.2);
	}
	.q-item.q-incorrect {
		border-color: rgba(244, 63, 94, 0.2);
	}

	.q-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.q-idx {
		font-weight: 700;
		color: #64748b;
	}
	.q-status {
		font-size: 0.75rem;
		font-weight: 700;
	}
	.q-correct .q-status {
		color: #4ade80;
	}
	.q-incorrect .q-status {
		color: #f43f5e;
	}

	.q-text {
		margin: 0 0 0.75rem;
		font-weight: 500;
		font-size: 1.2rem;
	}

	.q-details {
		font-size: 1.1rem;
	}
	.q-ans {
		margin-bottom: 0.25rem;
	}
	.q-ans .label {
		color: #94a3b8;
		margin-right: 0.5rem;
	}
	.q-ans.correct .val {
		color: #4ade80;
	}

	/* --- Responsive --- */
	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}
		.header-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
		.date-widget {
			text-align: left;
		}
	}

	@media (max-width: 640px) {
		.stats-row {
			grid-template-columns: 1fr;
		}
		.actions-grid {
			grid-template-columns: 1fr;
		}
		.dashboard-wrapper {
			padding: 5rem 1rem 1rem;
		}
	}
</style>
