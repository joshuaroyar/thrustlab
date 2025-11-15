# 3D Parallax Sky Background Implementation

## Overview

This document explains the implementation of the interactive 3D parallax sky background on the ThrustLab home page. The effect features a beautiful anime-style night sky with multiple cloud layers that respond to cursor movement, creating a convincing sense of depth.

---

## Table of Contents

1. [Visual Design](#visual-design)
2. [Technical Architecture](#technical-architecture)
3. [Implementation Details](#implementation-details)
4. [Performance Optimizations](#performance-optimizations)
5. [Customization Guide](#customization-guide)

---

## Visual Design

### Layer Structure

The parallax background consists of **4 distinct layers** stacked from back to front:

```
┌─────────────────────────────────────────┐
│ Layer 1: Static Sky (Fixed)            │
│   - Night sky gradient                  │
│   - 150 animated stars                  │
│   - Glowing moon                        │
│   - No movement                         │
├─────────────────────────────────────────┤
│ Layer 2: Far Clouds (Slowest Parallax) │
│   - 11 small wispy clouds               │
│   - Parallax speed: 15px multiplier     │
│   - Blur: 4px (reduced to 1.6px actual)│
│   - Opacity: 0.65                       │
├─────────────────────────────────────────┤
│ Layer 3: Mid Clouds (Medium Parallax)  │
│   - 6 medium fluffy clouds              │
│   - Parallax speed: 35px multiplier     │
│   - Blur: 6px (reduced to 2.4px actual)│
│   - Opacity: 0.78                       │
├─────────────────────────────────────────┤
│ Layer 4: Near Clouds (Fastest Parallax)│
│   - 4 large prominent clouds            │
│   - Parallax speed: 60px multiplier     │
│   - Blur: 8px (reduced to 3.2px actual)│
│   - Opacity: 0.88                       │
└─────────────────────────────────────────┘
```

### Color Palette

**Night Sky Gradient:**
```
Top:    #0a1628 (Deep navy)
Upper:  #1a2847 (Dark blue)
Middle: #2d3f66 (Medium blue)
Bottom: #4a5f8f (Lighter blue)
```

**Cloud Colors:**
- Far clouds: `rgba(140, 165, 210, 0.65)` - Subtle cool blue
- Mid clouds: `rgba(160, 185, 230, 0.78)` - Medium cool blue
- Near clouds: `rgba(180, 200, 240, 0.88)` - Bright cool blue

**Special Elements:**
- Stars: `rgba(255, 255, 255, 0.8)` - White
- Moon: `#fffef0` to `#e8e6d5` - Warm cream gradient
- Moon glow: `rgba(255, 255, 255, 0.1)` - Soft white halo

---

## Technical Architecture

### File Location

**Primary file:** `/src/routes/+page.svelte`

### Technology Stack

- **Framework:** SvelteKit with TypeScript
- **Rendering:** HTML5 Canvas API
- **State Management:** Svelte 5 runes (`$state`, `$derived`)
- **Animation:** RequestAnimationFrame API
- **Styling:** CSS3 with transforms and transitions

### Core Components

```typescript
// Canvas references (4 layers)
let skyCanvas: HTMLCanvasElement;
let farCloudsCanvas: HTMLCanvasElement;
let midCloudsCanvas: HTMLCanvasElement;
let nearCloudsCanvas: HTMLCanvasElement;

// Mouse tracking
let mouseX = $state(0);        // Pixel position
let mouseY = $state(0);        // Pixel position

// Animation state
let driftOffset = $state(0);   // Continuous drift counter
let mounted = $state(false);   // Lifecycle flag
```

---

## Implementation Details

### 1. Canvas Setup

Each layer uses a high-resolution canvas for crisp rendering:

```html
<canvas 
  bind:this={skyCanvas}
  class="parallax-layer sky-layer"
  width="2560"
  height="1440"
></canvas>
```

**Dimensions:**
- Width: 2560px (33% larger than 1920px for edge handling)
- Height: 1440px (33% larger than 1080px)
- Reason: Prevents cutoff during parallax movement

### 2. Sky Layer Generation

**Function:** `generateSkyLayer()`

```typescript
function generateSkyLayer() {
  const ctx = skyCanvas.getContext('2d');
  const width = skyCanvas.width;
  const height = skyCanvas.height;

  // 1. Night sky gradient (4 color stops)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a1628');    // Deep navy
  gradient.addColorStop(0.3, '#1a2847');  // Dark blue
  gradient.addColorStop(0.6, '#2d3f66');  // Medium blue
  gradient.addColorStop(1, '#4a5f8f');    // Lighter blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Stars (150 random positions in upper 60%)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.6;
    const radius = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Moon with glow and craters
  const moonX = width * 0.85;
  const moonY = height * 0.15;
  const moonRadius = 50;
  
  // Glow effect
  const moonGlow = ctx.createRadialGradient(
    moonX, moonY, moonRadius * 0.5,
    moonX, moonY, moonRadius * 3
  );
  moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  // Moon body with gradient
  const moonGradient = ctx.createRadialGradient(
    moonX - 15, moonY - 15, 10,
    moonX, moonY, moonRadius
  );
  moonGradient.addColorStop(0, '#fffef0');
  moonGradient.addColorStop(1, '#e8e6d5');
}
```

### 3. Cloud Generation with Texture

**Function:** `drawAnimeCloud(ctx, x, y, width, height, color, blur)`

**Key Features:**
- **8 overlapping puffs** per cloud for rich detail
- **Dual-layer rendering** (sharp base + soft blur overlay)
- **Radial gradients** for natural texture
- **Highlight layer** for 3D depth

```typescript
function drawAnimeCloud(ctx, x, y, width, height, color, blur) {
  // Parse RGBA color
  const [, r, g, b, a = '1'] = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
  const baseAlpha = parseFloat(a);

  // Define 8 puffs with varying positions, scales, and opacities
  const puffs = [
    { offsetX: 0, offsetY: 0, scale: 1.0, alpha: baseAlpha },
    { offsetX: width * 0.35, offsetY: -height * 0.25, scale: 0.85, alpha: baseAlpha * 0.95 },
    { offsetX: -width * 0.3, offsetY: -height * 0.2, scale: 0.75, alpha: baseAlpha * 0.9 },
    // ... 5 more puffs
  ];

  // Layer 1: Sharp base (no blur)
  ctx.filter = 'none';
  puffs.forEach(puff => {
    const gradient = ctx.createRadialGradient(
      x + puff.offsetX, y + puff.offsetY, 0,
      x + puff.offsetX, y + puff.offsetY, radiusX
    );
    // 3 gradient stops for texture
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${puff.alpha})`);
    gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.8})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${puff.alpha * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x + puff.offsetX, y + puff.offsetY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Layer 2: Soft blur overlay (60% reduced blur)
  ctx.filter = `blur(${blur * 0.4}px)`;
  ctx.globalAlpha = 0.6;
  // Render subset of puffs for softness

  // Layer 3: Highlight for 3D effect
  ctx.filter = 'none';
  ctx.globalAlpha = 0.3;
  const highlight = ctx.createRadialGradient(
    x - width * 0.1, y - height * 0.15, 0,
    x - width * 0.1, y - height * 0.15, width * 0.3
  );
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
}
```

**Blur Reduction Strategy:**
- Specified blur (e.g., 8px) is reduced to 40% (3.2px actual)
- Prevents excessive blurriness while maintaining softness
- Sharp base layer provides definition

### 4. Parallax Calculation

**Function:** `getParallaxStyle(layer: 'far' | 'mid' | 'near')`

```typescript
function getParallaxStyle(layer) {
  if (!mounted) return '';

  // 1. Continuous drift (left to right)
  const speeds = {
    far: 0.5,   // Slowest drift
    mid: 1.2,   // Medium drift
    near: 2.0   // Fastest drift
  };
  const speed = speeds[layer];
  const drift = (driftOffset * speed) % window.innerWidth;

  // 2. Cursor-based parallax
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Distance from center (in pixels)
  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  
  // Apply depth-based multiplier
  const parallaxMultiplier = {
    far: 15,   // Subtle movement
    mid: 35,   // Medium movement
    near: 60   // Strong movement
  };
  
  const multiplier = parallaxMultiplier[layer];
  
  // Negative values = clouds move opposite to cursor
  const cursorOffsetX = -(deltaX / centerX) * multiplier;
  const cursorOffsetY = -(deltaY / centerY) * multiplier * 0.6; // Less Y movement

  // 3. Combine drift + parallax
  return `transform: translate3d(${drift + cursorOffsetX}px, ${cursorOffsetY}px, 0);`;
}
```

**Why This Works:**
- **Pixel-based calculation** instead of normalized (-1 to 1)
- **Distance from center** ensures consistent response across entire screen
- **Negative offset** creates natural parallax (clouds move away from cursor)
- **Depth multipliers** create 3D illusion (near moves more than far)
- **Reduced Y movement (0.6x)** feels more natural

### 5. Animation Loop

```typescript
onMount(() => {
  // Generate all layers once
  generateSkyLayer();
  generateFarClouds();
  generateMidClouds();
  generateNearClouds();

  // Mouse tracking
  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  window.addEventListener('mousemove', handleMouseMove);

  // Continuous drift animation
  const animate = () => {
    driftOffset += 0.1; // Slow increment
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();

  // Cleanup
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };
});
```

### 6. CSS Styling

```css
/* Fixed background covers entire page */
.parallax-background-system {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

/* Gradient fade at bottom for CTA section */
.parallax-background-system::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(34, 58, 94, 0.5) 50%,
    rgba(34, 58, 94, 0.9) 100%
  );
  z-index: 10;
}

/* Individual canvas layers */
.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  pointer-events: none;
}

