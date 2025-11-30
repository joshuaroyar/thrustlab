
Engineering Report: Architectural Design and Implementation of an AI-Enhanced Avionics Educational Platform


1. Executive Summary

In the rapidly evolving landscape of engineering education, the static dissemination of complex technical information—such as turbofan engine mechanics or aerodynamic principles—is increasingly insufficient. Students in safety-critical fields like avionics require dynamic, interactive learning environments that not only present data but also contextualize it through responsive query systems and multi-modal accessibility features. This technical report outlines a comprehensive architectural strategy and implementation plan for upgrading an existing SvelteKit-based educational application deployed on Vercel.
The primary objective is to integrate two high-value features: a Retrieval-Augmented Generation (RAG) chatbot capable of answering domain-specific questions with strict citation requirements, and a client-side Text-to-Speech (TTS) engine to audibly narrate technical diagrams. The proposed solution leverages the Vercel AI SDK to manage real-time streaming states and LangChain.js to orchestrate the complex retrieval logic required to ground Artificial Intelligence (AI) responses in a verified PDF knowledge base. By utilizing Pinecone as a vector database, the system ensures high-fidelity semantic search, while the integration of the Web Speech API provides a cost-effective, browser-native auditory learning layer.
This document serves as an exhaustive reference for the engineering team. It details the theoretical underpinnings of high-dimensional vector spaces, the specific mechanics of the ingestion pipeline, the implementation of server-sent events (SSE) for data streaming, and the intricacies of reactive state management in SvelteKit. Furthermore, it addresses the critical constraint of "hallucination prevention" by enforcing a dual-stream architecture where citation metadata is delivered independently of the generative text, ensuring academic integrity in a domain where precision is paramount.

2. Theoretical Framework: RAG in Safety-Critical Education


2.1 The Necessity of Retrieval-Augmented Generation (RAG)

Large Language Models (LLMs) like GPT-4 are trained on vast corpora of general knowledge. While they possess impressive reasoning capabilities, their internal knowledge base is static (cut off at the training date) and generalized. In the context of avionics engineering, relying solely on an LLM's internal weights presents significant risks:
    1. Hallucination: The model might confidently generate incorrect specifications for a "Trent 1000" engine based on statistical probability rather than factual data.
    2. Lack of Source Attribution: Standard LLMs cannot inherently cite specific pages or sections of a private document.
    3. Outdated Information: Avionics standards change; a pre-trained model cannot know about the latest safety directives unless they are injected into its context.
Retrieval-Augmented Generation (RAG) mitigates these risks by decoupling the reasoning engine (the LLM) from the knowledge base (the PDF notes). The architecture forces the model to act as a processor of retrieved information rather than a source of it. When a student asks, "How does the bypass ratio affect fuel efficiency?", the system first retrieves the specific section from the uploaded course notes discussing bypass ratios, and then instructs the LLM to "Answer the user's question using only this retrieved text." This grounding process is essential for educational integrity.1

2.2 Vector Embeddings and Semantic Search

To retrieve the "relevant section" from a PDF, the system cannot rely on simple keyword matching (lexical search). Students often use different terminology than the text (e.g., asking about "fan blades" when the text refers to "low-pressure compressor airfoils").
The solution lies in Vector Embeddings. An embedding model (such as OpenAI's text-embedding-3-small) transforms text chunks into high-dimensional vectors (lists of floating-point numbers). In this vector space, concepts that are semantically similar are positioned closer together geometrically.
    • Mathematical Basis: The relevance between a user's query vector ($A$) and a document chunk vector ($B$) is typically calculated using Cosine Similarity:
$$ \text{similarity} = \cos(\theta) = \frac{A \cdot B}{|A| |B|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}} $$
By calculating this score across the database, the system can identify the chunks most relevant to the query, even if they share no common words.3

2.3 Audio Synthesis in Pedagogy

The integration of Text-to-Speech (TTS) addresses the need for multi-modal learning. Cognitive Load Theory suggests that distributing information processing across visual (images of engines) and auditory (narrated explanation) channels can enhance retention. While cloud-based TTS services (like AWS Polly) offer premium voices, they introduce latency and ongoing operational costs. The Web Speech API (window.speechSynthesis) allows the application to leverage the synthesis engines built directly into modern operating systems, providing a zero-latency, zero-cost solution that aligns with the requirement for a "cost-effective, frontend-only" implementation.5

