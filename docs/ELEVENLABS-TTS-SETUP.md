# ElevenLabs Text-to-Speech Integration

This document explains how to set up and use the ElevenLabs text-to-speech feature for the turbofan engine 3D model.

## Setup

### 1. Get ElevenLabs API Key

1. Sign up or log in at [ElevenLabs](https://elevenlabs.io/)
2. Navigate to your [API Keys settings](https://elevenlabs.io/app/settings/api-keys)
3. Generate a new API key or copy your existing one

### 2. Configure Environment Variable

Add your ElevenLabs API key to your `.env` file:

```bash
ELEVENLABS_API_KEY=your_api_key_here
```

### 3. Voice Selection

The default voice is **Rachel** (a clear, calm female voice). You can change the voice in `/src/routes/api/tts/+server.ts` by modifying the voice ID:

**Available Female Voices:**
- `21m00Tcm4TlvDq8ikWAM` - Rachel (default, calm and clear)
- `EXAVITQu4vr4xnSDxMaL` - Sarah (soft)
- `MF3mGyEYCl7XYWbV9V6O` - Elli (young)
- `ThT5KcBeYPX3keUQqHPh` - Dorothy (pleasant)

To change the voice, replace the voice ID in the API route:

```typescript
const audioStream = await elevenlabs.textToSpeech.convert(
  'YOUR_VOICE_ID_HERE', // Change this
  {
    text,
    model_id: 'eleven_multilingual_v2',
    // ...
  }
);
```

## How It Works

### Architecture

1. **API Route** (`/src/routes/api/tts/+server.ts`)
   - Server-side endpoint that communicates with ElevenLabs API
   - Converts text to audio stream
   - Returns MP3 audio data

2. **TTS Service** (`/src/lib/utils/tts.ts`)
   - Client-side service that manages audio playback
   - Handles caching to avoid repeated API calls
   - Provides play/stop controls

3. **ModelViewer Component** (`/src/lib/components/ModelViewer.svelte`)
   - Integrates TTS into the 3D model viewer
   - Plays audio when components are clicked
   - Shows visual feedback during playback

### User Experience

When a user clicks on a color-coded component in the turbofan engine 3D model:

1. The component gets highlighted in gold/yellow
2. A tooltip appears with the component name and description
3. An audio indicator shows with animated waves
4. The component description is spoken in a female voice
5. Audio can be stopped by:
   - Clicking the close button on the tooltip
   - Clicking another component (switches to new audio)
   - Clicking the background

## Features

### Caching
Audio is cached after first generation to improve performance and reduce API calls. The cache is stored in memory for the session.

### Preloading
Component descriptions are preloaded when the 3D model loads, ensuring instant playback when users click components.

### Visual Feedback
- **Audio wave animation** - Shows when audio is playing
- **Error messages** - Displays if audio fails to load
- **Highlight colors** - Cyan for hover, gold for selected

## Configuration

### Enable/Disable TTS

TTS can be toggled per ModelViewer instance:

```svelte
<ModelViewer
  modelPath="/models/Turbofan (Caseless).glb"
  enableTTS={true}  <!-- Set to false to disable -->
  {partDescriptions}
/>
```

### Voice Settings

Adjust voice parameters in `/src/routes/api/tts/+server.ts`:

```typescript
voice_settings: {
  stability: 0.5,          // 0-1, higher = more consistent
  similarity_boost: 0.75,  // 0-1, higher = closer to original voice
  style: 0.0,              // 0-1, style exaggeration
  use_speaker_boost: true  // Enhances voice clarity
}
```

## API Usage & Costs

- Each TTS request consumes ElevenLabs API credits
- Audio is cached to minimize repeat requests
- Free tier includes 10,000 characters/month
- Consider implementing rate limiting for production

## Troubleshooting

### Audio Not Playing

1. **Check API Key**: Ensure `ELEVENLABS_API_KEY` is set in `.env`
2. **Check Browser Console**: Look for error messages
3. **Check Network Tab**: Verify `/api/tts` requests are successful
4. **Check Browser Permissions**: Some browsers block autoplay

### Poor Audio Quality

1. Increase `similarity_boost` value
2. Try different voice IDs
3. Use `eleven_multilingual_v2` model for better quality

### Slow Performance

1. Audio preloading helps but requires initial load time
2. Consider reducing number of preloaded components
3. Check network speed and ElevenLabs API response times

## Files Modified

- `/src/routes/api/tts/+server.ts` - TTS API endpoint
- `/src/lib/utils/tts.ts` - TTS service utility
- `/src/lib/components/ModelViewer.svelte` - 3D viewer with TTS
- `/src/routes/turbofan-engine/engine-fullscreen/+page.svelte` - Fullscreen view with TTS enabled
- `/.env.example` - Environment variable documentation

## Future Improvements

- [ ] Add voice selection UI
- [ ] Add playback speed control
- [ ] Add volume control
- [ ] Support multiple languages
- [ ] Add pause/resume functionality
- [ ] Persistent cache across sessions
