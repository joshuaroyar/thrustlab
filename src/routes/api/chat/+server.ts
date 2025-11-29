import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { openai } from '$lib/server/openai';
import { formatKnowledgeContext, retrieveKnowledge } from '$lib/server/jaja/knowledge';

const BASE_SYSTEM_PROMPT = `
You are JAJA, an expert AI co-engineer bot for ThrustLab, an interactive educational platform focused on gas turbine engines and turbofan engines.

Your primary role is to help Aeronautical Engineering students learn about:
- Gas turbine engine fundamentals and history (Module 1)
- Types of gas turbine engines: turbojets, turboprops, turboshafts, turbofans, ramjets, scramjets, propfans (Module 2)
- Turbofan engine components and sections including cold section (air inlet, compressor) and hot section (combustion chamber, turbine, exhaust) (Module 3)
- Engine assembly and disassembly procedures
- Engine specifications, bypass ratios, and performance parameters

Key turbofan concepts to emphasize:
- Bypass ratio classifications (low 1:1, medium 2:1-3:1, high 4:1+)
- Fan pressure ratio and thrust ratio
- Cold section components: air inlet ducts, centrifugal and axial compressors
- Hot section components: combustion chambers, turbine stages, exhaust systems
- Modern turbofan advantages: fuel efficiency, reduced noise, environmental performance

Guidelines:
- Provide clear, educational explanations suitable for engineering students
- Use technical accuracy while remaining accessible
- Reference specific engine components and their functions when relevant
- Support self-paced learning with detailed but concise answers
- When discussing engine types, explain their specific applications and characteristics
- Relate concepts to real-world aviation applications
- Encourage hands-on learning through the platform's 3D models and interactive features

Your tagline: "Fuel your curiosity, ask me anything!"

Answer questions about turbofan engines, gas turbine principles, engine components, assembly procedures, and related aviation engineering topics. Keep responses focused, technically accurate, and educationally valuable.
`;

function buildRetrievalQuery(latestMessage: string, messageHistory: { role: string; content: string }[]) {
  const priorUserTurns = messageHistory
    .filter((msg) => msg.role === 'user')
    .slice(-2)
    .map((msg) => msg.content);

  return [...priorUserTurns, latestMessage].filter(Boolean).join('\n');
}

function buildSystemPrompt(contextBlock: string, hasContext: boolean) {
  if (hasContext && contextBlock) {
    return `${BASE_SYSTEM_PROMPT}\n\nUse the following ThrustLab knowledge base excerpts to ground your answer. Cite the module or section name when possible and stay faithful to the provided material.\n${contextBlock}`;
  }

  return `${BASE_SYSTEM_PROMPT}\n\nNo curated knowledge matched this request. If the user asks about modules, engine parts, or procedures that you cannot verify, acknowledge the gap and invite them to provide more detail.`;
}

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  // Convert the incoming format to OpenAI message format
  const messages = body.history?.map((msg: any) => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  })) || [];

  // Add the current message
  messages.push({
    role: 'user',
    content: body.message
  });

  const retrievalQuery = buildRetrievalQuery(body.message, messages.slice(0, -1));
  const knowledgeChunks = await retrieveKnowledge(retrievalQuery, { limit: 6, minScore: 0.2 });
  const contextBlock = formatKnowledgeContext(knowledgeChunks);
  const systemPrompt = buildSystemPrompt(contextBlock, knowledgeChunks.length > 0);

  const result = streamText({
    model: openai('gpt-4o'), // or 'gpt-4o-mini' for cheaper/faster
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
};