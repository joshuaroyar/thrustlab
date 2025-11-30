import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const { questions } = await request.json();

    if (!env.GROQ_API_KEY) {
        return json({ feedback: [] });
    }

    const groq = createGroq({
        apiKey: env.GROQ_API_KEY,
    });

    try {
        const { object } = await generateObject({
            model: groq('openai/gpt-oss-120b'),
            mode: 'json',
            schema: z.object({
                feedback: z.array(z.object({
                    questionText: z.string(),
                    explanation: z.string(),
                    topicToReview: z.string()
                }))
            }),
            prompt: `
                You are an expert aviation instructor. The student answered the following questions incorrectly in a Gas Turbine Engine test.
                Provide brief, constructive feedback for each question explaining why the correct answer is correct and why the user's answer might be wrong.
                Suggest a general topic to review.

                Questions:
                ${JSON.stringify(questions, null, 2)}
            `,
        });

        return json({ feedback: object.feedback });
    } catch (error) {
        console.error("AI Error:", error);
        return json({ feedback: [] }, { status: 500 });
    }
};
