# Cloud Parallax Background - Technical Documentation

## Problem Statement
The cloud parallax background system is showing **half-formed or cropped clouds** that move across the screen. The clouds appear to be cut off or incomplete when they enter or exit the visible viewport.

## Current Implementation

### Architecture Overview
The parallax system uses **4 canvas layers** stacked on top of each other:
1. **Sky Layer** - Static gradient background with sun (no movement)
2. **Far Clouds Layer** - Slowest moving clouds (0.3x speed)
3. **Mid Clouds Layer** - Medium speed clouds (0.7x speed)
4. **Near Clouds Layer** - Fastest moving clouds (1.2x speed)

### Canvas Setup
```typescript
// Canvas dimensions
width="3200"   // Canvas is 3200px wide
height="1800"  // Canvas is 1800px tall

// Typical viewport: ~1920px wide, ~1080px tall
// Canvas is WIDER than viewport to allow horizontal scrolling
```

### Cloud Data Structure
Each cloud is defined by:
```typescript
{
  x: number,      // X position on 3200px canvas
  y: number,      // Y position on 1800px canvas
  w: number,      // Width in pixels
  h: number,      // Height in pixels
  color: string   // RGBA color with opacity
}
```

### Example Cloud Positions

**Far Clouds (Layer 1):**
```typescript
{ x: 400,  y: 200, w: 350, h: 120, color: 'rgba(255, 255, 255, 0.5)' }
{ x: 1000, y: 300, w: 400, h: 140, color: 'rgba(255, 255, 255, 0.45)' }
{ x: 1800, y: 250, w: 420, h: 150, color: 'rgba(255, 255, 255, 0.48)' }
{ x: 2500, y: 180, w: 380, h: 130, color: 'rgba(255, 255, 255, 0.47)' }
```

**Mid Clouds (Layer 2):**
```typescript
{ x: 200,  y: 400, w: 300, h: 100, color: 'rgba(255, 255, 255, 0.65)' }
{ x: 800,  y: 500, w: 320, h: 110, color: 'rgba(255, 255, 255, 0.62)' }
{ x: 1500, y: 450, w: 340, h: 115, color: 'rgba(255, 255, 255, 0.64)' }
{ x: 2200, y: 480, w: 310, h: 105, color: 'rgba(255, 255, 255, 0.63)' }
{ x: 2900, y: 420, w: 330, h: 112, color: 'rgba(255, 255, 255, 0.62)' }
```

**Near Clouds (Layer 3):**
```typescript
{ x: 100,  y: 700, w: 250, h: 80, color: 'rgba(255, 255, 255, 0.8)' }
{ x: 600,  y: 750, w: 270, h: 85, color: 'rgba(255, 255, 255, 0.78)' }
{ x: 1200, y: 800, w: 260, h: 82, color: 'rgba(255, 255, 255, 0.79)' }
{ x: 1800, y: 720, w: 280, h: 87, color: 'rgba(255, 255, 255, 0.77)' }
{ x: 2400, y: 780, w: 265, h: 84, color: 'rgba(255, 255, 255, 0.78)' }
{ x: 3000, y: 740, w: 275, h: 86, color: 'rgba(255, 255, 255, 0.8)' }
```

## Cloud Rendering Logic

### drawEnhancedCloud Function
Each cloud is drawn using **5 overlapping elliptical "puffs"** to create a realistic fluffy appearance:

```typescript
function drawEnhancedCloud(ctx, x, y, width, height, color, blur) {
  // 5 puffs with relative positions:
  const puffs = [
    { x: x,                    y: y,                    radiusX: width * 0.35, radiusY: height * 0.5 },  // Center
    { x: x - width * 0.25,    y: y + height * 0.1,    radiusX: width * 0.28, radiusY: height * 0.42 }, // Left
    { x: x + width * 0.25,    y: y + height * 0.15,   radiusX: width * 0.3,  radiusY: height * 0.45 }, // Right
    { x: x - width * 0.1,     y: y - height * 0.2,    radiusX: width * 0.25, radiusY: height * 0.38 }, // Top-left
    { x: x + width * 0.15,    y: y - height * 0.15,   radiusX: width * 0.22, radiusY: height * 0.35 }  // Top-right
  ];
  
  // Each puff uses radial gradient for soft edges
}
```

## Parallax Animation System

