<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type Difficulty = 'all' | 'beginner' | 'intermediate' | 'expert';

  type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: Difficulty;
  };

  type Answer = {
    questionIndex: number;
    selectedOption: string;
    isCorrect: boolean;
    showExplanation: boolean;
  };

  type ScoreRecord = {
    score: number;
    totalQuestions: number;
    difficulty: Difficulty;
    date: Date;
  };

  // Load score history from localStorage
  const loadScoreHistory = (): ScoreRecord[] => {
    const stored = localStorage.getItem('scoreHistory');
    return stored ? JSON.parse(stored) : [];
  };

  let scoreHistory: ScoreRecord[] = loadScoreHistory();
  let selectedDifficulty: Difficulty = 'all';
  let isReviewMode = false;
  let showScoreHistory = false;

  const allQuestions: Question[] = [
    {
      question: "Which part of the turbofan engine generates the majority of the thrust in a high-bypass design?",
      options: ["Compressor", "Turbine", "Fan", "Combustor"],
      correctAnswer: "Fan",
      explanation: "In high-bypass turbofan engines, the large fan accelerates a huge mass of air around the core, generating most of the overall thrust.",
      difficulty: "beginner"
    },
    {
      question: "What is the primary function of the compressor?",
      options: ["To ignite the fuel", "To increase the pressure of the air", "To cool the engine", "To drive the fan"],
      correctAnswer: "To increase the pressure of the air",
      explanation: "The compressor squeezes the incoming air, significantly increasing its pressure before it enters the combustor.",
      difficulty: "intermediate"
    },
    {
      question: "Where is fuel mixed with air and ignited?",
      options: ["Nozzle", "Turbine", "Compressor", "Combustor"],
      correctAnswer: "Combustor",
      explanation: "The combustor is where the combustion process occurs, releasing a massive amount of energy.",
      difficulty: "beginner"
    },
    {
      question: "What component is powered by the hot exhaust gases and drives the fan and compressor?",
      options: ["Turbine", "Afterburner", "Nozzle", "Stator"],
      correctAnswer: "Turbine",
      explanation: "The turbine extracts energy from the high-velocity gas stream to spin the main shaft, which in turn drives the fan and compressor sections.",
      difficulty: "expert"
    }
  ];

  let questions: Question[] = [];
  let currentQuestions: Question[] = [];
  
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function filterQuestionsByDifficulty(difficulty: Difficulty): void {
    const filtered = difficulty === 'all' 
      ? allQuestions 
      : allQuestions.filter(q => q.difficulty === difficulty);
    currentQuestions = shuffleArray(filtered);
    resetAssessment();
  }

  onMount(() => {
    filterQuestionsByDifficulty(selectedDifficulty);
  });

  let answers: Answer[] = currentQuestions.map((_, index) => ({
    questionIndex: index,
    selectedOption: '',
    isCorrect: false,
    showExplanation: false
  }));

  let showResults = false;
  let score = 0;

  function handleAnswer(questionIndex: number, selectedOption: string) {
    answers = answers.map(answer => 
      answer.questionIndex === questionIndex
        ? {
            ...answer,
            selectedOption,
            isCorrect: selectedOption === questions[questionIndex].correctAnswer,
            showExplanation: true
          }
        : answer
    );
  }

  function calculateScore(): number {
    return answers.filter(a => a.isCorrect).length;
  }

  function submitAssessment() {
    showResults = true;
    score = calculateScore();
  }

  function saveScore(): void {
    const newScore: ScoreRecord = {
      score,
      totalQuestions: currentQuestions.length,
      difficulty: selectedDifficulty,
      date: new Date()
    };
    scoreHistory = [newScore, ...scoreHistory].slice(0, 10); // Keep only last 10 scores
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
  }

  function resetAssessment() {
    answers = currentQuestions.map((_, index) => ({
      questionIndex: index,
      selectedOption: '',
      isCorrect: false,
      showExplanation: false
    }));
    showResults = false;
    score = 0;
    isReviewMode = false;
  }

  $: progressPercentage = (answers.filter(a => a.selectedOption).length / currentQuestions.length) * 100;
</script>

<div class="max-w-4xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Test Bay: Assessment</h1>

    <div class="mb-6 flex space-x-4">
      <select
        bind:value={selectedDifficulty}
        on:change={() => filterQuestionsByDifficulty(selectedDifficulty)}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={showResults || isReviewMode}
      >
        <option value="all">All Questions</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>

      <button
        on:click={() => showScoreHistory = !showScoreHistory}
        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {showScoreHistory ? 'Hide History' : 'Show History'}
      </button>
    </div>

    {#if showScoreHistory && scoreHistory.length > 0}
      <div class="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Score History</h2>
        <div class="space-y-2">
          {#each scoreHistory as record}
            <div class="flex justify-between items-center p-2 bg-white rounded">
              <div>
                <span class="font-semibold">{record.score}/{record.totalQuestions}</span>
                ({Math.round((record.score / record.totalQuestions) * 100)}%) -
                {record.difficulty}
              </div>
              <div class="text-gray-600">
                {new Date(record.date).toLocaleDateString()}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="mb-6 bg-gray-100 rounded-full h-2">
      <div
        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style="width: {progressPercentage}%"
      ></div>
    </div>
    
    <div class="space-y-8">
      {#each currentQuestions as question, index}
        <div class="bg-gray-50 rounded-lg p-6 {showResults ? (answers[index].isCorrect ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500') : ''}">
          <h2 class="text-xl font-semibold mb-4">
            {index + 1}. {question.question}
          </h2>
          
          <div class="space-y-3">
            {#each question.options as option}
              <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="question{index}"
                  value={option}
                  bind:group={answers[index].selectedOption}
                  on:change={() => handleAnswer(index, option)}
                  disabled={showResults}
                  class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="text-lg {showResults && option === question.correctAnswer ? 'text-green-600 font-semibold' : ''}">{option}</span>
              </label>
            {/each}
          </div>

          {#if answers[index].showExplanation && (showResults || answers[index].isCorrect)}
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
              <p class="text-blue-800">
                <span class="font-semibold">Explanation:</span> {question.explanation}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="mt-8 flex justify-between items-center">
      {#if showResults}
        <div>
          <div class="text-xl mb-4">
            Your score: <span class="font-bold">{score}</span> out of {currentQuestions.length}
            ({Math.round((score / currentQuestions.length) * 100)}%)
          </div>
          <div class="space-x-4">
            <button
              on:click={() => isReviewMode = !isReviewMode}
              class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {isReviewMode ? 'Hide Review' : 'Review Answers'}
            </button>
            <button
              on:click={resetAssessment}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      {:else}
        <button
          on:click={() => {
            submitAssessment();
            if (!isReviewMode) {
              saveScore();
            }
          }}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={answers.some(a => !a.selectedOption)}
        >
          Submit Assessment
        </button>
      {/if}
    </div>
  </div>
</div>