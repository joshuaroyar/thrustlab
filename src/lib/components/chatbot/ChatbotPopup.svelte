<script lang="ts">
	let isOpen = $state(false);
	let isMinimized = $state(false);
	let messages = $state<Array<{type: 'ai' | 'user', content: string}>>([
		{
			type: 'ai',
			content: 'Hi! I\'m JAJA - your AI co-engineer bot for learning inside ThrustLab!'
		}
	]);
	let inputMessage = $state('');

	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen) {
			isMinimized = false;
		}
	}

	function toggleMinimize() {
		isMinimized = !isMinimized;
	}

	function sendMessage() {
		if (inputMessage.trim()) {
			messages.push({
				type: 'user',
				content: inputMessage
			});
			
			const userMsg = inputMessage;
			inputMessage = '';
			
			// Simulate AI response
			setTimeout(() => {
				messages.push({
					type: 'ai',
					content: `Thank you for your question about "${userMsg}". I'm here to help you learn! (This is a demo response - connect to a real AI backend for actual answers.)`
				});
			}, 1000);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

{#if !isOpen}
	<button class="chat-fab" onclick={toggleChat} aria-label="Open JAJA Assistant">
		<span class="fab-icon">🤖</span>
		<span class="fab-text">Ask JAJA</span>
	</button>
{:else}
	<div class="chatbot-popup" class:minimized={isMinimized}>
		<div class="chat-header">
			<div class="header-left">
				<div class="header-avatar">🤖</div>
				<div class="header-info">
					<h3>JAJA</h3>
					<p>Your AI co-engineer</p>
				</div>
			</div>
			<div class="header-actions">
				<button class="header-btn" onclick={toggleMinimize} aria-label={isMinimized ? 'Maximize' : 'Minimize'}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						{#if isMinimized}
							<polyline points="18 15 12 9 6 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						{:else}
							<polyline points="6 9 12 15 18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						{/if}
					</svg>
				</button>
				<button class="header-btn close-btn" onclick={toggleChat} aria-label="Close">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
						<line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</button>
			</div>
		</div>

		{#if !isMinimized}
			<div class="chat-body">
				<div class="chat-messages">
					{#each messages as message}
						<div class="message {message.type}-message">
							{#if message.type === 'ai'}
								<div class="message-avatar">🤖</div>
							{/if}
							<div class="message-bubble {message.type}-bubble">
								<p>{message.content}</p>
							</div>
							{#if message.type === 'user'}
								<div class="message-avatar user-avatar">👤</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="chat-input-wrapper">
					<input 
						type="text" 
						bind:value={inputMessage}
						onkeypress={handleKeyPress}
						placeholder="Fuel your curiosity, ask me anything!" 
						class="chat-input" 
					/>
					<button class="send-button" onclick={sendMessage} aria-label="Send message">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.chat-fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: white;
		border: none;
		border-radius: 50px;
		padding: 1rem 1.75rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(255, 60, 126, 0.4);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 9998;
		animation: pulse 2s ease-in-out infinite;
	}

	.chat-fab:hover {
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 12px 32px rgba(255, 60, 126, 0.5);
	}

	@keyframes pulse {
		0%, 100% {
			box-shadow: 0 8px 24px rgba(255, 60, 126, 0.4);
		}
		50% {
			box-shadow: 0 8px 32px rgba(255, 60, 126, 0.6);
		}
	}

	.fab-icon {
		font-size: 1.5rem;
		animation: wave 1.5s ease-in-out infinite;
	}

	@keyframes wave {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(15deg); }
		75% { transform: rotate(-15deg); }
	}

	.fab-text {
		font-size: 1rem;
	}

	.chatbot-popup {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 400px;
		max-height: 600px;
		background: white;
		border-radius: 1.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.chatbot-popup.minimized {
		max-height: 80px;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.chat-header {
		background: linear-gradient(135deg, #FF3C7E 0%, #223A5E 100%);
		color: white;
		padding: 1.25rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.header-avatar {
		font-size: 2rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}

	.header-info h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		line-height: 1;
	}

	.header-info p {
		font-family: 'Roboto', sans-serif;
		font-size: 0.875rem;
		margin: 0.25rem 0 0 0;
		opacity: 0.9;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.header-btn {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.header-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.close-btn:hover {
		background: rgba(255, 60, 60, 0.3);
	}

	.chat-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}

	.chat-messages {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		background: #F6F7FA;
		min-height: 300px;
		max-height: 440px;
	}

	.chat-messages::-webkit-scrollbar {
		width: 6px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #E0E0E0;
		border-radius: 3px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: #FF3C7E;
		border-radius: 3px;
	}

	.message {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.ai-message {
		justify-content: flex-start;
	}

	.user-message {
		justify-content: flex-end;
	}

	.message-avatar {
		font-size: 1.5rem;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.user-avatar {
		order: 2;
	}

	.message-bubble {
		padding: 0.875rem 1.125rem;
		border-radius: 1rem;
		max-width: 75%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.ai-bubble {
		background: white;
		border-top-left-radius: 0.25rem;
	}

	.user-bubble {
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: white;
		border-top-right-radius: 0.25rem;
		order: 1;
	}

	.message-bubble p {
		font-family: 'Roboto', sans-serif;
		font-size: 0.95rem;
		margin: 0;
		line-height: 1.5;
	}

	.ai-bubble p {
		color: #222831;
	}

	.chat-input-wrapper {
		padding: 1rem 1.5rem;
		background: white;
		border-top: 2px solid #E0E0E0;
		display: flex;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.chat-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid #E0E0E0;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 0.9rem;
		transition: all 0.3s ease;
	}

	.chat-input:focus {
		outline: none;
		border-color: #FF3C7E;
		box-shadow: 0 0 0 3px rgba(255, 60, 126, 0.1);
	}

	.send-button {
		background: linear-gradient(135deg, #FF3C7E 0%, #e91e63 100%);
		color: white;
		border: none;
		padding: 0.75rem;
		border-radius: 50%;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(255, 60, 126, 0.3);
		flex-shrink: 0;
	}

	.send-button svg {
		transition: transform 0.3s ease;
	}

	.send-button:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 16px rgba(255, 60, 126, 0.4);
	}

	.send-button:hover svg {
		transform: translateX(2px);
	}

	@media (max-width: 768px) {
		.chatbot-popup {
			width: calc(100vw - 2rem);
			max-width: 400px;
			right: 1rem;
			bottom: 1rem;
		}

		.chat-fab {
			right: 1rem;
			bottom: 1rem;
		}
	}
</style>