/* Layer-specific transitions */
.far-clouds-layer {
  z-index: 2;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mid-clouds-layer {
  z-index: 3;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.near-clouds-layer {
  z-index: 4;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**Key CSS Techniques:**
- `position: fixed` - Background stays in place during scroll
- `z-index: -1` - Behind all page content
- `will-change: transform` - GPU acceleration hint
- `cubic-bezier` easing - Smooth, natural motion
- `pointer-events: none` - Allows clicking through layers

---

## Performance Optimizations

### 1. Canvas Rendering

✅ **One-time generation** - Clouds generated once on mount, not re-drawn every frame
✅ **No continuous repaints** - Only CSS transforms updated (GPU-accelerated)
✅ **Efficient canvas size** - 2560×1440 balances quality vs memory

### 2. Transform Optimizations

```css
/* Use transform instead of position changes */
transform: translate3d(x, y, 0);  /* GPU-accelerated */

/* Hint to browser for optimization */
will-change: transform;

/* Smooth transitions */
transition: transform 0.3s-0.6s ease;
```

### 3. Event Handling

```typescript
// Single mousemove listener (no throttling needed - browser handles it)
window.addEventListener('mousemove', handleMouseMove);

// RequestAnimationFrame for drift (60fps max)
const animate = () => {
  driftOffset += 0.1;
  requestAnimationFrame(animate);
};
```

### 4. Memory Management

- Canvas elements persisted (no recreation)
- Event listeners cleaned up in `onMount` return
- Animation frames canceled on unmount

---

## Customization Guide

### Adjusting Cloud Appearance

**Make clouds sharper:**
```typescript
// In cloud generation functions, reduce blur parameter
drawAnimeCloud(ctx, x, y, w, h, color, 2); // Instead of 4-8
```

**Change cloud colors:**
```typescript
// Far clouds (blue-purple)
drawAnimeCloud(ctx, x, y, w, h, 'rgba(160, 140, 200, 0.65)', 4);

// Mid clouds (pink)
drawAnimeCloud(ctx, x, y, w, h, 'rgba(255, 180, 200, 0.78)', 6);

// Near clouds (warm white)
drawAnimeCloud(ctx, x, y, w, h, 'rgba(255, 240, 230, 0.88)', 8);
```

**Add more clouds:**
```typescript
// In generateFarClouds()
const cloudCount = 15; // Instead of 11

// Or add more to mid/near layers
const clouds = [
  { x: width * 0.08, y: height * 0.25, w: 180, h: 80 },
  // ... add more cloud objects
];
```

### Adjusting Parallax Behavior

**Make parallax stronger:**
```typescript
const parallaxMultiplier = {
  far: 25,   // Was 15
  mid: 55,   // Was 35
  near: 90   // Was 60
};
```

**Speed up/slow down drift:**
```typescript
const animate = () => {
  driftOffset += 0.2; // Faster (was 0.1)
  // Or 0.05 for slower
};
```

**Change transition smoothness:**
```css
.far-clouds-layer {
  transition: transform 0.8s ease; /* Slower, smoother */
}

.near-clouds-layer {
  transition: transform 0.2s ease; /* Faster, snappier */
}
```

### Changing Sky Colors

**Daytime sky:**
```typescript
gradient.addColorStop(0, '#87CEEB');    // Sky blue
gradient.addColorStop(0.5, '#B0E0E6');  // Powder blue
gradient.addColorStop(1, '#E0F6FF');    // Light cyan
```

**Sunset sky:**
```typescript
gradient.addColorStop(0, '#FF6B6B');    // Coral red
gradient.addColorStop(0.3, '#FFB347');  // Orange
gradient.addColorStop(0.6, '#FDFD96');  // Pastel yellow
gradient.addColorStop(1, '#87CEEB');    // Sky blue
```

**Twilight/dusk:**
```typescript
gradient.addColorStop(0, '#2d1b4e');    // Deep purple
gradient.addColorStop(0.4, '#5a3d7a');  // Medium purple
gradient.addColorStop(0.7, '#ff7eb3');  // Pink
gradient.addColorStop(1, '#ffa8d5');    // Light pink
```

### Adjusting Coverage Area

**Extend beyond CTA section:**
```css
/* Remove gradient fade */
.parallax-background-system::after {
  display: none;
}

/* Make CTA section transparent */
.cta-section {
  background: transparent;
}
```

**Stop at zones section:**
```css
.parallax-background-system::after {
  height: 600px; /* Larger fade area */
}
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Canvas API | ✅ All | ✅ All | ✅ All | ✅ All |
| CSS Transforms | ✅ 36+ | ✅ 16+ | ✅ 9+ | ✅ 12+ |
| RequestAnimationFrame | ✅ 24+ | ✅ 23+ | ✅ 10+ | ✅ 12+ |
| Backdrop Filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |

**Fallback:** If canvas not supported, sections revert to original backgrounds.

---

## Troubleshooting

### Issue: Clouds appear blurry

**Solution:** Reduce blur values in cloud generation:
```typescript
drawAnimeCloud(ctx, x, y, w, h, color, 2); // Lower value
```

### Issue: Performance lag on mobile

**Solution 1:** Reduce canvas resolution:
```html
<canvas width="1920" height="1080"></canvas>
```

**Solution 2:** Disable parallax on mobile:
```typescript
const isMobile = window.innerWidth < 768;
if (!isMobile) {
  // Apply parallax
}
```

### Issue: Clouds cut off at edges

**Solution:** Canvas already sized to 2560×1440. If still cutting off, increase padding:
```typescript
const padding = 200; // Increased from 150
```

### Issue: Cursor not responsive in corners

**Already fixed!** Using pixel-based distance calculation ensures consistent response.

---

## Future Enhancements

Potential improvements to consider:

1. **Weather variations** - Rain, snow, fog effects
2. **Time-based themes** - Day/night cycle based on user's time
3. **Interactive clouds** - Click to disperse/reform
4. **Particle system** - Falling stars, fireflies
5. **WebGL version** - For more complex effects and better performance
6. **Accessibility** - Reduced motion preference detection
7. **Mobile optimizations** - Touch-based parallax

---

## Credits

**Design Inspiration:** Anime aesthetics, Studio Ghibli sky scenes
**Technology:** SvelteKit, HTML5 Canvas, CSS3
**Implementation:** Custom parallax system with cursor tracking

---

## License

Part of the ThrustLab project. All rights reserved.

Last updated: November 11, 2025
