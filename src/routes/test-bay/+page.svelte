<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SkyParallax from '$lib/components/ui/SkyParallax.svelte';
	let { data } = $props<{ data: PageData }>();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;

		// Scroll-triggered animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, observerOptions);

		// Observe all elements with animate-on-scroll class
		setTimeout(() => {
			const animateElements = document.querySelectorAll('.animate-on-scroll');
			animateElements.forEach(el => observer.observe(el));
		}, 100);

		return () => {
			observer.disconnect();
		};
	});

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

	// Module 1: History of Gas Turbine Engines
	const module1: Module = {
		id: 1,
		title: 'History of Gas Turbine Engines',
		description: 'Ready for takeoff? Test how well you understand the core principles and history that keep jets soaring through the skies.',
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

	// Module 2: Types of Gas Turbine Engines
	const module2: Module = {
		id: 2,
		title: 'Types of Gas Turbine Engines',
		description: 'Think you know your engines? Explore the different types, layouts, and designs that power aircraft around the world.',
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

	// Module 3: Sections of a Gas Turbine Engine
	const module3: Module = {
		id: 3,
		title: 'Sections of a Gas Turbine Engine',
		description: 'Time to get hands-on! Identify the key parts and their functions that make up a powerful jet engine.',
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

	// Derived state for current question
	let currentQuestion = $derived(
		selectedModule?.questions?.[currentQuestionIndex]
	);

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

<!-- Sky Background -->
<SkyParallax skyMode="day" staticSky={true} enableDrift={true} />

<div class="page-container">
	{#if viewState === 'selection'}
		<!-- Module Selection View -->
		<div class="content-wrapper animate-on-scroll">
			<h1 class="page-title">Test Bay</h1>
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
						<h4 class="module-title">{module.title.toUpperCase()}</h4>
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
				<div class="results-icon">{score >= 70 ? '🎉' : '📚'}</div>
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
		position: relative;
		min-height: 100vh;
		padding: 8rem 2rem 4rem;
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
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 900;
		margin: 0 0 2rem 0;
		text-align: center;
		background: linear-gradient(
			90deg,
			var(--ui-yellow) 0%,
			var(--font-accent-cyan) 20%,
			var(--ui-light-blue) 40%,
			var(--font-accent-yellow) 60%,
			var(--ui-yellow) 80%,
			var(--font-accent-cyan) 100%
		);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient-flash 4s ease-in-out infinite;
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9));
		letter-spacing: -1px;
	}

	@keyframes gradient-flash {
		0%, 100% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 50% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		75% {
			background-position: 50% 50%;
		}
	}

	.intro-text {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		line-height: 1.8;
		color: var(--font-primary);
		max-width: 900px;
		margin: 0 auto 2rem auto;
		text-align: center;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 2rem 3rem;
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.info-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 25px;
		padding: 2.5rem;
		margin-bottom: 3rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.5);
		display: flex;
		gap: 2rem;
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
		color: var(--font-accent-cyan);
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
		gap: 2rem;
	}

	.test-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border: 3px solid;
		border-radius: 25px;
		padding: 2.5rem 2rem;
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
		background: linear-gradient(90deg, transparent, rgba(255, 217, 102, 0.2), transparent);
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
		transform: translateY(-10px) scale(1.02);
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
		font-size: 1.2rem;
		margin: 0 0 1.5rem 0;
		font-weight: 900;
		line-height: 1.3;
	}

	.module-description {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 1rem;
		margin-bottom: auto;
		line-height: 1.7;
		flex-grow: 1;
		opacity: 0.9;
	}

	.start-button {
		margin-top: 2rem;
		padding: 1rem 2rem;
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
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 25px;
		padding: 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	.quiz-header {
		margin-bottom: 2rem;
	}

	.back-button {
		background: rgba(135, 206, 235, 0.15);
		border: 2px solid rgba(135, 206, 235, 0.3);
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
		background: rgba(135, 206, 235, 0.25);
		border-color: var(--font-accent-cyan);
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
		background: linear-gradient(90deg, var(--font-accent-green) 0%, #45a049 100%);
		transition: width 0.4s ease;
		box-shadow: 0 2px 4px rgba(56, 193, 114, 0.3);
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
		background: rgba(246, 247, 250, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 2.5rem;
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
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid rgba(224, 224, 224, 0.5);
		border-radius: 15px;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}

	.option-item:hover {
		border-color: var(--font-accent-cyan);
		background: rgba(135, 206, 235, 0.1);
		transform: translateX(5px);
		box-shadow: 0 4px 12px rgba(0, 206, 209, 0.15);
	}

	.option-item.selected {
		border-color: var(--font-accent-green);
		background: rgba(56, 193, 114, 0.12);
		box-shadow: 0 4px 12px rgba(56, 193, 114, 0.2);
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
		padding: 1rem 2rem;
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
		background: linear-gradient(135deg, var(--font-accent-green) 0%, #45a049 100%);
		color: var(--font-secondary);
	}

	.nav-button.primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(56, 193, 114, 0.3);
	}

	.nav-button.secondary {
		background: rgba(224, 224, 224, 0.8);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		color: var(--font-primary);
		border: 2px solid rgba(135, 206, 235, 0.3);
	}

	.nav-button.secondary:hover:not(:disabled) {
		background: rgba(135, 206, 235, 0.2);
		border-color: var(--font-accent-cyan);
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
		background: rgba(246, 247, 250, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 1.5rem;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.question-nav p {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.question-dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.dot {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.9);
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
		border-color: var(--font-accent-cyan);
		background: rgba(135, 206, 235, 0.15);
		transform: scale(1.1);
	}

	.dot.answered {
		background: linear-gradient(135deg, var(--font-accent-green) 0%, #45a049 100%);
		border-color: var(--font-accent-green);
		color: var(--font-secondary);
		box-shadow: 0 4px 12px rgba(56, 193, 114, 0.3);
	}

	.dot.current {
		border-color: var(--font-accent-cyan);
		border-width: 3px;
		box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.2);
	}

	/* Results Styles */
	.results-container {
		max-width: 900px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 25px;
		padding: 3rem 2.5rem;
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
			var(--font-accent-green) 0%,
			var(--font-accent-cyan) 100%
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
		background: rgba(246, 247, 250, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
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
		padding: 1rem 2rem;
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
		background: rgba(246, 247, 250, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 2rem;
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
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid rgba(224, 224, 224, 0.5);
		border-radius: 15px;
		position: relative;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
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
			padding: 2rem;
		}

		.jaja-character {
			width: 150px;
			height: 150px;
		}

		.page-title {
			font-size: clamp(2.5rem, 7vw, 4rem);
		}

		.intro-text {
			padding: 1.5rem 2rem;
			font-size: 1.1rem;
		}
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
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
			padding: 1.5rem;
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
			padding: 2rem 1.5rem;
		}

		.module-title {
			font-size: 1.1rem;
		}

		.module-description {
			font-size: 0.95rem;
		}

		.start-button {
			padding: 0.875rem 1.75rem;
			font-size: 0.95rem;
		}

		.quiz-container, .results-container {
			padding: 1.5rem;
		}

		.page-title {
			font-size: 2.5rem;
		}

		.intro-text {
			font-size: 0.9rem;
		}

		.info-card {
			padding: 1.5rem;
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
			font-size: 1rem;
		}

		.module-description {
			font-size: 0.85rem;
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
</style>
