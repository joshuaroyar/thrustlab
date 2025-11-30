# Quick Start: ElevenLabs TTS Integration

## 🎯 What's Been Done

Your turbofan engine 3D model now has **voice narration** using ElevenLabs! When users click on color-coded components, they'll hear a **female voice** describe each part.

## 🚀 Setup Steps

### 1. Get Your ElevenLabs API Key

1. Go to https://elevenlabs.io/
2. Sign up for a free account
3. Navigate to Settings → API Keys
4. Copy your API key

### 2. Add API Key to Environment

Create or update your `.env` file in the `thrustlab` folder:

```bash
ELEVENLABS_API_KEY=your_actual_api_key_here
```

### 3. Test It Out

```bash
cd thrustlab
npm run dev
```

Then:
1. Navigate to the Turbofan Engine page
2. Click "View in Fullscreen" or view the 3D model
3. Click any color-coded component (fan rotor, compressor, turbine, etc.)
4. Listen to the voice description! 🎙️

## 🎤 Voice Details

- **Default Voice**: Rachel (calm, clear female voice)
- **Language**: English (multilingual support available)
- **Quality**: High-quality, natural-sounding speech

## 💡 Features

✅ **Automatic Audio Caching** - Audio is generated once and cached for better performance  
✅ **Preloading** - Component descriptions are preloaded when the model loads  
✅ **Visual Feedback** - Animated audio waves show when voice is playing  
✅ **Smart Playback** - Audio stops when clicking away or selecting another component  
✅ **Error Handling** - Graceful fallback if TTS fails  

## 🎨 User Experience

When a user clicks a component:
1. Component highlights in **gold/yellow**
2. Tooltip appears with name and description
3. **Audio wave indicator** shows playback status
4. Voice narrates: "*Component Name. Full description...*"

## 📝 Component Descriptions Included

All 7 turbofan components have audio:
- Fan Rotor (Light Blue)
- Gearbox (Metallic Grey)
- Low-Pressure Compressor (Green)
- High-Pressure Compressor (Yellow)
- High-Pressure Turbine (Orange)
- Combustor (Grey Core)
- Low-Pressure Turbine (Dark Blue)

## 🔧 Customization

### Change Voice

Edit `/src/routes/api/tts/+server.ts` and change the voice ID on line 28:

**Female Voices:**
- `21m00Tcm4TlvDq8ikWAM` - Rachel (default)
- `EXAVITQu4vr4xnSDxMaL` - Sarah
- `MF3mGyEYCl7XYWbV9V6O` - Elli
- `ThT5KcBeYPX3keUQqHPh` - Dorothy

### Disable TTS

In any page using ModelViewer, set:
```svelte
<ModelViewer enableTTS={false} ... />
```

### Adjust Voice Settings

In `/src/routes/api/tts/+server.ts`, modify:
```typescript
voice_settings: {
  stability: 0.5,          // 0-1, consistency
  similarity_boost: 0.75,  // 0-1, voice accuracy
  style: 0.0,              // 0-1, expressiveness
  use_speaker_boost: true  // voice clarity
}
```

## 📊 API Usage

- **Free Tier**: 10,000 characters/month
- **Paid Plans**: Available for higher usage
- **Caching**: Reduces API calls significantly

## 🐛 Troubleshooting

**No audio playing?**
- Check `.env` file has `ELEVENLABS_API_KEY`
- Restart dev server after adding the key
- Check browser console for errors
- Verify API key is valid at elevenlabs.io

**Audio quality issues?**
- Try different voice IDs
- Adjust `similarity_boost` value
- Ensure stable internet connection

## 📁 Files Created/Modified

**New Files:**
- `/src/routes/api/tts/+server.ts` - TTS API endpoint
- `/src/lib/utils/tts.ts` - TTS service
- `/docs/ELEVENLABS-TTS-SETUP.md` - Full documentation

**Modified Files:**
- `/src/lib/components/ModelViewer.svelte` - Added TTS integration
- `/src/routes/turbofan-engine/engine-fullscreen/+page.svelte` - Enabled TTS
- `/.env.example` - Added ELEVENLABS_API_KEY

## 🎓 How It Works

```
User clicks component
       ↓
ModelViewer detects click
       ↓
Calls TTS service
       ↓
TTS service checks cache
       ↓
If not cached: calls /api/tts
       ↓
API calls ElevenLabs
       ↓
Returns audio (MP3)
       ↓
Audio plays + visual feedback
```

## 📖 Full Documentation

See `/docs/ELEVENLABS-TTS-SETUP.md` for complete technical details.

---

**Need help?** Check the console for error messages or refer to the full documentation!
