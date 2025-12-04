<script lang="ts">
	import SkyBackground from '$lib/components/SkyBackground.svelte';

	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	let { data } = $props<{ data: PageData }>();

	type Question = {
		id: number;
		text: string;
		options: string[];
		correctAnswer: number; // index of correct option (0-3)
	};

	type Module = {
		id: number;
		title: string;
		description: string;
		icon: string;
		questions: Question[];
	};

	let modules = $derived(data.modules);

	// State management
	let viewState = $state<'selection' | 'quiz' | 'results'>('selection');
	let selectedModule = $state<Module | null>(null);
	let currentQuestionIndex = $state(0);
	let userAnswers = $state<(number | null)[]>([]);
	let score = $state(0);
	let showReview = $state(false);
	
	type FeedbackItem = {
		questionText: string;
		explanation: string;
		topicToReview: string;
	};
	
	let aiFeedback = $state<FeedbackItem[] | null>(null);
	let isLoadingFeedback = $state(false);

	function escapeHtml(text: string) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function applyInlineFormatting(text: string) {
		let formatted = escapeHtml(text);
		// Bold: **text** or __text__
		formatted = formatted.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
		// Italic: *text* or _text_
		formatted = formatted.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
		return formatted;
	}

	function formatAiExplanation(rawText: string) {
		if (!rawText) return '';
		const lines = rawText.split(/\r?\n/);
		let html = '';
		let listType: 'ul' | 'ol' | null = null;

		const closeList = () => {
			if (listType) {
				html += `</${listType}>`;
				listType = null;
			}
		};

		for (const original of lines) {
			const line = original.trim();
			if (!line) {
				closeList();
				continue;
			}

			// Headers
			const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
			if (headerMatch) {
				closeList();
				const level = headerMatch[1].length;
				html += `<h${level}>${applyInlineFormatting(headerMatch[2])}</h${level}>`;
				continue;
			}

			// Unordered List
			if (/^(\*|-)\s+/.test(line)) {
				if (listType !== 'ul') {
					closeList();
					listType = 'ul';
					html += '<ul>';
				}
				const content = line.replace(/^(\*|-)\s+/, '');
				html += `<li>${applyInlineFormatting(content)}</li>`;
				continue;
			}

			// Ordered List
			if (/^\d+[\.)]\s+/.test(line)) {
				if (listType !== 'ol') {
					closeList();
					listType = 'ol';
					html += '<ol>';
				}
				const content = line.replace(/^\d+[\.)]\s+/, '');
				html += `<li>${applyInlineFormatting(content)}</li>`;
				continue;
			}

			closeList();
			html += `<p>${applyInlineFormatting(line)}</p>`;
		}

		closeList();
		return html;
	}

	// Derived state for current question
	let currentQuestion = $derived(
		selectedModule?.questions?.[currentQuestionIndex]
	);

	function shuffleArray<T>(array: T[]): T[] {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
	}

	function startModule(module: Module) {
		// Clone the module to avoid mutating the original data
		const moduleClone = { ...module, questions: [...module.questions] };
		
		// Shuffle questions
		moduleClone.questions = shuffleArray(moduleClone.questions);

		// Shuffle options for each question
		moduleClone.questions = moduleClone.questions.map(q => {
			const originalCorrectAnswer = q.options[q.correctAnswer];
			const shuffledOptions = shuffleArray(q.options);
			const newCorrectAnswerIndex = shuffledOptions.indexOf(originalCorrectAnswer);
			
			return {
				...q,
				options: shuffledOptions,
				correctAnswer: newCorrectAnswerIndex
			};
		});

		selectedModule = moduleClone;
		userAnswers = new Array(moduleClone.questions.length).fill(null);
		currentQuestionIndex = 0;
		viewState = 'quiz';
		showReview = false;
	}

	function selectAnswer(answerIndex: number) {
		userAnswers[currentQuestionIndex] = answerIndex;
	}

	function nextQuestion() {
		if (selectedModule && currentQuestionIndex < selectedModule.questions.length - 1) {
			currentQuestionIndex++;
		}
	}

	function previousQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	async function submitTest() {
		if (!selectedModule) return;
		
		let correctCount = 0;
		const questionsDetails: any[] = [];

		selectedModule.questions.forEach((q, idx) => {
			const userAnswerIdx = userAnswers[idx];
			if (userAnswerIdx === q.correctAnswer) {
				correctCount++;
			}
			
			if (userAnswerIdx !== null && userAnswerIdx !== undefined) {
				questionsDetails.push({
					questionText: q.text,
					options: q.options,
					correctAnswer: q.options[q.correctAnswer],
					userAnswer: q.options[userAnswerIdx]
				});
			}
		});
		
		score = Math.round((correctCount / selectedModule.questions.length) * 100);
		viewState = 'results';
		aiFeedback = null;

		// Submit to backend
		try {
			const response = await fetch('/api/submit-test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					moduleNo: selectedModule.id,
					moduleName: selectedModule.title,
					totalQuestions: selectedModule.questions.length,
					questionsCorrect: correctCount,
					questionsIncorrect: selectedModule.questions.length - correctCount,
					marks: score,
					questions: questionsDetails
				})
			});
			
			if (!response.ok) {
				console.error('Failed to submit test results');
			}
		} catch (e) {
			console.error('Error submitting test:', e);
		}

		// Get AI Feedback for incorrect answers
		const incorrectQuestions = questionsDetails.filter(q => q.userAnswer !== q.correctAnswer);
		if (incorrectQuestions.length > 0) {
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
	}

	function retakeTest() {
		if (selectedModule) {
			startModule(selectedModule);
		}
	}

	function backToSelection() {
		selectedModule = null;
		currentQuestionIndex = 0;
		userAnswers = [];
		score = 0;
		showReview = false;
		viewState = 'selection';
		location.reload();
	}

	function toggleReview() {
		showReview = !showReview;
	}

	$effect(() => {
		// Scroll to top when changing questions or views
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	onMount(() => {
		document.body.classList.add('zone-testbay');
		return () => document.body.classList.remove('zone-testbay');
	});
</script>

<SkyBackground dawn={true} />

<div class="page-container">
	{#if viewState === 'selection'}
		<!-- Module Selection View -->
		<div class="content-wrapper animate-on-scroll">
			<h1 class="page-title gradient-animated">Test Bay</h1>
			<p class="intro-text">Welcome to the Test Bay, where learning turns into a challenge. Here, students face interactive assessments designed to gauge their understanding of the Hangar Zone, Turbofan Engine Zone, and Overhaul Bay. It's not just an activity—it's a test of mastery, confidence, and readiness to take flight.</p>

            <div class="info-card animate-on-scroll">
				<div class="info-content">
					<h3>Assessment Info – Here's What You Need to Know:</h3>
					<ul>
						<li>Each module has 10 multiple-choice questions – a quick dive into your knowledge!</li>
						<li>You can navigate freely between questions before hitting submit.</li>
						<li>After submission, you'll get a chance to review your answers and see how you did.</li>
						<li>Want a better score? Retake any module to improve and master the material!</li>
					</ul>
				</div>
				<div class="jaja-character">
					<img src="/images/jaja-standing.png" alt="JAJA Character" />
				</div>
            </div>

			<div class="test-grid animate-on-scroll">
				{#each modules as module, idx}
					<div class="test-card module-{module.id}" style="--delay: {idx * 0.1}s">
						<h3 class="module-label">MODULE {String(module.id).padStart(2, '0')}:</h3>
						<h4 class="module-title gradient-animated">{module.title.toUpperCase()}</h4>
						<p class="module-description">{module.description}</p>
						<button class="start-button" onclick={() => startModule(module)}>START ASSESSMENT</button>
					</div>
				{/each}
			</div>
		</div>

	{:else if viewState === 'quiz' && selectedModule}
		<!-- Quiz View -->
		<div class="quiz-container">
			<div class="quiz-header">
				<button type="button" class="back-button" onclick={backToSelection}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M19 12H5M12 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Back to Modules
				</button>
				<div class="module-title">
					<h2>Module {selectedModule.id}: {selectedModule.title}</h2>
				</div>
			</div>

			<div class="progress-bar">
				<div class="progress-fill" style="width: {((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%"></div>
			</div>
			<div class="progress-text">
				Question {currentQuestionIndex + 1} of {selectedModule.questions.length}
			</div>

			{#if currentQuestion}
				<div class="question-card">
					<h3 class="question-text">
						{currentQuestionIndex + 1}. {currentQuestion.text}
					</h3>

					<div class="options-list">
						{#each currentQuestion.options as option, idx}
							<label class="option-item" class:selected={userAnswers[currentQuestionIndex] === idx}>
								<input 
									type="radio" 
									name="answer-{currentQuestionIndex}" 
									value={idx}
									checked={userAnswers[currentQuestionIndex] === idx}
									onchange={() => selectAnswer(idx)}
								/>
								<span class="option-label">{String.fromCharCode(65 + idx)}</span>
								<span class="option-text">{option}</span>
							</label>
						{/each}
					</div>
				</div>
			{/if}

			<div class="navigation-buttons">
				<button 
					class="nav-button secondary" 
					onclick={previousQuestion}
					disabled={currentQuestionIndex === 0}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Previous
				</button>

				{#if currentQuestionIndex === selectedModule.questions.length - 1}
					<button 
						class="nav-button primary submit-button" 
						onclick={submitTest}
						disabled={userAnswers.some(a => a === null)}
					>
						Submit Test
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				{:else}
					<button 
						class="nav-button primary" 
						onclick={nextQuestion}
					>
						Next
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				{/if}
			</div>

			<div class="question-nav">
				<p>Quick Navigation:</p>
				<div class="question-dots">
					{#each selectedModule.questions as _, idx}
						<button 
							class="dot" 
							class:answered={userAnswers[idx] !== null}
							class:current={idx === currentQuestionIndex}
							onclick={() => currentQuestionIndex = idx}
							title="Question {idx + 1}"
						>
							{idx + 1}
						</button>
					{/each}
				</div>
			</div>
		</div>

	{:else if viewState === 'results' && selectedModule}
		<!-- Results View -->
		<div class="results-container">
			<div class="results-header">
				<h1>{score >= 70 ? 'Congratulations!' : 'Assessment Complete'}</h1>
				<p class="results-subtitle">Module {selectedModule.id}: {selectedModule.title}</p>
			</div>

			<div class="score-card">
				<div class="score-display">
					<div class="score-circle" style="--score: {score}">
						<svg viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="45" class="score-bg"></circle>
							<circle cx="50" cy="50" r="45" class="score-progress" 
								style="stroke-dashoffset: {283 - (283 * score) / 100}"></circle>
						</svg>
						<div class="score-number">{score}%</div>
					</div>
				</div>
				<div class="score-details">
					<div class="stat">
						<span class="stat-label">Correct Answers</span>
						<span class="stat-value">{userAnswers.filter((a, i) => a === selectedModule?.questions[i].correctAnswer).length} / {selectedModule?.questions.length}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Performance</span>
						<span class="stat-value" class:excellent={score >= 90} class:good={score >= 70 && score < 90} class:needs-improvement={score < 70}>
							{score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement'}
						</span>
					</div>
				</div>
			</div>

			{#if aiFeedback || isLoadingFeedback}
				<div class="ai-feedback-section">
					<h3>🤖 Feedback</h3>
					{#if isLoadingFeedback}
						<div class="loading-feedback">
							<div class="spinner"></div>
							<p>Analyzing your performance...</p>
						</div>
					{:else if aiFeedback}
						<div class="feedback-grid">
							{#each aiFeedback as item}
								<div class="feedback-card">
									<h4>{item.questionText}</h4>
									<div class="explanation">
										{@html formatAiExplanation(item.explanation)}
									</div>
									<div class="review-topic">
										<span class="topic-label">💡 Review Topic:</span> {item.topicToReview}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<div class="results-actions">
				<button class="action-button primary" onclick={toggleReview}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<circle cx="12" cy="12" r="3" stroke-width="2"/>
					</svg>
					{showReview ? 'Hide Review' : 'Review Answers'}
				</button>
				<button class="action-button secondary" onclick={retakeTest}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Retake Module
				</button>
				<button type="button" class="action-button" onclick={backToSelection}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Back to Modules
				</button>
			</div>

			{#if showReview}
				<div class="review-section">
					<h3>📝 Answer Review</h3>
					{#each selectedModule.questions as question, idx}
						<div class="review-question" class:correct={userAnswers[idx] === question.correctAnswer} class:incorrect={userAnswers[idx] !== question.correctAnswer}>
							<div class="review-header">
								<span class="review-number">Q{idx + 1}</span>
								<span class="review-status">
									{userAnswers[idx] === question.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
								</span>
							</div>
							<p class="review-text">{question.text}</p>
							<div class="review-options">
								{#each question.options as option, optIdx}
									<div 
										class="review-option"
										class:user-answer={userAnswers[idx] === optIdx}
										class:correct-answer={question.correctAnswer === optIdx}
									>
										<span class="option-label">{String.fromCharCode(65 + optIdx)}</span>
										<span class="option-text">{option}</span>
										{#if userAnswers[idx] === optIdx && question.correctAnswer === optIdx}
											<span class="badge correct">Your Answer ✓</span>
										{:else if userAnswers[idx] === optIdx}
											<span class="badge incorrect">Your Answer</span>
										{:else if question.correctAnswer === optIdx}
											<span class="badge correct">Correct Answer</span>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>



<style>
	.page-container {
		position: relative;
		min-height: 100vh;
		/* Align padding with the standard used across pages (Hangar/Overhaul) */
		padding: var(--spacing-xxl) var(--container-side-padding) var(--spacing-xl); /* increase side padding to align description text */
		max-width: 1400px;
		margin: 0 auto;
		z-index: 5;
	}

	/* Module Selection Styles */
	.content-wrapper {
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 900;
		margin: 0 0 1.5rem 0;
		text-align: center;
		/* Unified gradient is opt-in via `.gradient-animated` */
		background: transparent;
		color: var(--font-secondary);
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	/* gradient-flash keyframes moved to global app.css */

	.intro-text {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		/* Match Hangar Zone hero description sizing for consistent layout */
		font-size: clamp(1.1rem, 2vw, 1.3rem);
		line-height: 1.8;
		color: var(--font-primary);
		max-width: 900px;
		margin: 0 auto 2rem auto;
		text-align: justify;
		background: transparent;
		padding: 0 var(--card-padding);
		border-radius: 0;
		box-shadow: none;
		border: none;
	}

	.info-card {
		background: #FFFFFF;
		border-radius: 25px;
		padding: var(--card-padding-mobile);
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.5);
		display: flex;
		gap: var(--card-padding-mobile);
		align-items: center;
		transition: all 0.3s ease;
	}

	.info-card:hover {
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
		transform: translateY(-4px);
	}

	.info-content {
		flex: 1;
	}

	.info-content h3 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 1.4rem;
		margin: 0 0 1.5rem 0;
		font-weight: 900;
	}

	.info-content ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-content ul li {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 1rem;
		line-height: 1.8;
		margin-bottom: 0.75rem;
		padding-left: 2rem;
		position: relative;
	}

	.info-content ul li::before {
		content: '▶';
		position: absolute;
		left: 0.5rem;
		color: var(--testbay-accent);
		font-size: 0.8rem;
	}

	.jaja-character {
		flex-shrink: 0;
		width: 180px;
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.jaja-character img {
		max-width: 100%;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
	}

	.test-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--card-padding-mobile);
	}

	.test-card {
		background: #FFFFFF;
		border: 3px solid;
		border-radius: 25px;
		/* Use consistent padding with other module cards across the site */
		padding: var(--card-padding);
		text-align: center;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--delay, 0s);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		cursor: pointer;
	}

	.test-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(var(--navbar-accent-rgb), 0.2), transparent);
		transition: left 0.6s ease;
	}

	.test-card:hover::before {
		left: 100%;
	}

	.test-card.module-1 {
		border-color: #FFA500;
	}

	.test-card.module-2 {
		border-color: var(--font-accent-green);
	}

	.test-card.module-3 {
		border-color: #2196F3;
	}

	.test-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	}

	.module-label {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 0.95rem;
		margin: 0 0 0.75rem 0;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.test-card.module-1 .module-label {
		color: #FFA500;
	}

	.test-card.module-2 .module-label {
		color: var(--font-accent-green);
	}

	.test-card.module-3 .module-label {
		color: #2196F3;
	}

	.module-title {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		/* Larger module title size — aligned more closely to Hangar module titles */
		font-size: 1.6rem;
		margin: 0 0 1.5rem 0;
		font-weight: 900;
		line-height: 1.3;
		/* Module title gradient is opt-in via `.gradient-animated` */
		background: transparent;
		color: var(--font-primary);
	}

	.module-description {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		/* Match Hangar description sizing and rhythm */
		font-size: clamp(1rem, 1.9vw, 1.15rem);
		margin-bottom: auto;
		line-height: 1.75;
		flex-grow: 1;
		opacity: 0.9;
		text-align: justify;
	}

	.start-button {
		margin-top: 2rem;
		padding: var(--spacing-sm) var(--spacing-lg);
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-weight: 700;
		font-size: 1rem;
		letter-spacing: 1px;
		text-transform: uppercase;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.test-card.module-1 .start-button {
		background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
		color: var(--font-secondary);
	}

	.test-card.module-2 .start-button {
		background: linear-gradient(135deg, var(--font-accent-green) 0%, #45a049 100%);
		color: var(--font-secondary);
	}

	.test-card.module-3 .start-button {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: var(--font-secondary);
	}

	.start-button:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
	}

	.start-button:active {
		transform: scale(0.98);
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.test-info {
		display: flex;
		justify-content: center;
		gap: 1rem;
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 1.5rem;
	}

	.test-button {
		background: #38C172;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 0.5rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: none;
		transition: all 0.3s ease;
		width: 100%;
		margin-top: auto;
	}

	.test-button:hover {
		background: #2da85f;
		transform: scale(1.05);
	}



	/* Quiz Styles */
	.quiz-container {
		max-width: 900px;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 25px;
		padding: var(--card-padding);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	.quiz-header {
		margin-bottom: 2rem;
	}

	.back-button {
		background: rgba(118, 102, 127, 0.15);
		border: 2px solid rgba(118, 102, 127, 0.3);
		border-radius: 12px;
		color: var(--font-primary);
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 0.95rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		padding: 0.75rem 1.25rem;
		margin-bottom: 1.5rem;
		transition: all 0.3s ease;
	}

	.back-button:hover {
		background: rgba(118, 102, 127, 0.25);
		border-color: var(--testbay-accent);
		transform: translateX(-5px);
	}

	.module-title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.module-icon {
		font-size: 2.5rem;
	}

	.module-title h2 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 1.8rem;
		font-weight: 900;
		margin: 0;
		/* Apply moving gradient to quiz module header titles too */
		background: linear-gradient(
			90deg,
			var(--navbar-accent, var(--ui-yellow)) 0%,
			var(--font-accent-cyan) 50%,
			var(--navbar-accent, var(--ui-yellow)) 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash var(--gradient-duration) ease-in-out infinite;
	}

	.progress-bar {
		height: 10px;
		background: rgba(224, 224, 224, 0.5);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 0.75rem;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #2196F3 0%, #1976D2 100%);
		transition: width 0.4s ease;
		box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
	}

	.progress-text {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 0.95rem;
		font-weight: 600;
		text-align: right;
		margin-bottom: 2rem;
	}

	.question-card {
		background: #FFFFFF;
		border-radius: 20px;
		padding: var(--card-padding);
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.question-text {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 1.25rem;
		line-height: 1.7;
		margin: 0 0 2rem 0;
		font-weight: 600;
		text-align: justify;
	}

	.options-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.option-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: #FFFFFF;
		border: 2px solid rgba(224, 224, 224, 0.5);
		border-radius: 15px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.option-item:hover {
		border-color: var(--testbay-accent);
		background: rgba(118, 102, 127, 0.1);
		transform: translateX(5px);
		box-shadow: 0 4px 12px rgba(118, 102, 127, 0.15);
	}

	.option-item.selected {
		border-color: #2196F3;
		background: rgba(33, 150, 243, 0.15);
		box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
	}

	.option-item input[type="radio"] {
		display: none;
	}

	.option-label {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-weight: 900;
		color: var(--font-primary);
		font-size: 1.15rem;
		min-width: 35px;
		text-align: center;
	}

	.option-text {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		flex: 1;
		line-height: 1.6;
		font-size: 1rem;
		text-align: justify;
	}

	.navigation-buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.nav-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: var(--spacing-sm) var(--spacing-lg);
		border: none;
		border-radius: 12px;
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.nav-button.primary {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		color: var(--font-secondary);
	}

	.nav-button.primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(33, 150, 243, 0.3);
	}

	.nav-button.secondary {
		background: #F5F5F5;
		color: var(--font-primary);
		border: 2px solid rgba(118, 102, 127, 0.3);
	}

	.nav-button.secondary:hover:not(:disabled) {
		background: rgba(118, 102, 127, 0.2);
		border-color: var(--testbay-accent);
		transform: translateY(-2px);
	}

	.nav-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none !important;
	}

	.submit-button {
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #e91e63 0%, #d81b60 100%);
		box-shadow: 0 6px 20px rgba(255, 60, 126, 0.4);
	}

	.question-nav {
		background: #FFFFFF;
		padding: var(--spacing-md);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.question-nav p {
		display: none;
	}

	.question-dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.dot {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		background: #FFFFFF;
		border: 2px solid rgba(224, 224, 224, 0.5);
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--font-primary);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dot:hover {
		border-color: var(--testbay-accent);
		background: rgba(118, 102, 127, 0.15);
		transform: scale(1.1);
	}

	.dot.answered {
		background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
		border-color: #2196F3;
		color: var(--font-secondary);
		box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
	}

	.dot.current {
		border-color: var(--testbay-accent);
		border-width: 3px;
		box-shadow: 0 0 0 3px rgba(118, 102, 127, 0.2);
	}

	/* Results Styles */
	.results-container {
		max-width: 900px;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 25px;
		padding: var(--card-padding);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	.results-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.results-icon {
		font-size: 5rem;
		margin-bottom: 1.5rem;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
	}

	.results-header h1 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 2.8rem;
		font-weight: 900;
		margin: 0 0 1rem 0;
		background: linear-gradient(
			90deg,
			var(--testbay-accent) 0%,
			#a896b3 100%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.results-subtitle {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 1.15rem;
		opacity: 0.8;
	}

	.score-card {
		display: flex;
		gap: 3rem;
		align-items: center;
		justify-content: center;
		padding: 2.5rem;
		background: #FFFFFF;
		border-radius: 20px;
		margin-bottom: 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.score-display {
		flex-shrink: 0;
	}

	.score-circle {
		position: relative;
		width: 160px;
		height: 160px;
	}

	.score-circle svg {
		transform: rotate(-90deg);
		width: 100%;
		height: 100%;
	}

	.score-bg {
		fill: none;
		stroke: #E0E0E0;
		stroke-width: 8;
	}

	.score-progress {
		fill: none;
		stroke: var(--font-accent-green);
		stroke-width: 10;
		stroke-linecap: round;
		stroke-dasharray: 283;
		transition: stroke-dashoffset 1s ease;
		filter: drop-shadow(0 2px 4px rgba(56, 193, 114, 0.3));
	}

	.score-number {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 2.8rem;
		font-weight: 900;
		color: var(--font-primary);
	}

	.score-details {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-label {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 0.95rem;
		font-weight: 600;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 1.5rem;
		font-weight: 700;
	}

	.stat-value.excellent {
		color: #38C172;
	}

	.stat-value.good {
		color: #FFA726;
	}

	.stat-value.needs-improvement {
		color: #FF3C7E;
	}

	.ai-feedback-section {
		background: #FFFFFF;
		border-radius: 20px;
		padding: var(--spacing-lg);
		margin-bottom: 2.5rem;
		border: 2px solid var(--testbay-accent);
		box-shadow: 0 4px 16px rgba(118, 102, 127, 0.15);
	}

	.ai-feedback-section h3 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 1.5rem;
		font-weight: 900;
		margin: 0 0 1.5rem 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.feedback-grid {
		display: grid;
		gap: 1.5rem;
	}

	.feedback-card {
		background: #FFFFFF;
		border-radius: 15px;
		padding: 1.5rem;
		border-left: 4px solid var(--testbay-accent);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.feedback-card h4 {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-weight: 700;
		color: var(--font-primary);
		margin: 0 0 0.75rem 0;
		font-size: 1.1rem;
	}

	.explanation {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		line-height: 1.6;
		margin: 0 0 1rem 0;
		font-size: 1rem;
		opacity: 0.9;
		text-align: justify;
	}

	.explanation p {
		margin: 0 0 0.75rem 0;
	}

	.review-topic {
		background: rgba(118, 102, 127, 0.15);
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 0.95rem;
		color: #223A5E;
		display: inline-block;
	}

	.topic-label {
		font-weight: 700;
		color: var(--testbay-accent);
		margin-right: 0.5rem;
	}

	.loading-feedback {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: var(--spacing-lg);
		color: #666;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: var(--testbay-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.results-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: var(--spacing-sm) var(--spacing-lg);
		border: 2px solid;
		border-radius: 12px;
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.action-button:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	}

	.action-button.primary {
		background: linear-gradient(135deg, var(--font-accent-green) 0%, #45a049 100%);
		color: var(--font-secondary);
		border-color: var(--font-accent-green);
	}

	.action-button.primary:hover {
		background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
		border-color: #45a049;
	}

	.action-button.secondary {
		background: linear-gradient(135deg, #FFA726 0%, #fb8c00 100%);
		color: var(--font-secondary);
		border-color: #FFA726;
	}

	.action-button.secondary:hover {
		background: linear-gradient(135deg, #fb8c00 0%, #f57c00 100%);
		border-color: #fb8c00;
	}

	/* Review Section */
	.review-section {
		margin-top: 2.5rem;
		padding-top: 2.5rem;
		border-top: 2px solid rgba(224, 224, 224, 0.5);
	}

	.review-section h3 {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		color: var(--font-primary);
		font-size: 1.8rem;
		font-weight: 900;
		margin: 0 0 2rem 0;
	}

	.review-question {
		background: #FFFFFF;
		border-radius: 20px;
		padding: var(--spacing-lg);
		margin-bottom: 1.5rem;
		border-left: 5px solid;
		border-color: rgba(224, 224, 224, 0.5);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.review-question:hover {
		transform: translateX(5px);
	}

	.review-question.correct {
		border-left-color: var(--font-accent-green);
		background: rgba(56, 193, 114, 0.05);
	}

	.review-question.incorrect {
		border-left-color: #FF3C7E;
		background: rgba(255, 60, 126, 0.05);
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}

	.review-number {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-weight: 900;
		color: var(--font-primary);
		font-size: 1.15rem;
	}

	.review-status {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-weight: 700;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.review-question.correct .review-status {
		color: var(--font-accent-green);
	}

	.review-question.incorrect .review-status {
		color: #FF3C7E;
	}

	.review-text {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		line-height: 1.7;
		margin: 0 0 1.5rem 0;
		font-size: 1.05rem;
		text-align: justify;
	}

	.review-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.review-option {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: var(--spacing-sm) var(--spacing-sm);
		background: #FFFFFF;
		border: 2px solid rgba(224, 224, 224, 0.5);
		border-radius: 15px;
		position: relative;
		transition: all 0.3s ease;
	}

	.review-option.correct-answer {
		border-color: var(--font-accent-green);
		background: rgba(56, 193, 114, 0.1);
		box-shadow: 0 2px 8px rgba(56, 193, 114, 0.15);
	}

	.review-option.user-answer:not(.correct-answer) {
		border-color: #FF3C7E;
		background: rgba(255, 60, 126, 0.08);
		box-shadow: 0 2px 8px rgba(255, 60, 126, 0.15);
	}

	.badge {
		margin-left: auto;
		padding: 0.4rem 1rem;
		border-radius: 12px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.badge.correct {
		background: linear-gradient(135deg, var(--font-accent-green) 0%, #45a049 100%);
		color: var(--font-secondary);
	}

	.badge.incorrect {
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: var(--font-secondary);
	}
	/* Responsive Design */
	@media (max-width: 1024px) {
		.test-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.info-card {
			flex-direction: column;
			padding: var(--spacing-lg);
		}

		.jaja-character {
			width: 150px;
			height: 150px;
		}

		.page-title {
			font-size: clamp(2.5rem, 7vw, 4rem);
		}

		.intro-text {
			padding: var(--spacing-md) var(--spacing-lg);
			font-size: 1.1rem;
		}
	}

	@media (max-width: 768px) {
		.page-container {
			padding: var(--spacing-sm);
		}

		.content-wrapper {
			padding: 0;
		}

		.page-title {
			font-size: clamp(2rem, 10vw, 3rem);
			margin-bottom: 1.5rem;
		}

		.intro-text {
			padding: 1.25rem 1.5rem;
			font-size: 1rem;
			margin-bottom: 1.5rem;
		}

		.info-card {
			padding: var(--spacing-md);
			margin-bottom: 2rem;
		}

		.info-content h3 {
			font-size: 1.1rem;
			margin-bottom: 1rem;
		}

		.info-content ul li {
			font-size: 0.9rem;
			padding-left: 1.75rem;
		}

		.jaja-character {
			width: 120px;
			height: 120px;
		}

		.test-grid {
			gap: 1.5rem;
		}

		.test-card {
			padding: var(--card-padding-mobile);
		}

		.module-title {
			font-size: 1.3rem;
		}

		.module-description {
			font-size: 1rem;
		}

		.start-button {
			padding: 0.875rem 1.75rem;
			font-size: 0.95rem;
		}

		.quiz-container, .results-container {
			padding: var(--spacing-md);
		}

		.page-title {
			font-size: 2.5rem;
		}

		.intro-text {
			font-size: 0.9rem;
		}

		.info-card {
			padding: var(--spacing-md);
			border-radius: 1.5rem;
		}

		.info-content h3 {
			font-size: 1rem;
		}

		.info-content ul li {
			font-size: 0.85rem;
		}

		.jaja-character {
			width: 120px;
			height: 120px;
		}

		.test-grid {
			grid-template-columns: 1fr;
		}

		.test-card {
			padding: 1.5rem;
		}

		.module-title {
			font-size: 1.1rem;
		}

		.module-description {
			font-size: 0.95rem;
		}

		.score-card {
			flex-direction: column;
			gap: 1.5rem;
		}

		.navigation-buttons {
			flex-direction: column;
		}

		.results-actions {
			flex-direction: column;
		}

		.action-button {
			width: 100%;
			justify-content: center;
		}
	}

	/* Scroll Animations */
	.animate-on-scroll {
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.animate-on-scroll.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Parallax Background Styles */
	.parallax-background-system {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
		overflow: hidden;
		background: #87CEEB;
	}

	.parallax-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		will-change: transform;
	}

	.sky-layer {
		z-index: 1;
	}

	.far-clouds-layer {
		z-index: 2;
	}

	.mid-clouds-layer {
		z-index: 3;
	}

	.near-clouds-layer {
		z-index: 4;
	}

	/* Bottom Navigation */
	.bottom-nav {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: max-content;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 2px solid rgba(118, 102, 127, 0.2);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.8rem 1.5rem;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(118, 102, 127, 0.3);
		border-radius: 10px;
		color: var(--font-primary);
		font-weight: 600;
		transition: all 0.3s ease;
		width: fit-content;
		min-width: 160px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-decoration: none;
	}

	.nav-link:not(:disabled):hover {
		border-color: var(--testbay-accent);
		/* Keep background unchanged; use a soft glow */
		box-shadow: 0 6px 30px rgba(var(--testbay-accent-rgb, 118, 102, 127), 0.25), 0 0 18px rgba(var(--testbay-accent-rgb, 118, 102, 127), 0.18) inset;
		transform: translateY(-2px);
	}

	/* Test Bay has no bottom nav markup; nav-arrow color handled globally or by pages where navigation exists */

	.nav-link.prev { justify-self: center; }
	.nav-link.next { justify-self: center; }
	.nav-arrow { font-size: 1.25rem; color: var(--testbay-accent); }
</style>