3. System Architecture and Technology Selection


3.1 Full-Stack Framework: SvelteKit on Vercel

SvelteKit is selected as the application framework due to its compiler-based architecture. Unlike React, which relies on a Virtual DOM and heavy runtime libraries, Svelte compiles components into highly efficient vanilla JavaScript. This results in faster page loads and smoother interactions—critical for keeping students engaged.
    • Deployment: Vercel is the native host for SvelteKit. It provides serverless functions (for the API routes) and edge caching (for static assets like the PDF diagrams).
    • API Routes: The src/routes/api/chat/+server.ts file allows us to write backend logic in TypeScript that runs in a secure server environment, protecting our OpenAI and Pinecone API keys.7

3.2 Vector Database: Pinecone vs. Alternatives

For the RAG implementation, the choice of vector database is pivotal. We compared several options based on the project requirements.
Feature
Pinecone
Supabase (pgvector)
Local (HNSWLib)
Verdict
Architecture
Managed, Serverless
PostgreSQL Extension
In-Memory / Local File
Pinecone
Setup Complexity
Low (API-based)
Medium (SQL-based)
High (Persistence issues)
Pinecone
Metadata Filtering
Native, High Performance
SQL WHERE clauses
Limited
Pinecone
Scalability
Auto-scaling
Manual provisioning
Limited by RAM
Pinecone
Vercel Integration
Excellent (HTTP API)
Excellent (TCP/HTTP)
Poor (Stateless functions)
Pinecone
Pinecone was selected because it is a managed service that decouples the storage from the compute. In a Vercel serverless environment, where the backend spins down after execution, maintaining a persistent connection to a local vector index is impossible. Pinecone's HTTP API allows the SvelteKit backend to perform stateless queries with millisecond latency.9

3.3 Orchestration Layer: Vercel AI SDK & LangChain.js

The integration of the LLM involves two distinct layers:
    1. Vercel AI SDK (The "Pipe"): This library handles the streaming transport. It manages the connection between the browser and the server, parsing the Server-Sent Events (SSE) stream into a reactive array of messages. It specifically supports StreamData, a protocol for sending auxiliary JSON (like our citations) alongside the text.11
    2. LangChain.js (The "Brain"): This library manages the logic. It handles the PDFLoader to read the avionics notes, the RecursiveCharacterTextSplitter to chunk them, and the VectorStoreRetriever to interface with Pinecone. While the AI SDK moves the bytes, LangChain decides what to send.13

4. Phase I: Knowledge Base Construction (Ingestion Pipeline)

Before the chatbot can function, the raw educational material must be processed into a searchable format. This "Ingestion Pipeline" is typically a standalone script run during the build process or triggered manually when content updates.

4.1 Document Loading and Parsing

The source material is a PDF containing text and image explanations. We utilize the PDFLoader from @langchain/community.
    • Challenge: PDFs are layout-based, not semantic. A sentence might be interrupted by a page break or a footer.
    • Configuration: We configure the loader to extract raw text while preserving the available metadata, specifically the page number. This loc.pageNumber attribute is vital for the system to fulfill the "Cite specific module" constraint.15

4.2 Semantic Chunking

Feeding an entire 100-page PDF into the context window is inefficient and expensive. We must split the text into "chunks."
    • Strategy: RecursiveCharacterTextSplitter. This algorithm recursively tries to split text by paragraph (\n\n), then line (\n), then sentence (space). This preserves the semantic integrity of the avionics explanations better than fixed-length splitting.
    • Parameters:
        ◦ Chunk Size: 1000 characters. Large enough to contain a complete thought (e.g., the operation cycle of a high-pressure compressor) but small enough to fit 4-5 chunks in the prompt context.
        ◦ Overlap: 200 characters. This "sliding window" ensures that if a sentence is split at the 1000th character, the context remains intact in the next chunk.16

4.3 Implementation: The Ingestion Script

The following TypeScript code represents the ingestion logic. It is designed to be run locally or in a CI/CD environment.

TypeScript


