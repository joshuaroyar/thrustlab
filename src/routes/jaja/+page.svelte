<script lang="ts">
	import AnimatedBackground from '$lib/components/ui/AnimatedBackground.svelte';
</script>

<AnimatedBackground variant="magenta" />

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

	<div class="features-grid animate-on-scroll">
		<div class="feature-item animate-scale">
			<div class="feature-icon">💡</div>
			<h3>Expert Knowledge</h3>
			<p>Access comprehensive information on all aspects of jet propulsion</p>
		</div>
		<div class="feature-item animate-scale" style="--delay: 0.15s">
			<div class="feature-icon">⚡</div>
			<h3>Instant Answers</h3>
			<p>Get immediate responses to your technical questions 24/7</p>
		</div>
		<div class="feature-item animate-scale" style="--delay: 0.3s">
			<div class="feature-icon">🎯</div>
			<h3>Personalized Help</h3>
			<p>Receive tailored guidance based on your learning level</p>
		</div>
	</div>
</div>

<style>
	.page-container {
		min-height: calc(100vh - 64px);
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.chat-container {
		background: white;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		margin-bottom: 3rem;
		transition: all 0.4s ease;
		max-height: 700px;
		display: flex;
		flex-direction: column;
	}

	.chat-container:hover {
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	}

	.welcome-message {
		background: linear-gradient(135deg, #FF3C7E 0%, #223A5E 100%);
		color: white;
		padding: 2.5rem 2rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
		border-radius: 1.5rem;
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
		font-family: 'Montserrat', sans-serif;
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
	}

	.prompt {
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		margin: 0;
		opacity: 0.95;
		font-style: italic;
	}

	.chat-messages {
		padding: 2rem;
		min-height: 400px;
		max-height: 500px;
		overflow-y: auto;
		background: #F6F7FA;
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
		background: #FF3C7E;
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
		font-family: 'Roboto', sans-serif;
		color: #222831;
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
		font-family: 'Roboto', sans-serif;
		color: #666;
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
		border: 2px solid #E0E0E0;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
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
		padding: 1rem 1.5rem;
		border-radius: 50px;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(255, 60, 126, 0.3);
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
		box-shadow: 0 6px 16px rgba(255, 60, 126, 0.4);
	}

	.send-button:hover svg {
		transform: translateX(3px);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.feature-item {
		background: white;
		padding: 2rem;
		border-radius: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: var(--delay, 0s);
	}

	.feature-item:hover {
		transform: translateY(-10px) scale(1.05);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-item h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		color: #223A5E;
		margin: 0 0 0.75rem 0;
	}

	.feature-item p {
		font-family: 'Roboto', sans-serif;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	@media (max-width: 768px) {
		.chat-input-wrapper {
			flex-direction: column;
		}

		.send-button {
			width: 100%;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
