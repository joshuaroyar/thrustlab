# Homepage Background Implementation Guide

## ⚠️ CRITICAL ISSUE: Zoomed-In Background

If the homepage background appears **zoomed in** or doesn't cover the full viewport correctly, this document explains the exact implementation that works correctly.

---

## Overview

The homepage background system consists of **4 layered canvas elements** that create an animated sky with parallax cloud effects. The system includes:
1. **Sky Canvas** - Day/night cycle with sun, moon, and stars
2. **Far Cloud Layer** - Slowest moving clouds (background)
3. **Mid Cloud Layer** - Medium speed clouds (middle ground)
4. **Near Cloud Layer** - Fastest moving clouds (foreground)

---

## HTML Structure (Markup)

The background is implemented in `src/routes/+page.svelte`. Here's the **EXACT** HTML structure:

```svelte
<div class="homepage">
	<!-- Evening Sky Background -->
	<div class="sky-background">
		<canvas bind:this={skyCanvas} width="1920" height="1080" class="sky-canvas"></canvas>
		<canvas bind:this={farCloudsCanvas} width="1920" height="1080" class="cloud-layer far"></canvas>
		<canvas bind:this={midCloudsCanvas} width="1920" height="1080" class="cloud-layer mid"></canvas>
		<canvas bind:this={nearCloudsCanvas} width="1920" height="1080" class="cloud-layer near"></canvas>
	</div>

	<!-- Hero Section -->
	<section class="hero" bind:this={heroRef}>
		<!-- Hero content here -->
	</section>
	
	<!-- Other sections... -->
</div>
```

### Key Points:
- All canvas elements have **fixed dimensions**: `width="1920" height="1080"`
- These are the **native canvas resolution**, NOT the display size
- The display size is controlled by CSS

---

## CSS Implementation (CRITICAL)

The CSS is what prevents the zoomed-in issue. Here's the **EXACT** styling required:

```css
.homepage {
	position: relative;
}

.sky-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
	overflow: hidden;
}

.sky-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;  /* CRITICAL: This prevents zooming */
}

.cloud-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;  /* CRITICAL: This prevents zooming */
	opacity: 0.9;
}

.far {
	z-index: 1;
	opacity: 0.8;
}

.mid {
	z-index: 2;
	opacity: 0.85;
}

.near {
	z-index: 3;
	opacity: 0.9;
}
```

### 🔴 CRITICAL CSS Properties:

1. **`object-fit: cover`** - This is the MOST IMPORTANT property
   - Without this, the canvas will display at its native 1920x1080 resolution
   - `cover` scales the canvas to cover the entire container while maintaining aspect ratio
   - This prevents the "zoomed in" appearance

2. **`.sky-background` must have:**
   - `position: fixed` - Keeps background fixed during scroll
   - `width: 100%` and `height: 100%` - Full viewport coverage
   - `overflow: hidden` - Prevents scrollbars

3. **All canvas elements (`.sky-canvas` and `.cloud-layer`) must have:**
   - `position: absolute`
   - `width: 100%` and `height: 100%`
   - `object-fit: cover`

---

## JavaScript/TypeScript Variables

The script section must declare these canvas bindings:

```typescript
let skyCanvas: HTMLCanvasElement;
let farCloudsCanvas: HTMLCanvasElement;
let midCloudsCanvas: HTMLCanvasElement;
let nearCloudsCanvas: HTMLCanvasElement;
```

---

## Canvas Animation Logic

### 1. Canvas Context Setup

The canvases use **2D context** and draw at their native 1920x1080 resolution:

```typescript
const ctx = skyCanvas.getContext('2d');
const w = skyCanvas.width;  // 1920
const h = skyCanvas.height; // 1080
```

### 2. Parallax Effect Calculation

Mouse parallax is calculated relative to the **window center**:

```typescript
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const deltaX = mouseX - centerX;
const deltaY = mouseY - centerY;
```

### 3. Cloud Layer Animation

Each cloud layer has different speeds and parallax multipliers:

- **Far Layer**: 
  - Speed: `BASE_DRIFT_SPEED * 0.3`
  - Mouse multiplier: `15`
  
- **Mid Layer**: 
  - Speed: `BASE_DRIFT_SPEED * 0.7`
  - Mouse multiplier: `30`
  
- **Near Layer**: 
  - Speed: `BASE_DRIFT_SPEED * 1.2`
  - Mouse multiplier: `50`

Where `BASE_DRIFT_SPEED = 0.61`

---

## Common Issues and Fixes