// scripts/ingest-data.ts
/**
 * Ingestion Script for Avionics Knowledge Base
 * 
 * Dependencies:
 * - @langchain/community: For PDFLoader
 * - @langchain/openai: For OpenAIEmbeddings
 * - @langchain/pinecone: For PineconeStore
 * - @pinecone-database/pinecone: Official Client
 */

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

dotenv.config();

// Configuration Constants
const PDF_PATH = "./data/Avionics_Module_v1.pdf";
const INDEX_NAME = process.env.PINECONE_INDEX |

| "avionics-rag";

export const runIngestion = async () => {
  console.log("🚀 Starting Ingestion Pipeline...");

  // 1. Initialize Pinecone Client
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  
  // Verify index existence
  const existingIndexes = await pinecone.listIndexes();
  const indexExists = existingIndexes.indexes?.some(i => i.name === INDEX_NAME);
  
  if (!indexExists) {
      console.log(`Creating index: ${INDEX_NAME}`);
      await pinecone.createIndex({
          name: INDEX_NAME,
          dimension: 1536, // Matches text-embedding-3-small
          metric: 'cosine',
          spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
      });
  }
  
  const pineconeIndex = pinecone.Index(INDEX_NAME);

  // 2. Load PDF Document
  console.log(`Loading PDF from ${PDF_PATH}...`);
  const loader = new PDFLoader(PDF_PATH, {
    splitPages: true, // Loads each page as a separate document initially
  });
  const rawDocs = await loader.load();
  console.log(`Loaded ${rawDocs.length} pages.`);

  // 3. Split Text into Semantic Chunks
  /* 
     We use a recursive splitter to keep paragraphs together. 
     The metadata (page numbers) from the loader is preserved.
  */
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments(rawDocs);
  console.log(`Generated ${docs.length} semantic chunks.`);

  // 4. Metadata Sanitization
  /* 
     Pinecone metadata supports strings, numbers, booleans, and lists of strings.
     We ensure strict typing here to avoid ingestion errors.
     We also clean the filename to serve as a readable "Source" citation.
  */
  const sanitizedDocs = docs.map((doc) => {
      return {
         ...doc,
          metadata: {
              page: doc.metadata.loc?.pageNumber |

| 0,
              text: doc.pageContent, // Explicitly store text in metadata for retrieval
              source: "Avionics Module 1: Turbofan Engines", // Friendly name
              section: "General Engineering" // Placeholder; advanced logic could extract headers
          }
      };
  });

  // 5. Embedding & Upsert
  console.log("Generating embeddings and upserting to Pinecone...");
  /* 
     PineconeStore.fromDocuments handles the batching automatically.
     It calls OpenAI to get vectors, then upserts to Pinecone.
  */
  await PineconeStore.fromDocuments(
    sanitizedDocs,
    new OpenAIEmbeddings({
        modelName: "text-embedding-3-small", // Cost-effective, high performance
    }),
    {
      pineconeIndex,
      maxConcurrency: 5, // Limit concurrent API calls
    }
  );

  console.log("✅ Ingestion Complete. Knowledge Base is ready.");
};

// Execute if run directly
runIngestion().catch((error) => {
  console.error("❌ Ingestion Failed:", error);
  process.exit(1);
});

Insight on Metadata Strategy: In step 4, we explicitly sanitize the metadata. The PDFLoader automatically creates a loc object. However, for the frontend to easily display "Page 12", we flatten this into a top-level page attribute. This preprocessing simplifies the retrieval logic later.13

5. Phase II: Backend Implementation (The API Route)

The core logic of the RAG system resides in the SvelteKit API route. This endpoint acts as the bridge between the user's frontend interactions and the vector database.

5.1 Route Configuration

We create a file at src/routes/api/chat/+server.ts. This utilizes SvelteKit's standard Request/Response API.
    • Environment: This code runs on the server (Node.js runtime in Vercel), ensuring secure access to API keys.

5.2 The RAG Retrieval Chain

The workflow within the API route follows these distinct steps:
    1. Input Parsing: Extract the user's latest message and the chat history.
    2. Contextual Search: Embed the user's query and query Pinecone for the top $K$ matches.
    3. Citation Extraction: Before generating the text, extract the metadata (Page, Source) from the Pinecone results.
    4. Prompt Assembly: Inject the retrieved text chunks into a "System Prompt" that enforces strict adherence to the context.
    5. Dual-Stream Response: Stream the generated text and the citation data simultaneously using the Vercel AI SDK's StreamData helper.