### Drift Animation
```typescript
// Continuous horizontal drift
driftOffset += 0.3; // pixels per frame (~18px/second at 60fps)

// Applied with modulo to create infinite loop
const drift = (driftOffset * speed) % canvasWidth;
```

### Mouse Parallax
```typescript
// Mouse position relative to center
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const deltaX = mouseX - centerX;
const deltaY = mouseY - centerY;

// Parallax offset (inverted for natural feel)
const cursorOffsetX = -(deltaX / centerX) * multiplier;
const cursorOffsetY = -(deltaY / centerY) * multiplier * 0.5;
```

### Layer Movement Speeds
```typescript
// Far layer:   0.3x base speed, 15px mouse offset
// Mid layer:   0.7x base speed, 30px mouse offset
// Near layer:  1.2x base speed, 50px mouse offset
```

### Transform Application
```typescript
style={`transform: translate3d(${drift + cursorOffsetX}px, ${cursorOffsetY}px, 0);`}
```

## The Problem: Why Clouds Appear Cropped

### Issue Analysis

1. **Canvas is 3200px wide, but clouds are NOT wrapped/repeated**
   - When drift reaches 3200px, it resets to 0 (modulo operation)
   - Clouds drawn at x=2500-3000 suddenly jump back to start
   - Creates visible "seam" where canvas edge wraps

2. **No cloud duplication for seamless looping**
   - Clouds only exist in one position on canvas
   - When canvas translates past viewport edge, gaps appear
   - No clouds exist at negative X positions to fill left side

3. **Canvas edge problem**
   ```
   Viewport: [----1920px----]
   Canvas:   [--------3200px--------]
   
   At drift=0:     Canvas visible from x=0 to x=1920
   At drift=1000:  Canvas visible from x=1000 to x=2920
   At drift=3199:  Canvas visible from x=3199 to x=5119 (WRAPS to 0)
   ```

### Visual Example of the Issue
```
Canvas (3200px):  [Cloud1---Cloud2---Cloud3---Cloud4]
                   ^                                  ^
                  x=0                              x=3200

When drift=0:     Viewport shows: [Cloud1---Cloud2]
When drift=1500:  Viewport shows: [---Cloud3---Cloud4]
When drift=3199:  Viewport shows: [4] (wraps to start, showing partial)
                                  ↑ CROPPED CLOUD appears here!
```

## Potential Solutions

### Option 1: Duplicate Clouds for Seamless Loop
- Draw clouds twice on canvas: original position + (position + 3200)
- Ensures smooth transition when wrapping
- Requires rendering twice as many clouds

### Option 2: Dynamic Cloud Repositioning
- When a cloud moves off right edge, reposition it to left edge
- Maintain continuous distribution
- Requires tracking individual cloud positions

### Option 3: Increase Canvas Width with More Clouds
- Make canvas 6400px or larger
- Add more clouds throughout
- Smoother distribution but more memory

### Option 4: Wrapping Transform Logic
- Instead of modulo on drift, use two canvases side-by-side
- Seamlessly transition between them
- More complex but visually perfect

### Option 5: Circular/Tiled Canvas Pattern
- Use CSS or canvas patterns to tile clouds
- Browser handles wrapping automatically
- May require significant refactoring

## Current Code Location

### Files Implementing Cloud Parallax:
1. `/src/routes/overhaul-station/+page.svelte` (original implementation)
2. `/src/routes/hangar-zone/+layout.svelte`
3. `/src/routes/test-bay/+page.svelte`
4. `/src/routes/dashboard/+page.svelte`
5. `/src/routes/jaja/+page.svelte`

### Key Functions:
- `initializeSkies()` - Sets up canvas and draws initial clouds
- `drawMorningSky()` - Iterates through cloud array
- `drawEnhancedCloud()` - Renders individual cloud with puffs
- `getParallaxStyle()` - Calculates transform for parallax effect

## Technology Stack
- **Framework**: SvelteKit (Svelte 5 with runes)
- **Canvas API**: HTML5 2D Canvas
- **Animation**: requestAnimationFrame for smooth 60fps
- **Reactivity**: Svelte `$state()` runes for reactive updates

## Additional Context
- Clouds drift at ~18 pixels per second (0.3px per frame × 60fps)
- Mouse parallax creates subtle depth perception
- Sky gradient and sun are static (no animation)
- System runs on fixed viewport at browser's native resolution
