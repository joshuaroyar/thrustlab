<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import ChatWidget from '$lib/components/ChatWidget.svelte';
  import type { Message } from '$lib/types/chat';

  let messages: Message[] = [];
  let inputMessage = '';
  let chatContainer: HTMLDivElement;
  let isLoading = false;
  let isChatWidgetOpen = false;

  function generateMessageId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async function handleMessage(messageContent: string) {
    const userMessage: Message = {
      id: generateMessageId(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };

    messages = [...messages, userMessage];
    isLoading = true;

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateMessageId(),
        content: "I'll help you explore and learn about ThrustLab! What would you like to know?",
        role: 'assistant',
        timestamp: new Date()
      };
      messages = [...messages, aiMessage];
      isLoading = false;
    }, 1000);
  }

  function handleSubmit() {
    if (!inputMessage.trim()) return;
    handleMessage(inputMessage);
    inputMessage = '';
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onMount(() => {
    // Add welcome message
    messages = [{
      id: generateMessageId(),
      content: "Hi! I'm JAJA - your AI co-engineer bot for learning inside ThrustLab!",
      role: 'assistant',
      timestamp: new Date()
    }];
  });

  $: if (chatContainer && messages.length) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }
</script>

<div class="max-w-4xl mx-auto p-4 h-[calc(100vh-12rem)]">
  <div class="flex flex-col h-full bg-white rounded-lg shadow-lg">
    <div class="p-6 bg-gray-800 text-white rounded-t-lg">
      <h1 class="text-3xl font-bold mb-2">JAJA</h1>
      <p class="text-lg text-gray-300">Hi! I'm JAJA - your AI co-engineer bot for learning inside ThrustLab!</p>
    </div>

    <div 
      class="flex-1 overflow-y-auto p-4 space-y-4"
      bind:this={chatContainer}
    >
      {#each messages as message (message.id)}
        <div 
          class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
          transition:fade
        >
          <div 
            class="max-w-[80%] rounded-lg p-3 {message.role === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800'}"
          >
            <p class="wrap-break-word">{message.content}</p>
            <p class="text-xs mt-1 opacity-75 text-right">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      {/each}
      
      {#if isLoading}
        <div class="flex justify-start" transition:fade>
          <div class="bg-gray-100 rounded-lg p-4 flex space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      {/if}
    </div>

    <form 
      class="p-4 border-t border-gray-200"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="flex space-x-4">
        <input
          type="text"
          bind:value={inputMessage}
          placeholder="Fuel your curiosity, ask me anything!"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  </div>
</div>

<ChatWidget
  {messages}
  {isLoading}
  bind:isOpen={isChatWidgetOpen}
  on:message={(e) => handleMessage(e.detail.content)}
/>