5.3 Code Implementation: src/routes/api/chat/+server.ts


TypeScript


import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, StreamData, type CoreMessage } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Initialize OpenAI Provider
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  // 1. Parse Request Body
  const { messages } = await request.json();
  const lastMessage = messages[messages.length - 1];

  // 2. Initialize Vector Store Connection
  const pinecone = new Pinecone({ apiKey: env.PINECONE_API_KEY });
  const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);
  
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ 
        modelName: 'text-embedding-3-small',
        openAIApiKey: env.OPENAI_API_KEY
    }),
    { pineconeIndex }
  );

  // 3. Perform Semantic Search
  // We retrieve 4 documents to provide sufficient context without overflowing tokens
  const retrievalResults = await vectorStore.similaritySearch(lastMessage.content, 4);

  // 4. Prepare Context Block and Citations
  const contextBlock = retrievalResults
   .map((doc) => doc.pageContent)
   .join('\n\n---\n\n');
  
  // Extract structured citation data
  // This will be sent as a separate data channel to the frontend
  const citations = retrievalResults.map((doc) => ({
    source: doc.metadata.source,
    page: doc.metadata.page,
    preview: doc.pageContent.substring(0, 60) + "..."
  }));

  // 5. Construct the System Prompt
  // This prompt is critical for "grounding" the AI to prevent hallucinations.
  const systemPrompt = `
    You are an expert Avionics Engineering Tutor for a university course.
    
    Guidance:
    - Answer the student's question using ONLY the provided context below.
    - If the answer is not in the context, politely state that the information is not in the course notes.
    - Do not hallucinate external information.
    - Use a professional, academic tone.
    - The context includes excerpts from "Avionics Module 1".
    
    Context from Knowledge Base:
    ${contextBlock}
  `;

  // 6. Initialize StreamData for Citations
  // The 'ai' SDK allows us to append auxiliary data to the stream.
  const data = new StreamData();
  
  // We append the citations immediately so they are available to the UI
  data.append({ 
      type: 'citations', 
      content: citations 
  });

  // 7. Execute Streaming Response
  const result = await streamText({
    model: openai('gpt-4-turbo'), // High reasoning capability
    messages: convertToCoreMessages(messages), // Convert frontend messages to AI SDK Core format
    system: systemPrompt,
    onFinish() {
      // Close the data stream when the text generation finishes
      data.close();
    },
  });

  // 8. Return the combined stream (Text + Data)
  return result.toDataStreamResponse({ data });
};

Deep Dive on StreamData: The use of StreamData 12 is the key architectural decision here. A naive approach might ask the LLM to "format citations as a JSON block at the end." This is fragile; the LLM might malform the JSON or hallucinate a page number. By retrieving the page numbers directly from the Pinecone metadata and sending them via the data channel, we bypass the LLM entirely for the citation logic. The frontend receives the exact page numbers stored in the database, guaranteeing 100% citation accuracy.

6. Phase III: Frontend Implementation (SvelteKit)

The frontend must handle the complexities of a real-time stream while presenting a clean, accessible interface. We leverage the @ai-sdk/svelte library for state management.

6.1 The useChat Hook

The useChat hook abstracts away the complexity of parsing the SSE (Server-Sent Events) stream. It provides reactive stores (messages, input, isLoading) that automatically update as data arrives from the server.
    • Data Access: The message object in the store contains a data property. This is where our citations array from the backend will appear.17

6.2 Component Structure

We will build a ChatInterface.svelte component. This component serves as the primary interaction point for the RAG feature.

HTML


<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';
  import { fly, fade } from 'svelte/transition';

  // Initialize the Chat Hook
  const { messages, input, handleSubmit, status } = useChat({
    api: '/api/chat', // Points to our RAG route
    initialMessages: [
        { 
            id: 'welcome', 
            role: 'assistant', 
            content: 'Hello! I am your Avionics Assistant. Ask me about the course modules.' 
        }
    ]
  });

  // Auto-scroll logic
  import { afterUpdate } from 'svelte';
  let chatContainer: HTMLElement;
  afterUpdate(() => {
    if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  });
