<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';

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

	// Module 1: Jet Propulsion Fundamentals
	const module1: Module = {
		id: 1,
		title: 'Jet Propulsion Fundamentals',
		description: 'Test your knowledge of basic jet propulsion principles and history',
		icon: '🚀',
		questions: [
			{
				id: 1,
				text: 'Which of the following best describes the principle of jet propulsion?',
				options: [
					'The conversion of fuel into mechanical energy by a reciprocating motion',
					'The force is generated in the same direction as the exhaust gases',
					'The force is produced opposite to the discharge of fluid under pressure',
					'The suction of air to create a vacuum thrust'
				],
				correctAnswer: 2
			},
			{
				id: 2,
				text: "Jet propulsion operates according to which of Newton's Laws of Motion?",
				options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
				correctAnswer: 2
			},
			{
				id: 3,
				text: 'Who devised the aeolipile, an early steam-powered toy demonstrating jet propulsion?',
				options: ['Isaac Newton', 'John Barber', 'Hero of Alexandria', 'Frank Whittle'],
				correctAnswer: 2
			},
			{
				id: 4,
				text: 'Who was granted the first patent covering a gas turbine in 1791?',
				options: ['Sanford Moss', 'John Barber', 'Hans von Ohain', 'Frank Whittle'],
				correctAnswer: 1
			},
			{
				id: 5,
				text: 'What was Dr. Sanford Moss known for in the early 1900s?',
				options: [
					'Building the first supersonic jet',
					'Developing the first successful turbojet',
					'Creating the turbo-supercharger driven by exhaust gases',
					'Designing the first commercial jetliner'
				],
				correctAnswer: 2
			},
			{
				id: 6,
				text: 'Frank Whittle developed the first successful turbojet engine and received his patent in what year?',
				options: ['1925', '1930', '1936', '1941'],
				correctAnswer: 1
			},
			{
				id: 7,
				text: 'The Heinkel He-178, recognized as the first jet-propelled aircraft, was designed by:',
				options: ['Frank Whittle', 'Hans von Ohain', 'John Barber', 'Sanford Moss'],
				correctAnswer: 1
			},
			{
				id: 8,
				text: 'Which type of jet engine has no moving parts and relies on forward motion to compress incoming air?',
				options: ['Pulse Jet', 'Ramjet', 'Scramjet', 'Turbojet'],
				correctAnswer: 1
			},
			{
				id: 9,
				text: 'In a scramjet engine, combustion occurs in:',
				options: ['Subsonic airflow', 'Supersonic airflow', 'Static airflow', 'Rotating airflow'],
				correctAnswer: 1
			},
			{
				id: 10,
				text: 'Which of the following jet engines does not rely on atmospheric air for propulsion?',
				options: ['Gas turbine engine', 'Ramjet', 'Scramjet', 'Rocket engine'],
				correctAnswer: 3
			}
		]
	};

	// Module 2: Engine Architectures
	const module2: Module = {
		id: 2,
		title: 'Engine Architectures',
		description: 'Evaluate your understanding of different engine types and configurations',
		icon: '⚙️',
		questions: [
			{
				id: 1,
				text: 'Which of the following best describes a turbojet engine?',
				options: [
					'Converts almost all energy into shaft horsepower',
					'Drives a propeller through reduction gears',
					'Produces thrust by accelerating exhaust gases through a nozzle',
					'Uses a free power turbine to drive a shaft'
				],
				correctAnswer: 2
			},
			{
				id: 2,
				text: 'The engine pressure ratio (EPR) in a turbojet engine is the ratio between:',
				options: [
					'Compressor inlet temperature and turbine inlet temperature',
					'Turbine discharge pressure and inlet air pressure',
					'Compressor discharge pressure and turbine inlet pressure',
					'Exhaust pressure and compressor discharge pressure'
				],
				correctAnswer: 1
			},
			{
				id: 3,
				text: 'What is a "spool" in a turbojet engine?',
				options: [
					'A device that measures engine performance',
					'A turbine and compressor mounted on the same shaft',
					'The propeller gearbox unit',
					'The exhaust nozzle assembly'
				],
				correctAnswer: 1
			},
			{
				id: 4,
				text: 'In a turboprop engine, the main power output is delivered to:',
				options: [
					'The jet nozzle',
					'The propeller via a reduction gear system',
					'The turbine only',
					'The free power turbine'
				],
				correctAnswer: 1
			},
			{
				id: 5,
				text: 'Why is reduction gearing necessary in turboprop engines?',
				options: [
					'To increase thrust by accelerating exhaust gases',
					'To allow the propeller to operate at slower, more efficient speeds',
					'To improve fuel injection timing',
					'To control air intake pressure'
				],
				correctAnswer: 1
			},
			{
				id: 6,
				text: 'The total output of a turboprop engine, combining shaft horsepower and residual jet thrust, is called:',
				options: [
					'Brake horsepower',
					'Total engine power (TEP)',
					'Equivalent Shaft Horsepower (ESHP)',
					'Effective Thrust Power (ETP)'
				],
				correctAnswer: 2
			},
			{
				id: 7,
				text: 'A turboshaft engine differs from a turboprop mainly because it:',
				options: [
					'Produces thrust through a nozzle',
					'Drives a helicopter rotor or other mechanical load via a shaft',
					'Has no turbine stages',
					'Uses a ducted fan instead of a propeller'
				],
				correctAnswer: 1
			},
			{
				id: 8,
				text: 'In a turboshaft engine, the free power turbine:',
				options: [
					'It is mechanically connected to the compressor',
					'Converts remaining gas energy into mechanical shaft power',
					'Increases air pressure before combustion',
					'It is used only during startup'
				],
				correctAnswer: 1
			},
			{
				id: 9,
				text: 'The main difference between turboprop and turboshaft engines is that:',
				options: [
					'Turboshaft engines produce more exhaust thrust',
					'Turboprop engines drive helicopter rotors',
					'Turboprops may produce some thrust from exhaust, while turboshafts primarily produce shaft power',
					'Turboshafts are designed for supersonic flight'
				],
				correctAnswer: 2
			},
			{
				id: 10,
				text: 'Ducted and unducted propfan engines are advanced designs that:',
				options: [
					'Operate at subsonic speeds only',
					'Use composite materials for lighter, faster blades',
					'Have lower fuel efficiency than turbofans',
					'Cannot exceed Mach 0.7'
				],
				correctAnswer: 1
			}
		]
	};

	// Module 3: Engine Sections and Components
	const module3: Module = {
		id: 3,
		title: 'Engine Sections and Components',
		description: 'Assess your knowledge of engine parts and their functions',
		icon: '🔧',
		questions: [
			{
				id: 1,
				text: 'Which of the following components belong to the cold section of a gas turbine engine?',
				options: [
					'Turbine and Exhaust',
					'Air Inlet and Compressor',
					'Combustion and Turbine',
					'Compressor and Exhaust'
				],
				correctAnswer: 1
			},
			{
				id: 2,
				text: 'The main function of the air inlet is to:',
				options: [
					'Increase the speed of exhaust gases',
					'Convert pressure energy into velocity energy',
					'Recover total pressure and deliver uniform airflow to the compressor',
					'Supply fuel to the combustion chamber'
				],
				correctAnswer: 2
			},
			{
				id: 3,
				text: 'Which type of air inlet is specifically designed for stationary or slow-moving aircraft such as helicopters or test stands?',
				options: [
					'Supersonic inlet',
					'Subsonic inlet',
					'Bellmouth inlet',
					'Variable geometry inlet'
				],
				correctAnswer: 2
			},
			{
				id: 4,
				text: 'The compressor pressure ratio is defined as:',
				options: [
					'Inlet pressure ÷ Outlet pressure',
					'Outlet pressure ÷ Inlet pressure',
					'Turbine pressure ÷ Compressor pressure',
					'Air velocity ÷ Pressure energy'
				],
				correctAnswer: 1
			},
			{
				id: 5,
				text: 'What is the primary function of the compressor section?',
				options: [
					'Convert fuel into energy',
					'Supply compressed air for combustion',
					'Cool the turbine blades',
					'Direct exhaust gases rearward'
				],
				correctAnswer: 1
			},
			{
				id: 6,
				text: 'Which of the following is an advantage of a centrifugal flow compressor?',
				options: [
					'Large frontal area',
					'High manufacturing cost',
					'Low weight and simplicity in design',
					'Requires high starting power'
				],
				correctAnswer: 2
			},
			{
				id: 7,
				text: 'In an axial flow compressor, each pair of rotor and stator vanes is called a:',
				options: ['Stage', 'Section', 'Spool', 'Passage'],
				correctAnswer: 0
			},
			{
				id: 8,
				text: 'The combustion chamber mixes and burns the air-fuel mixture. What percentage of air is approximately used as primary air for combustion?',
				options: ['10–20%', '25–35%', '45–55%', '65–75%'],
				correctAnswer: 1
			},
			{
				id: 9,
				text: 'Which type of turbine blade produces turning force mainly by aerodynamic action and pressure drop across the blades?',
				options: ['Impulse blade', 'Reaction blade', 'Impulse-reaction blade', 'Shrouded blade'],
				correctAnswer: 1
			},
			{
				id: 10,
				text: 'The accessory section of a gas turbine engine provides power for:',
				options: [
					'Thrust production only',
					'Fuel pumps, generators, and hydraulic systems',
					'Compressor cooling only',
					'Turbine speed regulation'
				],
				correctAnswer: 1
			}
		]
	};

	const modules: Module[] = [module1, module2, module3];

	// State management
	let viewState = $state<'selection' | 'quiz' | 'results'>('selection');
	let selectedModule = $state<Module | null>(null);
	let currentQuestionIndex = $state(0);
	let userAnswers = $state<(number | null)[]>([]);
	let score = $state(0);
	let showReview = $state(false);

	function startModule(module: Module) {
		selectedModule = module;
		userAnswers = new Array(module.questions.length).fill(null);
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

	function submitTest() {
		if (!selectedModule) return;
		
		let correctCount = 0;
		selectedModule.questions.forEach((q, idx) => {
			if (userAnswers[idx] === q.correctAnswer) {
				correctCount++;
			}
		});
		
		score = Math.round((correctCount / selectedModule.questions.length) * 100);
		viewState = 'results';
	}

	function retakeTest() {
		if (selectedModule) {
			startModule(selectedModule);
		}
	}

	function backToSelection() {
		viewState = 'selection';
		selectedModule = null;
		currentQuestionIndex = 0;
		userAnswers = [];
		score = 0;
		showReview = false;
	}

	function toggleReview() {
		showReview = !showReview;
	}

	$effect(() => {
		// Scroll to top when changing questions or views
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
</script>

<AnimatedBackground variant="green" />

<div class="page-container">
	{#if viewState === 'selection'}
		<!-- Module Selection View -->
		<div class="content-card animate-on-scroll">
			<h1>🧪 Test Bay</h1>
			<p class="subtitle">Select a module to begin your assessment</p>

            <div class="info-box animate-on-scroll">
                <h3>ℹ️ Assessment Information</h3>
                <ul>
                    <li>Each module contains 10 multiple-choice questions</li>
                    <li>You can navigate between questions before submitting</li>
                    <li>Review your answers after submission</li>
                    <li>Retake any module to improve your score</li>
                </ul>
            </div>
			
            <div class="test-grid animate-on-scroll">
				{#each modules as module, idx}
					<div class="test-card available animate-scale" style="--delay: {idx * 0.1}s">
						<div class="test-icon">{module.icon}</div>
						<h3>Module {module.id}</h3>
						<h4>{module.title}</h4>
						<p>{module.description}</p>
						<div class="test-info">
							<span>📝 {module.questions.length} questions</span>
						</div>
						<button class="test-button" onclick={() => startModule(module)}>Start Assessment</button>
					</div>
				{/each}
			</div>
		</div>

	{:else if viewState === 'quiz' && selectedModule}
		<!-- Quiz View -->
		<div class="quiz-container animate-on-scroll">
			<div class="quiz-header">
				<button class="back-button" onclick={backToSelection}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M19 12H5M12 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Back to Modules
				</button>
				<div class="module-title">
					<span class="module-icon">{selectedModule.icon}</span>
					<h2>Module {selectedModule.id}: {selectedModule.title}</h2>
				</div>
			</div>

			<div class="progress-bar">
				<div class="progress-fill" style="width: {((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%"></div>
			</div>
			<div class="progress-text">
				Question {currentQuestionIndex + 1} of {selectedModule.questions.length}
			</div>

			<div class="question-card">
				<h3 class="question-text">
					{currentQuestionIndex + 1}. {selectedModule.questions[currentQuestionIndex].text}
				</h3>

				<div class="options-list">
					{#each selectedModule.questions[currentQuestionIndex].options as option, idx}
						<label class="option-item" class:selected={userAnswers[currentQuestionIndex] === idx}>
							<input 
								type="radio" 
								name="answer" 
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
		<div class="results-container animate-on-scroll">
			<div class="results-header">
				<div class="results-icon">{score >= 70 ? '🎉' : '�'}</div>
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
				<button class="action-button" onclick={backToSelection}>
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
		min-height: calc(100vh - 64px);
		padding: 2rem;
		background: #F6F7FA;
	}

	/* Module Selection Styles */
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
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.test-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.test-card {
		background: white;
		border: 2px solid #E0E0E0;
		border-radius: 0.75rem;
		padding: 2rem;
		text-align: center;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--delay, 0s);
		display: flex;
		flex-direction: column;
	}

	.test-card.available {
		border-color: #38C172;
	}

	.test-card:hover {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
		transform: translateY(-4px);
	}

	.test-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.test-card h3 {
		font-family: 'Montserrat', sans-serif;
		color: #38C172;
		font-size: 1.1rem;
		margin: 0 0 0.25rem 0;
		font-weight: 600;
	}

	.test-card h4 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 1.3rem;
		margin: 0 0 0.75rem 0;
	}

	.test-card p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		margin-bottom: 1rem;
		line-height: 1.5;
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

	.info-box {
		background: #F6F7FA;
		border-left: 4px solid #223A5E;
		padding: 1.5rem;
		border-radius: 0.5rem;
        margin: 2rem 0;
	}

	.info-box h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		margin: 0 0 1rem 0;
	}

	.info-box ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		font-family: 'Roboto', sans-serif;
		color: #222831;
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	/* Quiz Styles */
	.quiz-container {
		max-width: 900px;
		margin: 0 auto;
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.quiz-header {
		margin-bottom: 2rem;
	}

	.back-button {
		background: none;
		border: none;
		color: #666;
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: none;
		padding: 0.5rem;
		margin-bottom: 1rem;
		transition: color 0.3s ease;
	}

	.back-button:hover {
		color: #223A5E;
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
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 1.8rem;
		margin: 0;
	}

	.progress-bar {
		height: 8px;
		background: #E0E0E0;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #38C172 0%, #2da85f 100%);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 0.9rem;
		text-align: right;
		margin-bottom: 2rem;
	}

	.question-card {
		background: #F6F7FA;
		border-radius: 0.75rem;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.question-text {
		font-family: 'Roboto', sans-serif;
		color: #223A5E;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		font-weight: 500;
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
		padding: 1rem 1.25rem;
		background: white;
		border: 2px solid #E0E0E0;
		border-radius: 0.5rem;
		cursor: none;
		transition: all 0.3s ease;
	}

	.option-item:hover {
		border-color: #38C172;
		background: rgba(56, 193, 114, 0.05);
	}

	.option-item.selected {
		border-color: #38C172;
		background: rgba(56, 193, 114, 0.1);
	}

	.option-item input[type="radio"] {
		display: none;
	}

	.option-label {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		color: #223A5E;
		font-size: 1.1rem;
		min-width: 30px;
		text-align: center;
	}

	.option-text {
		font-family: 'Roboto', sans-serif;
		color: #222831;
		flex: 1;
		line-height: 1.5;
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
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: none;
		transition: all 0.3s ease;
	}

	.nav-button.primary {
		background: #38C172;
		color: white;
	}

	.nav-button.primary:hover:not(:disabled) {
		background: #2da85f;
	}

	.nav-button.secondary {
		background: #E0E0E0;
		color: #222831;
	}

	.nav-button.secondary:hover:not(:disabled) {
		background: #d0d0d0;
	}

	.nav-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.submit-button {
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #e91e63 0%, #d81b60 100%);
	}

	.question-nav {
		background: #F6F7FA;
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.question-nav p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 0.9rem;
		margin: 0 0 0.75rem 0;
	}

	.question-dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.dot {
		width: 36px;
		height: 36px;
		border-radius: 0.375rem;
		background: white;
		border: 2px solid #E0E0E0;
		font-family: 'Roboto', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: #666;
		cursor: none;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dot:hover {
		border-color: #38C172;
	}

	.dot.answered {
		background: #38C172;
		border-color: #38C172;
		color: white;
	}

	.dot.current {
		border-color: #FF3C7E;
		border-width: 3px;
	}

	/* Results Styles */
	.results-container {
		max-width: 900px;
		margin: 0 auto;
		background: white;
		border-radius: 1rem;
		padding: 3rem 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.results-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.results-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.results-header h1 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
	}

	.results-subtitle {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 1.1rem;
	}

	.score-card {
		display: flex;
		gap: 3rem;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: #F6F7FA;
		border-radius: 1rem;
		margin-bottom: 2rem;
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
		stroke: #38C172;
		stroke-width: 8;
		stroke-linecap: round;
		stroke-dasharray: 283;
		transition: stroke-dashoffset 1s ease;
	}

	.score-number {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: #223A5E;
	}

	.score-details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-family: 'Roboto', sans-serif;
		color: #666;
		font-size: 0.9rem;
	}

	.stat-value {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
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

	.results-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: 2px solid #E0E0E0;
		border-radius: 0.5rem;
		background: white;
		color: #222831;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: none;
		transition: all 0.3s ease;
	}

	.action-button:hover {
		border-color: #223A5E;
		transform: translateY(-2px);
	}

	.action-button.primary {
		background: #38C172;
		color: white;
		border-color: #38C172;
	}

	.action-button.primary:hover {
		background: #2da85f;
		border-color: #2da85f;
	}

	.action-button.secondary {
		background: #FFA726;
		color: white;
		border-color: #FFA726;
	}

	.action-button.secondary:hover {
		background: #ff9800;
		border-color: #ff9800;
	}

	/* Review Section */
	.review-section {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #E0E0E0;
	}

	.review-section h3 {
		font-family: 'Montserrat', sans-serif;
		color: #223A5E;
		font-size: 1.5rem;
		margin: 0 0 1.5rem 0;
	}

	.review-question {
		background: #F6F7FA;
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		border-left: 4px solid #E0E0E0;
	}

	.review-question.correct {
		border-left-color: #38C172;
	}

	.review-question.incorrect {
		border-left-color: #FF3C7E;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.review-number {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		color: #223A5E;
		font-size: 1.1rem;
	}

	.review-status {
		font-family: 'Roboto', sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.review-question.correct .review-status {
		color: #38C172;
	}

	.review-question.incorrect .review-status {
		color: #FF3C7E;
	}

	.review-text {
		font-family: 'Roboto', sans-serif;
		color: #222831;
		line-height: 1.6;
		margin: 0 0 1rem 0;
	}

	.review-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.review-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: white;
		border: 2px solid #E0E0E0;
		border-radius: 0.5rem;
		position: relative;
	}

	.review-option.correct-answer {
		border-color: #38C172;
		background: rgba(56, 193, 114, 0.05);
	}

	.review-option.user-answer:not(.correct-answer) {
		border-color: #FF3C7E;
		background: rgba(255, 60, 126, 0.05);
	}

	.badge {
		margin-left: auto;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-family: 'Roboto', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.badge.correct {
		background: #38C172;
		color: white;
	}

	.badge.incorrect {
		background: #FF3C7E;
		color: white;
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.content-card, .quiz-container, .results-container {
			padding: 1.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		.test-grid {
			grid-template-columns: 1fr;
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
</style>
