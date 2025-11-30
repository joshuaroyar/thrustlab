# Backend for Test Bay

Task 1: Store the questions in a database and retrieve them for tests. The current functionality uses static JSON files, but this should be replaced with a database solution.

## Database Schema

```sql
CREATE TABLE modules (
    module_no SERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    module_no INT REFERENCES modules(module_no),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL
);
```

Task 2: Store the results of tests run in the Test Bay in a database, mapped to a user. Each test result should include the following information:
- Test ID
- User ID
- Module No.
- Module Name
- Questions attempted
- Questions correct
- Questions incorrect
- Test results (marks)
- Date and time of the test

To implement the backend for storing test results in the Test Bay, we can use a relational database like PostgreSQL. Below is a sample schema and example code snippets to handle the storage of test results.

## Database Schema

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tests (
    test_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    test_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    module_no INT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    total_questions INT NOT NULL,
    questions_correct INT NOT NULL,
    questions_incorrect INT NOT NULL,
    marks INT NOT NULL
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(test_id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    user_answer VARCHAR(255) NOT NULL
);
```

Task 3: Implement API endpoints to handle the storage and retrieval of test results.

## API Endpoints

### Store Test Results

```javascript
app.post('/api/tests', async (req, res) => {
    const { userId, moduleNo, moduleName, questions, marks } = req.body;

    const totalQuestions = questions.length;
    const questionsCorrect = questions.filter(q => q.userAnswer === q.correctAnswer).length;
    const questionsIncorrect = totalQuestions - questionsCorrect;

    const testResult = await db.query(
        'INSERT INTO tests (user_id, module_no, module_name, total_questions, questions_correct, questions_incorrect, marks) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING test_id',
        [userId, moduleNo, moduleName, totalQuestions, questionsCorrect, questionsIncorrect, marks]
    );

    const testId = testResult.rows[0].test_id;

    for (const question of questions) {
        await db.query(
            'INSERT INTO questions (test_id, question_text, options, correct_answer, user_answer) VALUES ($1, $2, $3, $4, $5)',
            [testId, question.questionText, JSON.stringify(question.options), question.correctAnswer, question.userAnswer]
        );
    }

    res.status(201).json({ message: 'Test results stored successfully', testId });
});
```

### Retrieve Test Results

```javascript
app.get('/api/tests/:userId', async (req, res) => {
    const { userId } = req.params;

    const tests = await db.query(
        'SELECT * FROM tests WHERE user_id = $1',
        [userId]
    );

    res.status(200).json(tests.rows);
});
```

This setup provides a basic structure for storing and retrieving test results in the Test Bay. You can expand upon this by adding more features such as pagination for retrieving test results, filtering by date, or adding more detailed analytics based on the stored data.

Task 4: When displaying test results to the user, fetch the relevant data from the database and present it in a user-friendly format.

Task 5: Update the frontend to interact with these new API endpoints for storing and retrieving test results.

Task 6: Update the test results in the /dashboard route to fetch data from the database instead of static files.