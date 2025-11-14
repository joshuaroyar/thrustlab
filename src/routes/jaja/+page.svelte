<script lang="ts">
	import SkyParallax from "$lib/components/ui/SkyParallax.svelte"
</script>

<SkyParallax staticSky={true} skyMode="midnight" enableDrift={true} />

<div class="page-container">

	<div class="chat-container animate-scale">
		<div class="chat-messages">
			<div class="welcome-message animate-slide-left">
				<div class="ai-avatar">🤖</div>
				<div class="message-content">
					<p class="greeting">JAJA</p>
					<p class="prompt">Hi! I'm JAJA - your AI co-engineer bot for learning inside ThrustLab!</p>
				</div>
			</div>

			<div class="message ai-message animate-slide-left" style="--delay: 0.2s">
				<div class="message-avatar">🤖</div>
				<div class="message-bubble">
					<p>I can help you with:</p>
					<ul>
						<li>📚 Technical questions about engine components</li>
						<li>🔧 Troubleshooting guidance</li>
						<li>🎓 Learning recommendations</li>
						<li>📊 Performance calculations</li>
						<li>💡 Study tips and resources</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="chat-input-wrapper animate-on-scroll">
			<input type="text" placeholder="Fuel your curiosity, ask me anything!" class="chat-input" />
			<button class="send-button" aria-label="Send message" title="Send message">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.page-container {
		position: relative;
		z-index: 5;
		min-height: calc(100vh - 64px);
		padding: 8rem 2rem 4rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.chat-container {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.5);
		overflow: hidden;
		transition: all 0.4s ease;
		min-height: 600px;
		display: flex;
		flex-direction: column;
	}

	.chat-container:hover {
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	}

	.welcome-message {
		background: linear-gradient(135deg, var(--font-primary) 0%, var(--bg-quaternary) 100%);
		color: white;
		padding: 2.5rem 2rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.ai-avatar {
		font-size: 4rem;
		animation: float 3s ease-in-out infinite;
		flex-shrink: 0;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.message-content {
		flex: 1;
	}

	.greeting {
		font-family: var(--font-heading), 'Poppins', sans-serif;
		font-size: 1.8rem;
		font-weight: 900;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
	}

	.prompt {
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1.2rem;
		margin: 0;
		opacity: 0.95;
		font-style: italic;
	}

	.chat-messages {
		padding: 2rem;
		min-height: 400px;
		overflow-y: auto;
		background: rgba(246, 247, 250, 0.5);
		flex: 1;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #E0E0E0;
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--font-accent-cyan);
		border-radius: 4px;
	}

	.message {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		transition-delay: var(--delay, 0s);
	}

	.message-avatar {
		font-size: 2rem;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.message-bubble {
		background: white;
		padding: 1.25rem 1.5rem;
		border-radius: 1.25rem;
		border-top-left-radius: 0.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		max-width: 80%;
	}

	.message-bubble p {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		margin: 0 0 0.75rem 0;
		line-height: 1.6;
		font-size: 1.05rem;
	}

	.message-bubble p:last-child {
		margin-bottom: 0;
	}

	.message-bubble ul {
		margin: 0.75rem 0 0 0;
		padding-left: 0;
		list-style: none;
	}

	.message-bubble li {
		font-family: var(--font-body), 'Inter', sans-serif;
		color: var(--font-primary);
		opacity: 0.8;
		margin: 0.5rem 0;
		padding-left: 0.5rem;
		line-height: 1.6;
	}

	.chat-input-wrapper {
		padding: 1.5rem 2rem;
		background: white;
		border-top: 2px solid #E0E0E0;
		display: flex;
		gap: 1rem;
	}

	.chat-input {
		flex: 1;
		padding: 1rem 1.5rem;
		border: 2px solid rgba(135, 206, 235, 0.3);
		border-radius: 50px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1rem;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.8);
		color: var(--font-primary);
	}

	.chat-input::placeholder {
		color: var(--font-primary);
		opacity: 0.5;
	}

	.chat-input:focus {
		outline: none;
		border-color: var(--font-accent-cyan);
		box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.2);
		background: white;
	}

	.send-button {
		background: linear-gradient(135deg, var(--ui-yellow) 0%, var(--font-accent-yellow) 100%);
		color: var(--font-primary);
		border: none;
		padding: 1rem 1.5rem;
		border-radius: 50px;
		font-family: var(--font-body), 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(255, 217, 102, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 60px;
	}

	.send-button svg {
		transition: transform 0.3s ease;
	}

	.send-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(255, 217, 102, 0.6);
	}

	.send-button:hover svg {
		transform: translateX(3px);
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 6rem 1rem 2rem;
		}

		.chat-container {
			min-height: 500px;
		}

		.welcome-message {
			flex-direction: column;
			text-align: center;
			padding: 2rem 1.5rem;
		}

		.greeting {
			font-size: 1.5rem;
		}

		.prompt {
			font-size: 1rem;
		}

		.chat-input-wrapper {
			flex-direction: column;
			padding: 1rem;
		}

		.send-button {
			width: 100%;
		}
	}
</style>
