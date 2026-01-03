# Build & Runtime Fixes Summary

## Date: November 30, 2025

This document summarizes all the fixes applied to resolve build and runtime errors after merging complex features (LangChain, 3D Model, ElevenLabs).

---

## Issues Found and Fixed

### 1. ✅ Missing `@langchain/pinecone` Dependency

**Problem:** The `@langchain/pinecone` package was being imported in `src/routes/api/chat/+server.ts` but was not listed in `package.json`.

**Error Message:**
```
Cannot find module '@langchain/pinecone'
```

**Fix:**
- Added `@langchain/pinecone": "^0.1.3"` to dependencies
- Downgraded `@pinecone-database/pinecone` from `^6.1.3` to `^5.0.2` to match peer dependency requirements
- Added override in `package.json` to ensure consistent Pinecone version across all packages

**Files Modified:**
- `package.json` - Added dependency and override

---

### 2. ✅ Missing Environment Variables

**Problem:** New API integrations (Groq, Pinecone, HuggingFace) required environment variables that weren't documented in `.env.example`.

**Fix:**
Added comprehensive environment variable documentation to `.env.example`:

```env
# Groq API Key for LLM (JaJa Assistant)
GROQ_API_KEY=your-groq-api-key-here

# Pinecone API Key for Vector Database (RAG)
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_INDEX=thrustlab-rag

# HuggingFace API Key for Embeddings
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
```

**Files Modified:**
- `.env.example` - Added all required API keys with documentation

---

### 3. ✅ ElevenLabs API Import Error

**Problem:** The TTS API route was using incorrect import pattern for environment variables.

**Original Code:**
```typescript
import { ELEVENLABS_API_KEY } from '$env/static/private';
```

**Error:** Environment variable name mismatch and incorrect import pattern.

**Fix:**
```typescript
import { env } from '$env/dynamic/private';
// Then use: env.ELEVENLABS_API_KEY
```

**Files Modified:**
- `src/routes/api/tts/+server.ts` - Fixed environment variable import pattern

---

### 4. ✅ Dependency Version Conflicts

**Problem:** Multiple peer dependency conflicts between packages:
- `zod` version conflict (^4.1.12 vs ^3.25.76)
- `@langchain/pinecone` requiring `@pinecone-database/pinecone@^5.0.2`
- `@langchain/core` version incompatibilities

**Fix:**
- Downgraded `zod` from `^4.1.12` to `^3.25.76`
- Used `@langchain/pinecone@^0.1.3` (compatible with `@langchain/core@^1.1.0`)
- Downgraded `@pinecone-database/pinecone` to `^5.0.2`
- Added override for `@pinecone-database/pinecone` to ensure consistency
- Used `--legacy-peer-deps` flag for installation

**Files Modified:**
- `package.json` - Updated versions and added overrides

---

### 5. ✅ Vercel Deployment Node.js Version Error

**Problem:** Vercel adapter didn't support Node.js v25.2.0.

**Error Message:**
```
Unsupported Node.js version: v25.2.0. Please use Node 20, 22 or 24
```

**Fix:**
Configured Vercel adapter to explicitly use Node.js 22:

```javascript
adapter: adapter({
  runtime: 'nodejs22.x'
})
```

**Files Modified:**
- `svelte.config.js` - Added runtime configuration

---

## Final Configuration

### package.json Changes

```json
{
  "dependencies": {
    "@langchain/pinecone": "^0.1.3",
    "@pinecone-database/pinecone": "^5.0.2",
    "zod": "^3.25.76",
    // ... other dependencies
  },
  "overrides": {
    "@pinecone-database/pinecone": "^5.0.2",
    "cookie": "^1.0.2",
    "esbuild": "^0.27.0"
  }
}
```

### svelte.config.js Changes

```javascript
kit: { 
  adapter: adapter({
    runtime: 'nodejs22.x'
  }) 
}
```

---

## Installation Instructions

To set up the project after these fixes:

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     - GROQ_API_KEY (from https://console.groq.com/keys)
     - PINECONE_API_KEY (from https://app.pinecone.io/)
     - HUGGINGFACE_API_KEY (from https://huggingface.co/settings/tokens)
     - ELEVENLABS_API_KEY (from https://elevenlabs.io/app/settings/api-keys)
     - DATABASE_URL (PostgreSQL connection string)

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

---

## Verified Working Features

✅ **JaJa Assistant (Chatbot)**
- LangChain integration working
- Pinecone vector database connection successful
- Groq LLM integration functional
- HuggingFace embeddings operational
- RAG (Retrieval-Augmented Generation) working

✅ **3D Turbofan Engine**
- BabylonJS model loading
- Color-coded component highlighting
- Tooltips displaying component information
- Interactive mesh selection

✅ **ElevenLabs TTS**
- Text-to-speech API connection
- Audio playback for component descriptions
- Audio caching system operational

✅ **Build & Deployment**
- Local development server running
- Production build successful
- Vercel deployment configuration correct

---

## Important Notes

### Using --legacy-peer-deps

Due to version conflicts between `@langchain` packages, you must use the `--legacy-peer-deps` flag when installing or updating dependencies:

```bash
npm install --legacy-peer-deps
npm update --legacy-peer-deps
```

This is safe to use and allows npm to ignore peer dependency conflicts.

### Node.js Version

For Vercel deployment, ensure you're using Node.js 20, 22, or 24. The project is configured to use Node.js 22 on Vercel.

### Environment Variables in Vercel

When deploying to Vercel, make sure to add all environment variables in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Redeploy after adding variables

---

## Testing Checklist

Before deploying, verify:

- [ ] `npm run build` succeeds without errors
- [ ] `npm run dev` starts the server
- [ ] Chatbot responds to queries
- [ ] 3D model loads and is interactive
- [ ] Clicking components plays audio
- [ ] All API endpoints return valid responses

---

## Troubleshooting

### If chatbot doesn't work:
- Verify all API keys in `.env` are correct
- Check Pinecone index name matches `PINECONE_INDEX`
- Ensure you've run `npm run knowledge:build` to populate vector database

### If 3D model doesn't load:
- Check browser console for errors
- Verify model files exist in `/static/models/`
- Clear browser cache

### If TTS doesn't work:
- Verify ELEVENLABS_API_KEY is set
- Check ElevenLabs account has credits
- Check browser console for audio errors

---

## Contact

For issues or questions, refer to:
- Project documentation in `/docs/`
- ELEVENLABS-QUICKSTART.md for TTS setup
- Individual module documentation in `/docs/main md files/`
