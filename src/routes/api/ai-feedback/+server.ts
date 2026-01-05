import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { questions } = await request.json();

        if (!questions || !Array.isArray(questions)) {
            return json({ error: 'Invalid data' }, { status: 400 });
        }

        // Limit to first 5 incorrect questions to save tokens
        const questionsToAnalyze = questions.slice(0, 5).map((q: any) => ({
            question: q.questionText,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer
        }));

        const prompt = `
			You are a flight instructor analyzing a pilot's test performance. 
			Analyze the following incorrect answers and provide a brief explanation and a specific topic to review for each.
			Keep the explanation concise (1-2 sentences) and the topic to review very short (2-4 words).
			
			Incorrect Questions Data:
			${JSON.stringify(questionsToAnalyze, null, 2)}
		`;

        const { object } = await generateObject({
            model: openai('gpt-4o'), // Or gpt-3.5-turbo if 4o unavailable, assuming env is set
            schema: z.object({
                feedback: z.array(z.object({
                    questionText: z.string(),
                    explanation: z.string(),
                    topicToReview: z.string()
                }))
            }),
            prompt: prompt
        });

        // Match back to original questions just in case, but the schema ensures structure
        return json({ feedback: object.feedback });

    } catch (error) {
        console.error('AI Feedback Error:', error);
        // Fallback mock response if AI fails (e.g. invalid API key) to prevent app crash
        // Fallback needs to work even if 'questions' variable from try block is unavailable
        // We'll return a generic error or attempt to parse request again if absolutely needed,
        // but simpler to just return a generic static fallback without dynamic question text if we can't access it.
        // Actually, let's just properly declare 'questions' outside.
        return json({
            feedback: [
                {
                    questionText: "Start Calculation",
                    explanation: "Unable to process AI analysis at this time. Please try again later.",
                    topicToReview: "N/A"
                }
            ]
        });
    }
};
