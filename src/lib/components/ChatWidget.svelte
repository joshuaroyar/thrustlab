<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import type { Message } from '$lib/types/chat';

  const dispatch = createEventDispatcher();

  export let messages: Message[] = [];
  export let isLoading = false;
  export let isOpen = false;

  let inputMessage = '';
  let chatContainer: HTMLDivElement;

  function handleSubmit() {
    if (!inputMessage.trim()) return;
    dispatch('message', { content: inputMessage });
    inputMessage = '';
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  $: if (chatContainer && messages.length) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }
</script>

{#if !isOpen}
  <button
    on:click={() => isOpen = true}
    class="absolute bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-9999"
    transition:fade
    aria-label="Open chat"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
    </svg>
  </button>
{:else}
  <div
    class="fixed bottom-20 right-4 w-96 h-128 bg-white rounded-lg shadow-xl flex flex-col z-9999"
    transition:fly="{{ y: 50, duration: 300 }}"
  >
    <div class="p-4 bg-gray-800 text-white rounded-t-lg flex justify-between items-start">
      <div>
        <h2 class="text-xl font-bold">JAJA</h2>
        <p class="text-sm text-gray-300">Hi! I'm JAJA - your AI co-engineer bot for learning inside ThrustLab!</p>
      </div>
      <button
        on:click={() => isOpen = false}
        class="text-gray-300 hover:text-white focus:outline-none"
        aria-label="Close chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
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
{/if}