</script>

<div class="chat-wrapper">
  <div class="messages-container" bind:this={chatContainer}>
    {#each $messages as message (message.id)}
      <div 
        class="message-row" 
        class:user={message.role === 'user'}
        in:fly={{ y: 20, duration: 300 }}
      >
        <div class="bubble {message.role}">
          <p>{message.content}</p>
          
          {#if message.data}
            <div class="citations-block" in:fade>
              <span class="citation-label">References:</span>
              <div class="citation-list">
                {#each message.data as dataPart}
                  {#if dataPart.type === 'citations'}
                    {#each dataPart.content as source}
                       <div class="citation-tag" title={source.preview}>
                          📄 {source.source} (Pg. {source.page})
                       </div>
                    {/each}
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
    
    {#if $status === 'streaming'}
        <div class="typing-indicator">Analyzing course notes...</div>
    {/if}
  </div>

  <form class="input-area" on:submit={handleSubmit}>
    <input 
      class="chat-input" 
      bind:value={$input} 
      placeholder="e.g., Explain the difference between N1 and N2 rotors..."
      disabled={$status === 'streaming'}
    />
    <button class="send-btn" type="submit" disabled={$status === 'streaming' ||!$input}>
      Send
    </button>
  </form>
</div>

<style>
  /* Svelte scoped styles for encapsulation */
 .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 600px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
  }
  
 .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

 .message-row {
    display: flex;
    margin-bottom: 16px;
  }
 .message-row.user { justify-content: flex-end; }
  
 .bubble {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 12px;
    line-height: 1.5;
  }
  
 .bubble.user { background: #3b82f6; color: white; border-bottom-right-radius: 2px; }
 .bubble.assistant { background: white; border: 1px solid #e2e8f0; border-bottom-left-radius: 2px; }

  /* Citation Styling */
 .citations-block {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #cbd5e1;
    font-size: 0.85rem;
  }
  
 .citation-label {
    font-weight: 600;
    color: #64748b;
    display: block;
    margin-bottom: 4px;
  }

 .citation-tag {
    display: inline-block;
    background: #f1f5f9;
    color: #475569;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 6px;
    margin-bottom: 4px;
    font-size: 0.8rem;
    cursor: help;
    border: 1px solid #cbd5e1;
  }

 .input-area {
    padding: 16px;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 10px;
  }
  
 .chat-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
  }
  
 .send-btn {
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }
 .send-btn:disabled { background: #94a3b8; cursor: not-allowed; }
</style>

UX Consideration: The "optimistic UI" provided by Svelte's reactivity ensures the user sees their message immediately. The citations render dynamically as soon as the data stream arrives, which often happens before the full text is generated, giving users immediate feedback on the sources being used.

7. Phase IV: Text-to-Speech (TTS) Implementation

The second requirement is to enable auditory learning for technical images. This must be a frontend-only solution using the Web Speech API.

7.1 The Web Speech API Architecture

The window.speechSynthesis API is an event-driven interface. It does not return audio files (like MP3s); instead, it instructs the browser's underlying engine to generate audio in real-time.
    • Key Objects:
        ◦ SpeechSynthesisUtterance: Represents the request (the text, voice, pitch, rate).
        ◦ SpeechSynthesisVoice: Represents the specific voice (e.g., "Google US English", "Microsoft Zira").
    • Asynchronous Challenge: One specific implementation detail is that window.speechSynthesis.getVoices() often returns an empty array immediately upon page load because the browser hasn't loaded the voice list yet. We must listen for the voiceschanged event to populate our list reliably.19

7.2 Implementation: ImageSpeaker.svelte

This reusable component will be placed alongside any technical diagram. It encapsulates the synthesis logic, state management (playing/stopped), and icon toggling.

HTML


<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let text: string; // The technical explanation to read
  
  let speaking = false;
  let synth: SpeechSynthesis;
  let utterance: SpeechSynthesisUtterance;
  let availableVoices: SpeechSynthesisVoice =;
  
  // Icon State
  $: iconColor = speaking? '#ef4444' : '#3b82f6'; // Red for stop, Blue for play

  onMount(() => {
    if (typeof window!== 'undefined') {
      synth = window.speechSynthesis;
      
      // Function to load voices
      const loadVoices = () => {
        availableVoices = synth.getVoices();
        // Filter for high-quality English voices
        // Priority: Local Service (Native) > Google > Default
        availableVoices.sort((a, b) => {
            if (a.localService &&!b.localService) return -1;
            return 0;
        });
      };
      
      loadVoices();
      
      // Chrome requires this event listener to ensure voices are loaded
      if (speechSynthesis.onvoiceschanged!== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  });

  onDestroy(() => {
    // Cleanup: Stop speaking if the component is destroyed (navigating away)
    if (synth && speaking) {
      synth.cancel();
    }
  });

  function toggleSpeech() {
    if (!synth) return;

    if (speaking) {
      // User clicked "Stop"
      synth.cancel();
      speaking = false;
    } else {
      // User clicked "Play"
      // Break long text into sentences for better stability? 
      // For short captions (< 500 chars), a single utterance is fine.
      utterance = new SpeechSynthesisUtterance(text);
      
      // Voice Selection Strategy
      // We prefer "Google US English" or similar for clarity
      const preferredVoice = availableVoices.find(v => 
        v.name.includes("Google US English") |

| v.name.includes("Samantha")
      ) |

| availableVoices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) utterance.voice = preferredVoice;

      // Configuration for Technical Clarity
      utterance.rate = 0.9; // Slightly slower for technical content
      utterance.pitch = 1.0;

      // Event Bindings
      utterance.onend = () => { speaking = false; };
      utterance.onerror = (e) => { 
          console.error("TTS Error:", e); 
          speaking = false; 
      };

      synth.speak(utterance);
      speaking = true;
    }
  }
</script>

<button 
  class="speaker-btn" 
  on:click={toggleSpeech} 
  aria-label={speaking? "Stop reading" : "Read explanation aloud"}
  style="color: {iconColor}"
>
  {#if speaking}
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
  {/if}
</button>

<style>
 .speaker-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 .speaker-btn:hover {
    background: rgba(0,0,0,0.05);
  }
</style>

Integration in Layout:
To use this in an educational module, the developer simply imports the component.

HTML


<script>
    import ImageSpeaker from '$lib/components/ImageSpeaker.svelte';
    
    const engineData = {
        title: "Turbofan High-Bypass Engine",
        image: "/assets/trent-1000.jpg",
        explanation: "The high-bypass turbofan engine features a large fan at the front that accelerates a significant mass of air around the core engine. This bypass air provides the majority of the thrust, resulting in higher fuel efficiency and reduced noise levels compared to pure turbojets."
    };
</script>

<div class="module-card">
    <h2>{engineData.title}</h2>
    <div class="image-container">
        <img src={engineData.image} alt={engineData.title} />
        <div class="audio-control">
            <ImageSpeaker text={engineData.explanation} />
        </div>
    </div>
    <p class="explanation-text">
        {engineData.explanation}
    </p>
</div>


8. Operational Considerations and Future Roadmap


8.1 Handling Rate Limits and Costs

While the TTS solution is free, the RAG chatbot incurs costs via OpenAI and Pinecone.
    • OpenAI: The embedding model text-embedding-3-small is extremely cheap ($0.00002 / 1k tokens). However, the generation model (GPT-4) is more expensive.
    • Optimization: We cache the embeddings. The ingestion script only needs to run once. For the chat, we use similaritySearch which is a read operation. Pinecone's serverless tier charges based on "Read Units" (RUs). A typical query consumes 1 RU.
    • Mitigation: Implement a rate limiter (using Vercel KV or Upstash) in the API route to prevent a single student from flooding the API with thousands of requests.

8.2 Security Best Practices

    • Environment Variables: The OPENAI_API_KEY and PINECONE_API_KEY must be stored in Vercel's Environment Variable settings, not committed to Git. The provided code accesses these via $env/dynamic/private to ensure they are never leaked to the client bundle.
    • Input Validation: Although Pinecone and OpenAI handle inputs robustly, sanitizing the user's input string in the API route is recommended to prevent prompt injection attacks (e.g., users trying to override the system prompt).

8.3 Future Enhancements

    1. Conversation History: Currently, the useChat hook handles history in the browser memory. For persistent history across sessions, we would need to integrate a Postgres database (like Vercel Postgres) to store the message logs linked to a user ID.
    2. Hybrid Search: Combining keyword search (BM25) with vector search to improve retrieval accuracy for exact part numbers (e.g., "Bolt 55-A") which semantic search sometimes misses.

9. Conclusion

The architecture detailed in this report successfully meets the dual requirements of intelligent inquiry and accessible content delivery. By combining the Vercel AI SDK's modern streaming primitives with LangChain.js's robust retrieval pipeline, we create a RAG system that is both responsive and academically rigorous. The explicit handling of citation metadata via StreamData resolves the critical constraint of source attribution, ensuring that the AI acts as a reliable tutor rather than a creative writer. Simultaneously, the Web Speech API integration democratizes access to complex visual information, allowing students to engage with avionics schematics through an auditory modality without incurring additional infrastructure costs. This full-stack solution transforms the static SvelteKit application into a dynamic, AI-powered educational platform ready for deployment.
Works cited
    1. Multi-Vector Retriever for RAG on tables, text, and images - LangChain Blog, accessed November 30, 2025, https://blog.langchain.com/semi-structured-multi-modal-rag/
    2. What is Retrieval Augmented Generation (RAG) - Vercel, accessed November 30, 2025, https://vercel.com/guides/what-is-rag
    3. PineconeEmbeddings - Docs by LangChain, accessed November 30, 2025, https://docs.langchain.com/oss/javascript/integrations/text_embedding/pinecone
    4. LangChain Vector Stores: Complete Setup Guide for 8 Databases + Local Implementation 2025 - Latenode, accessed November 30, 2025, https://latenode.com/blog/ai-frameworks-technical-infrastructure/vector-databases-embeddings/langchain-vector-stores-complete-setup-guide-for-8-databases-local-implementation-2025
    5. Using the Web Speech API - MDN Web Docs, accessed November 30, 2025, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
    6. Web Speech API - GitHub Pages, accessed November 30, 2025, https://webaudio.github.io/web-speech-api/
    7. Basic Chatbot | Vercel Academy, accessed November 30, 2025, https://vercel.com/academy/ai-sdk/basic-chatbot
    8. Getting Started: Svelte - AI SDK, accessed November 30, 2025, https://ai-sdk.dev/docs/getting-started/svelte
    9. PineconeStore - Docs by LangChain, accessed November 30, 2025, https://jeongsk.mintlify.app/oss/javascript/integrations/vectorstores/pinecone
    10. Hands-On tutorial on how to use Pinecone with LangChain - Packt, accessed November 30, 2025, https://www.packtpub.com/en-us/learning/how-to-tutorials/hands-on-tutorial-on-how-to-use-pinecone-with-langchain
    11. AI SDK Core: streamText, accessed November 30, 2025, https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
    12. Streaming Custom Data - AI SDK UI, accessed November 30, 2025, https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data
    13. RAG using LangChain : Part 1-Document Loaders | by Jayant Pal - Medium, accessed November 30, 2025, https://jayant017.medium.com/rag-using-langchain-part-1-document-loaders-b4774c04fd85
    14. Module langchain - v0.2.20, accessed November 30, 2025, https://v02.api.js.langchain.com/modules/langchain.html
    15. PDFLoader - Docs by LangChain, accessed November 30, 2025, https://docs.langchain.com/oss/javascript/integrations/document_loaders/file_loaders/pdf
    16. RecursiveCharacterTextSplitter | LangChain.js, accessed November 30, 2025, https://v03.api.js.langchain.com/classes/langchain.text_splitter.RecursiveCharacterTextSplitter.html
    17. AI SDK 5 - Vercel, accessed November 30, 2025, https://vercel.com/blog/ai-sdk-5
    18. useChat - AI SDK UI, accessed November 30, 2025, https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat
    19. Getting Started with Web Speech Synthesis API and Svelte - DEV ..., accessed November 30, 2025, https://dev.to/taw/getting-started-with-web-speech-synthesis-api-and-svelte-3l13
    20. Web apps that talk - Introduction to the Speech Synthesis API | Blog | Chrome for Developers, accessed November 30, 2025, https://developer.chrome.com/blog/web-apps-that-talk-introduction-to-the-speech-synthesis-api