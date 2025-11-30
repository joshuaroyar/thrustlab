/**
 * Text-to-Speech Service using ElevenLabs API
 * Handles audio generation and playback with caching
 */

class TTSService {
	private audioCache: Map<string, string> = new Map();
	private currentAudio: HTMLAudioElement | null = null;
	private isPlaying: boolean = false;

	/**
	 * Convert text to speech and play it
	 * @param text - The text to convert to speech
	 * @returns Promise that resolves when audio starts playing
	 */
	async speak(text: string): Promise<void> {
		if (!text || text.trim() === '') {
			console.warn('TTS: Empty text provided');
			return;
		}

		// Stop any currently playing audio
		this.stop();

		try {
			// Check cache first
			let audioUrl = this.audioCache.get(text);

			if (!audioUrl) {
				// Fetch audio from API
				const response = await fetch('/api/tts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ text })
				});

				if (!response.ok) {
					throw new Error(`TTS API error: ${response.status}`);
				}

				// Convert response to blob
				const audioBlob = await response.blob();
				audioUrl = URL.createObjectURL(audioBlob);

				// Cache the audio URL
				this.audioCache.set(text, audioUrl);
			}

			// Create and play audio
			this.currentAudio = new Audio(audioUrl);
			this.isPlaying = true;

			// Set up event listeners
			this.currentAudio.onended = () => {
				this.isPlaying = false;
			};

			this.currentAudio.onerror = (error) => {
				console.error('Audio playback error:', error);
				this.isPlaying = false;
			};

			// Play the audio
			await this.currentAudio.play();
		} catch (error) {
			console.error('TTS Error:', error);
			this.isPlaying = false;
			throw error;
		}
	}

	/**
	 * Stop the currently playing audio
	 */
	stop(): void {
		if (this.currentAudio) {
			this.currentAudio.pause();
			this.currentAudio.currentTime = 0;
			this.currentAudio = null;
		}
		this.isPlaying = false;
	}

	/**
	 * Check if audio is currently playing
	 */
	getIsPlaying(): boolean {
		return this.isPlaying;
	}

	/**
	 * Clear the audio cache
	 */
	clearCache(): void {
		// Revoke all blob URLs to free memory
		for (const url of this.audioCache.values()) {
			URL.revokeObjectURL(url);
		}
		this.audioCache.clear();
	}

	/**
	 * Preload audio for better performance
	 * @param texts - Array of texts to preload
	 */
	async preload(texts: string[]): Promise<void> {
		const promises = texts.map(async (text) => {
			if (this.audioCache.has(text)) return;

			try {
				const response = await fetch('/api/tts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ text })
				});

				if (response.ok) {
					const audioBlob = await response.blob();
					const audioUrl = URL.createObjectURL(audioBlob);
					this.audioCache.set(text, audioUrl);
				}
			} catch (error) {
				console.warn(`Failed to preload TTS for: "${text.substring(0, 50)}..."`, error);
			}
		});

		await Promise.allSettled(promises);
	}
}

// Export singleton instance
export const ttsService = new TTSService();