### Issue 1: Background Appears Zoomed In ❌

**Symptom:** The canvas elements are displaying at their native 1920x1080 resolution without scaling.

**Fix:** Ensure BOTH properties are present on `.sky-canvas` and `.cloud-layer`:
```css
width: 100%;
height: 100%;
object-fit: cover;  /* THIS IS CRITICAL */
```

### Issue 2: Background Not Full Screen ❌

**Symptom:** Background doesn't cover entire viewport.

**Fix:** Ensure `.sky-background` has:
```css
position: fixed;
width: 100%;
height: 100%;
overflow: hidden;
```

### Issue 3: Background Scrolls with Content ❌

**Symptom:** Background moves when scrolling.

**Fix:** `.sky-background` MUST use `position: fixed`, not `absolute`.

### Issue 4: Canvas Distortion ❌

**Symptom:** Canvas appears stretched or squeezed.

**Fix:** 
- Canvas width/height attributes must be `1920` and `1080`
- CSS must use `object-fit: cover`, NOT `contain` or `fill`

---

## Complete Working Example

Here's a minimal working example you can test:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	
	let skyCanvas: HTMLCanvasElement;
	
	onMount(() => {
		if (!skyCanvas) return;
		const ctx = skyCanvas.getContext('2d');
		if (!ctx) return;
		
		// Simple gradient test
		const gradient = ctx.createLinearGradient(0, 0, 0, skyCanvas.height);
		gradient.addColorStop(0, 'rgb(135, 206, 235)');
		gradient.addColorStop(1, 'rgb(255, 255, 255)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
	});
</script>

<div class="test-container">
	<div class="sky-background">
		<canvas bind:this={skyCanvas} width="1920" height="1080" class="sky-canvas"></canvas>
	</div>
	<div class="content">
		<h1>Test Content</h1>
	</div>
</div>

<style>
	.test-container {
		position: relative;
		min-height: 100vh;
	}
	
	.sky-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		overflow: hidden;
	}
	
	.sky-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.content {
		position: relative;
		z-index: 1;
		padding: 2rem;
	}
</style>
```

---

## Verification Checklist

Use this checklist to verify the implementation is correct:

- [ ] Canvas elements have `width="1920"` and `height="1080"` attributes
- [ ] `.sky-canvas` has `object-fit: cover` in CSS
- [ ] `.cloud-layer` has `object-fit: cover` in CSS
- [ ] `.sky-background` has `position: fixed`
- [ ] `.sky-background` has `width: 100%` and `height: 100%`
- [ ] `.sky-background` has `overflow: hidden`
- [ ] All canvas classes have `position: absolute`
- [ ] All canvas classes have `width: 100%` and `height: 100%`
- [ ] Canvas bindings are declared in TypeScript section
- [ ] Background displays full-screen without zooming
- [ ] Background stays fixed during scroll

---

## Additional Notes

### Canvas Resolution vs Display Size

**Important distinction:**
- **Canvas width/height attributes** (1920x1080) = Internal drawing resolution
- **CSS width/height** (100%) = Display size on screen
- **`object-fit: cover`** = How the internal resolution maps to display size

This is similar to how images work:
```html
<!-- Image has native resolution of 1920x1080 -->
<img src="image.jpg" style="width: 100%; height: 100%; object-fit: cover;">
```

### Performance Considerations

- Canvas native resolution (1920x1080) is drawn once per frame
- CSS scaling happens via GPU, very efficient
- `object-fit: cover` is hardware-accelerated
- Fixed positioning prevents reflow during scroll

---

## Instructions for Claude Sonnet 4.5

If you're Claude fixing this issue:

1. **First, check the CSS:** Look for `.sky-canvas` and `.cloud-layer` styles
2. **Verify `object-fit: cover` is present** - This is usually the missing piece
3. **Check the HTML structure** - Ensure canvas elements have correct width/height attributes
4. **Verify positioning** - `.sky-background` must be `position: fixed`
5. **Test the fix** - Background should cover entire viewport without appearing zoomed

The most common fix needed:
```css
/* Add this if missing */
.sky-canvas,
.cloud-layer {
	object-fit: cover;
}
```

---

## File Location Reference

- Main file: `thrustlab/src/routes/+page.svelte`
- Contains: HTML structure, TypeScript logic, and CSS styles
- All background code is in this single file

---

## Summary

**The key to preventing the zoomed-in background is using `object-fit: cover` on all canvas elements.** This allows the fixed 1920x1080 canvas resolution to scale properly to any viewport size while maintaining aspect ratio and coverage.
