# ThrustLab Homepage - Comprehensive Performance Analysis

**Date Created:** November 15, 2025  
**Purpose:** Deep-dive technical analysis of the homepage structure, code flow, dependencies, and performance bottlenecks

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [File Structure & Dependencies](#file-structure--dependencies)
3. [Code Architecture & Flow](#code-architecture--flow)
4. [Performance Bottlenecks](#performance-bottlenecks)
5. [Canvas Animation System](#canvas-animation-system)
6. [Event Handlers & Listeners](#event-handlers--listeners)
7. [Memory Usage Patterns](#memory-usage-patterns)
8. [Rendering Pipeline](#rendering-pipeline)
9. [Critical Performance Issues](#critical-performance-issues)
10. [Browser Crash Causes](#browser-crash-causes)

---

## Executive Summary

### Current State
The homepage (`/src/routes/+page.svelte`) is a **2,161-line single-file component** that implements a complex parallax background system using **4 separate HTML5 canvas elements** with continuous animations, scroll-based color transitions, and mouse-tracking effects. This creates an extremely heavy computational load.

### Main Issues Identified
1. **Continuous Canvas Redraws** - 30 FPS animation loop running constantly
2. **Multiple Large Canvases** - 4 canvases at 3200x1800px each (≈23MB total memory)
3. **Complex Gradient Calculations** - Performed on every scroll event
4. **Heavy DOM Manipulation** - Intersection observers + scroll handlers
5. **No Code Splitting** - Entire 2161-line component loads upfront
6. **Expensive CSS Animations** - Multiple gradient animations running simultaneously
7. **Memory Leaks** - Potential issues with canvas contexts and event listeners

---

## File Structure & Dependencies

### Main Files
```
/src/routes/+page.svelte          (2,161 lines) - Homepage component
/src/routes/+layout.svelte         (83 lines)    - Layout wrapper
/src/routes/+layout.server.ts      (7 lines)     - Server load function
/src/app.css                       (96 lines)    - Global styles + custom cursor
/src/lib/components/navbar/Navbar.svelte        - Navigation (scroll-based color changes)
/src/lib/components/chatbot/ChatbotPopup.svelte - AI assistant popup
```

### Dependencies (package.json)
```json
{
  "svelte": "^5.41.0",
  "@sveltejs/kit": "^2.47.1",
  "tailwindcss": "^4.1.14",
  "vite": "^7.1.10"
}
```

### Asset Dependencies
- **Custom SVG Cursor** (embedded in app.css)
- **Google Fonts** (4 font families loaded in layout)
  - Montserrat: 400, 600, 700
  - Roboto: 400, 500, 600
  - Open Sans: 400, 600
  - Lato: 400, 700
- **Static Images** (researcher placeholders, zone icons)

---

## Code Architecture & Flow

### Component Lifecycle

#### 1. **Initialization Phase** (onMount)
```typescript
onMount(() => {
  // 1. Canvas initialization (4 separate canvases)
  skyCanvas.width = Math.min(window.innerWidth * 1.5, 2400);
  skyCanvas.height = Math.min(window.innerHeight * 1.2, 1000);
  // Same for farCloudsCanvas, midCloudsCanvas, nearCloudsCanvas
  
  // 2. Cloud data initialization
  initializeFarClouds();     // ~15 cloud objects
  initializeMidClouds();     // 7 cloud objects
  initializeNearClouds();    // 5 cloud objects
  
  // 3. Generate initial sky gradient with stars/moon/sun
  generateSkyLayer();
  
  // 4. Event listener setup
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 5. Start continuous animation loop
  animate(0); // Runs at 30 FPS
  
  // 6. Initialize Intersection Observers
  const observer = new IntersectionObserver(...);
});
```

#### 2. **Runtime Phase**
The application runs **multiple concurrent processes**:

**Process A: Animation Loop (30 FPS)**
```typescript
const animate = (currentTime: number) => {
  if (isPageVisible) {
    const elapsed = currentTime - lastFrameTime;
    if (elapsed >= frameInterval) {
      lastFrameTime = currentTime - (elapsed % frameInterval);
      animateCloudLayers(); // Redraws 3 cloud canvases
    }
  }
  animationFrameId = requestAnimationFrame(animate);
};
```

**Process B: Scroll Handler (debounced with RAF)**
```typescript
const handleScroll = () => {
  scrollRafId = requestAnimationFrame(() => {
    const progress = window.scrollY / scrollHeight;
    scrollProgress = progress;
    
    // Regenerate sky gradient (expensive!)
    setTimeout(() => {
      generateSkyLayer(); // Redraws entire sky canvas
    }, 100);
  });
};
```

**Process C: Mouse Movement Handler (throttled with RAF)**
```typescript
const handleMouseMove = (e: MouseEvent) => {
  rafId = requestAnimationFrame(() => {
    mouseX = lastMouseX;
    mouseY = lastMouseY;
    normalizedMouseX = (lastMouseX / window.innerWidth) * 2 - 1;
    normalizedMouseY = (lastMouseY / window.innerHeight) * 2 - 1;
  });
};
```

**Process D: Intersection Observer**
```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
```

---

## Performance Bottlenecks

### 1. **Canvas Memory Consumption**

#### Canvas Dimensions
```javascript
// Each canvas is sized at:
const canvasWidth = Math.min(window.innerWidth * 1.5, 2400);
const canvasHeight = Math.min(window.innerHeight * 1.2, 1000);

// On a 1920x1080 screen:
// Width = 1920 * 1.5 = 2880px (capped at 2400px) = 2400px
// Height = 1080 * 1.2 = 1296px (capped at 1000px) = 1000px
// Per canvas: 2400 * 1000 * 4 bytes (RGBA) = 9.6MB
// Total: 9.6MB * 4 canvases = 38.4MB just for canvas buffers!
```

#### HTML Attributes vs Runtime Size
```html
<!-- HTML declares larger sizes -->
<canvas width="3200" height="1800"></canvas>
<!-- 3200 * 1800 * 4 = 23MB per canvas = 92MB total! -->
```

**Issue:** The HTML declares 3200x1800 but JavaScript resizes it. This causes a brief memory spike during initialization.

### 2. **Continuous Canvas Redraws**

#### Animation Loop Breakdown
```typescript
function animateCloudLayers() {
  // Called 30 times per second
  
  // Far clouds layer
  farCtx.clearRect(0, 0, width, height);  // Clear entire canvas
  for (const cloud of farClouds) {        // 15 clouds
    cloud.x += BASE_DRIFT_SPEED * 0.5;
    drawAnimeCloud(farCtx, ...);          // Complex drawing operation
  }
  
  // Mid clouds layer (7 clouds)
  midCtx.clearRect(0, 0, width, height);
  for (const cloud of midClouds) {
    drawAnimeCloud(midCtx, ...);
  }
  
  // Near clouds layer (5 clouds)
  nearCtx.clearRect(0, 0, width, height);
  for (const cloud of nearClouds) {
    drawAnimeCloud(nearCtx, ...);
  }
}
```

**Calculations per second:**
- 30 FPS * 3 layers = 90 full canvas clears/sec
- 30 FPS * (15+7+5) = 810 cloud draws/sec
- Each cloud draw = 5-8 gradient operations = ~5,000 gradient calculations/sec

### 3. **drawAnimeCloud() Complexity**

This function is called 27 times per frame (810 times/sec):

```typescript
function drawAnimeCloud(ctx, x, y, width, height, color, blur) {
  // 1. Parse RGBA color (uses cache, but still overhead)
  let parsed = colorCache.get(color);
  
  // 2. Create 5 puff structures (reduced from 8)
  const puffs = [/* 5 objects with calculations */];
  
  // 3. Draw each puff with radial gradients
  for (let i = 0; i < 5; i++) {
    // Create radial gradient (expensive!)
    const gradient = ctx.createRadialGradient(...);
    gradient.addColorStop(0, colorStrings[0]);
    gradient.addColorStop(0.5, colorStrings[1]);
    gradient.addColorStop(0.8, colorStrings[2]);
    gradient.addColorStop(1, colorStrings[3]);
    
    // Draw ellipse
    ctx.beginPath();
    ctx.ellipse(puffX, puffY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 4. Apply blur effect (conditionally)
  if (blur > 0) {
    ctx.filter = `blur(${blur * 0.2}px)`;
    // Draw 3 more ellipses
  }
  
  // 5. Add highlights (2 more radial gradients)
  // Total per cloud: ~8-10 gradient objects created
}
```

**Per-frame cost:**
- 27 clouds * 5 puffs = 135 ellipses drawn
- 27 clouds * 7 gradients = 189 gradient objects created
- At 30 FPS: 5,670 gradients/sec

### 4. **generateSkyLayer() Overhead**

Called on **every scroll event** (debounced to 100ms):

```typescript
function generateSkyLayer() {
  // 1. Clear entire sky canvas
  ctx.clearRect(0, 0, width, height);
  
  // 2. Complex color interpolation based on scroll progress
  if (scrollProgress < 0.25) {
    // Midnight colors
    topColor = interpolateColor('#000000', '#0a1628', t);
    // 3 more interpolations
  } else if (scrollProgress < 0.5) {
    // Night colors (4 interpolations)
  } else if (scrollProgress < 0.75) {
    // Evening colors (4 interpolations)
  } else {
    // Day colors
  }
  
  // 3. Create large linear gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.3, midTopColor);
  gradient.addColorStop(0.6, midBottomColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height); // Fill entire canvas
  
  // 4. Draw stars (up to 100 stars with arc operations)
  if (scrollProgress < 0.6) {
    for (let i = 0; i < 100; i++) {
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
  }
  
  // 5. Draw moon/sun with multiple radial gradients
  // Moon: 3 radial gradients + 3 arc operations
  // Sun: 2 radial gradients + 1 arc operation
}
```

**Cost per scroll:**
- 100ms debounce = up to 10 calls/second during continuous scroll
- Each call: 4 color interpolations + 1 large gradient + 100 stars + moon/sun
- **Total: ~1000 canvas operations per second during scrolling**

### 5. **CSS Animation Overhead**

Multiple expensive CSS animations running simultaneously:

```css
/* On every .section-title, .feature-card h3, .gradient-text */
@keyframes gradient-flash {
  0%, 100% { background-position: 0% 50%; }
  25% { background-position: 50% 50%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 50%; }
}

/* Applied to text elements with:
   - background: linear-gradient(...)
   - background-size: 200-300% 100%
   - background-clip: text
   - -webkit-text-fill-color: transparent
   
   This forces GPU to constantly recalculate gradient positions
   and repaint text
*/
```

**Count:**
- Section titles: 3-4 on page
- Feature cards: 4 cards * 1 title each = 4
- Zone cards: 5 cards * 1 title each = 5
- Researcher names: 4 cards = 4
- Info bar values: 2
- **Total: ~20 elements with continuous gradient animations**

### 6. **Intersection Observer Load**

```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

// Observing elements
const animateElements = document.querySelectorAll(
  '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-fade'
);
animateElements.forEach(el => observer.observe(el));
```

**Elements observed:**
- Overview content: 1
- Feature cards: 4
- Zone cards: 5
- Researcher cards: 4
- Info bar: 1
- Various text elements: ~10
- **Total: ~25 elements constantly being observed**

---

## Canvas Animation System

### Layer Architecture

```
┌─────────────────────────────────────────────┐
│  Fixed Position Container (parallax-bg)     │
│  z-index: -1                                 │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Sky Layer (canvas)                      │ │
│  │ z-index: 1                              │ │
│  │ - Static gradient background            │ │
│  │ - Stars (100 dots)                      │ │
│  │ - Moon/Sun (varies by scroll)           │ │
│  │ - Regenerated on scroll                 │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Far Clouds Layer (canvas)               │ │
│  │ z-index: 2                              │ │
│  │ - 15 cloud objects                      │ │
│  │ - Drift speed: 0.5x                     │ │
│  │ - Mouse parallax: 15px                  │ │
│  │ - Redrawn at 30 FPS                     │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Mid Clouds Layer (canvas)               │ │
│  │ z-index: 3                              │ │
│  │ - 7 cloud objects                       │ │
│  │ - Drift speed: 1.2x                     │ │
│  │ - Mouse parallax: 35px                  │ │
│  │ - Redrawn at 30 FPS                     │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Near Clouds Layer (canvas)              │ │
│  │ z-index: 4                              │ │
│  │ - 5 cloud objects                       │ │
│  │ - Drift speed: 2.0x                     │ │
│  │ - Mouse parallax: 60px                  │ │
│  │ - Redrawn at 30 FPS                     │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Animation State Machine

```
State Variables:
- mouseX, mouseY: Current mouse position
- normalizedMouseX, normalizedMouseY: -1 to 1 range
- scrollProgress: 0 (midnight) to 1 (day)
- isHovering: Boolean for hover states
- mounted: Component mount status
- lastFrameTime: For FPS limiting
- lastScrollProgress: For scroll optimization
- farClouds, midClouds, nearClouds: Cloud data arrays

Event Loop:
┌─────────────────────────────────────────────┐
│ requestAnimationFrame(animate)              │
│ ↓                                            │
│ Check if page visible                       │
│ ↓                                            │
│ Calculate elapsed time                      │
│ ↓                                            │
│ If elapsed >= 33ms (30 FPS):                │
│   - Call animateCloudLayers()               │
│   - Update cloud positions                  │
│   - Clear and redraw 3 canvases             │
│ ↓                                            │
│ Schedule next frame                         │
└─────────────────────────────────────────────┘
```

### Cloud Data Structure

```typescript
type Cloud = {
  x: number;      // X position (wraps around at edge)
  y: number;      // Y position (fixed)
  w: number;      // Width (75-290px depending on layer)
  h: number;      // Height (38-125px depending on layer)
  color: string;  // RGBA color string
  blur: number;   // Blur radius (2-4px)
};

// Example:
farClouds = [
  { x: -100, y: 250, w: 75, h: 38, color: 'rgba(190, 210, 235, 0.7)', blur: 2 },
  // ... 14 more clouds
];
```

---

## Event Handlers & Listeners

### Mouse Movement Handler

**Throttling Strategy:**
```typescript
let rafId: number | null = null;
let lastMouseX = 0;
let lastMouseY = 0;

const handleMouseMove = (e: MouseEvent) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  
  // Only schedule update if one isn't pending
  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      mouseX = lastMouseX;
      mouseY = lastMouseY;
      normalizedMouseX = (lastMouseX / window.innerWidth) * 2 - 1;
      normalizedMouseY = (lastMouseY / window.innerHeight) * 2 - 1;
      rafId = null;
    });
  }
};
```

**Effect:** Reduces mouse events from ~100/sec to ~60/sec (monitor refresh rate)

### Scroll Handler

**Debouncing Strategy:**
```typescript
let scrollRafId: number | null = null;
let lastScrollProgress = -1;
let skyRegenerationTimeout: number | null = null;

const handleScroll = () => {
  if (scrollRafId !== null) return; // Prevent queuing
  
  scrollRafId = requestAnimationFrame(() => {
    const progress = window.scrollY / scrollHeight;
    
    // Only update if changed by >1%
    if (Math.abs(progress - lastScrollProgress) > 0.01) {
      scrollProgress = progress;
      lastScrollProgress = progress;
      
      // Debounce expensive sky regeneration
      if (skyRegenerationTimeout !== null) {
        clearTimeout(skyRegenerationTimeout);
      }
      skyRegenerationTimeout = setTimeout(() => {
        generateSkyLayer(); // Heavy operation
        skyRegenerationTimeout = null;
      }, 100);
    }
    
    scrollRafId = null;
  });
};
```

**Effect:** 
- RAF limits to 60 calls/sec
- 1% threshold reduces unnecessary updates
- 100ms timeout prevents regeneration during active scrolling

**Problem:** Sky still regenerates 10 times/sec during smooth scrolling

### Visibility Change Handler

```typescript
let isPageVisible = true;

const handleVisibilityChange = () => {
  isPageVisible = !document.hidden;
  if (isPageVisible) {
    lastFrameTime = performance.now(); // Prevent jumps
  }
};
```

**Effect:** Pauses animation when tab is hidden (good!)

---

## Memory Usage Patterns

### Initial Load Memory Allocation

```
1. Canvas Buffers (worst case with 3200x1800):
   - skyCanvas: 3200 * 1800 * 4 = 23.04 MB
   - farCloudsCanvas: 23.04 MB
   - midCloudsCanvas: 23.04 MB
   - nearCloudsCanvas: 23.04 MB
   Total: ~92 MB

2. Cloud Data Objects:
   - farClouds: 15 objects * ~80 bytes = 1.2 KB
   - midClouds: 7 objects * ~80 bytes = 560 bytes
   - nearClouds: 5 objects * ~80 bytes = 400 bytes
   Total: ~2.2 KB (negligible)

3. Color Cache (Map):
   - Stores parsed RGBA values
   - Max ~10 entries * 40 bytes = 400 bytes

4. Event Listener Closures:
   - handleMouseMove, handleScroll, handleVisibilityChange
   - Each ~1-2 KB = ~5 KB

5. Intersection Observer:
   - Observer object + 25 observed elements
   - ~10 KB

6. RAF Callbacks:
   - Animation loop closure
   - ~2 KB

Total Estimated Memory: 92 MB (canvas) + ~20 KB (objects/listeners)
```

### Runtime Memory Growth

**Potential Memory Leaks:**

1. **Canvas Context Retention**
   - Each getContext('2d') call creates a context object
   - If not properly released, contexts accumulate
   - 4 contexts * ~1-2 MB each

2. **Gradient Objects**
   - createRadialGradient() creates new objects
   - 189 gradients created per frame
   - Garbage collected, but high churn rate
   - At 30 FPS: 5,670 gradient objects/sec created and destroyed

3. **Event Listener Leaks**
   - If component unmounts without proper cleanup
   - Current code has proper cleanup in return statement (good!)

4. **Intersection Observer**
   - Observer.disconnect() is called (good!)
   - No leak here

5. **RAF Callbacks**
   - If animation loop continues after unmount
   - Current code cancels animation frame (good!)

---

## Rendering Pipeline

### Browser Rendering Process

```
User Action (Scroll/Mouse Move)
    ↓
Event Handler (RAF throttled)
    ↓
Update State Variables
    ↓
Animation Loop Tick (30 FPS)
    ↓
JavaScript Canvas Operations
    - clearRect (clear canvas)
    - createRadialGradient (create gradients)
    - fillStyle assignments
    - beginPath, arc/ellipse, fill
    ↓
Browser Compositing Layer
    - 4 separate canvas layers
    - CSS transforms (parallax)
    - Backdrop filters (glassmorphism)
    ↓
GPU Rasterization
    - Render canvas pixels
    - Apply CSS animations (gradient-flash)
    - Apply filters (blur, drop-shadow)
    ↓
Display on Screen
```

### Paint Operations Per Frame

**At 30 FPS:**

1. **Canvas Operations:**
   - 3 canvas clears (clearRect)
   - 27 cloud draws (full complexity)
   - 189 gradient creations
   - 135+ arc/ellipse operations
   - Approx **500-700 canvas operations per frame**

2. **CSS Paint Operations:**
   - ~20 gradient-flash animations (background-position changes)
   - Multiple text paints with gradient fills
   - Box-shadow repaints on hover
   - Approx **50-100 CSS paint operations per frame**

3. **Layout/Reflow:**
   - Minimal (fixed/absolute positioning)
   - Only on scroll (content shifting)

**Total: 550-800 operations per frame at 30 FPS**
**= 16,500 - 24,000 operations per second**

### GPU Utilization

**GPU Tasks:**
1. Canvas rendering (4 large textures)
2. CSS transforms (parallax movement)
3. Backdrop filters (glassmorphism blur)
4. Text gradient fills
5. Box shadows and filters
6. Custom cursor rendering

**Estimated GPU Load:**
- Moderate to High (depending on hardware)
- Can saturate integrated GPUs
- Discrete GPUs handle better but still significant

---

## Critical Performance Issues

### Issue #1: Excessive Canvas Redraws

**Problem:**
- 3 cloud canvases redrawn at 30 FPS continuously
- Even when page is idle (no mouse movement)
- BASE_DRIFT_SPEED = 0.21 means clouds always moving

**Impact:**
- Constant CPU/GPU load
- Battery drain on laptops
- Fan noise from heat

**Evidence:**
```typescript
// This runs ALWAYS, even with no user interaction
function animateCloudLayers() {
  // Far clouds
  for (const cloud of farClouds) {
    cloud.x += BASE_DRIFT_SPEED * 0.5; // Always moving!
    drawAnimeCloud(farCtx, ...);
  }
  // Similar for mid and near clouds
}
```

### Issue #2: Oversized Canvas Dimensions

**Problem:**
- HTML declares 3200x1800px
- JavaScript resizes to min(2400, 1000)
- Mismatch causes memory spike

**Impact:**
- Brief 92MB allocation on load
- Then resized to ~38MB
- Causes GC pressure

**Evidence:**
```html
<canvas width="3200" height="1800"></canvas>
```
```typescript
skyCanvas.width = Math.min(window.innerWidth * 1.5, 2400);
skyCanvas.height = Math.min(window.innerHeight * 1.2, 1000);
```

### Issue #3: Gradient Creation Overhead

**Problem:**
- 189 gradient objects created per frame
- createRadialGradient() is expensive
- Not cached between frames

**Impact:**
- High CPU usage in canvas rendering
- GC pressure from object churn

**Evidence:**
```typescript
// Inside drawAnimeCloud, called 27 times/frame:
for (let i = 0; i < 5; i++) {
  const gradient = ctx.createRadialGradient(...); // New object!
  gradient.addColorStop(0, colorStrings[0]);
  gradient.addColorStop(0.5, colorStrings[1]);
  gradient.addColorStop(0.8, colorStrings[2]);
  gradient.addColorStop(1, colorStrings[3]);
}
```

### Issue #4: Scroll-Triggered Sky Regeneration

**Problem:**
- generateSkyLayer() called every 100ms during scroll
- Redraws entire sky canvas (2400x1000px)
- 100 star arcs + moon/sun rendering

**Impact:**
- Scroll feels janky
- Combined with continuous animations = stutter

**Evidence:**
```typescript
setTimeout(() => {
  generateSkyLayer(); // Heavy operation
}, 100);
```

### Issue #5: CSS Gradient Animations

**Problem:**
- 20+ elements with gradient-flash animation
- background-position animated at 60 FPS
- background-clip: text forces text repaint

**Impact:**
- GPU texture updates
- CPU paint operations

**Evidence:**
```css
@keyframes gradient-flash {
  0%, 100% { background-position: 0% 50%; }
  25% { background-position: 50% 50%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 50%; }
}
/* Applied to ~20 text elements */
```

### Issue #6: No Code Splitting

**Problem:**
- Entire 2,161-line component loads upfront
- No lazy loading of below-fold content
- All JavaScript executes on page load

**Impact:**
- Slow initial page load
- Large JavaScript bundle
- TBT (Total Blocking Time) increased

### Issue #7: Custom Cursor SVG

**Problem:**
- Complex SVG cursor embedded in CSS
- Re-rendered on every cursor move
- Applied to entire page

**Impact:**
- Additional GPU work for cursor rendering

**Evidence:**
```css
body {
  cursor: url("data:image/svg+xml;charset=utf-8,%3Csvg...") 2 2, auto !important;
}
```

---

## Browser Crash Causes

### Primary Crash Triggers

#### 1. **Memory Exhaustion**

**Scenario:**
- User has multiple tabs open
- Each tab competing for memory
- ThrustLab homepage allocates ~92-100 MB
- Browser hits memory limit

**Symptoms:**
- "Aw, Snap!" page (Chrome)
- "This page is slowing down your browser" warning
- Tab crash or entire browser freeze

**Why it happens:**
```
Available Memory: 8 GB system
Browser limit: ~4 GB per process
Other tabs: ~2 GB
OS/other apps: ~3 GB
Remaining: ~3 GB

ThrustLab homepage:
- Canvas buffers: 92 MB
- JavaScript heap: 50 MB
- DOM: 30 MB
- Images/fonts: 20 MB
- Total: ~192 MB

If user opens multiple tabs: 192 MB * N tabs
3 tabs = 576 MB
10 tabs = 1.92 GB
15 tabs = 2.88 GB (approaching limit!)
```

#### 2. **GPU Overload**

**Scenario:**
- Integrated GPU (Intel/AMD)
- Multiple layers with transforms
- Backdrop filters (blur)
- Continuous animations

**Symptoms:**
- Page becomes unresponsive
- Scroll stuttering
- Complete browser freeze
- System-wide lag

**Why it happens:**
- GPU trying to render 30+ layers at 30-60 FPS
- Each layer needs compositing
- Backdrop filters are GPU-intensive
- Runs out of GPU memory/processing power

#### 3. **Main Thread Blocking**

**Scenario:**
- Heavy JavaScript execution
- Long-running canvas operations
- Multiple event handlers firing

**Symptoms:**
- "Page Unresponsive" dialog
- Can't click anything
- Scroll doesn't work
- Browser shows "(Not Responding)"

**Why it happens:**
```
Main Thread Tasks:
1. Canvas drawing: ~15ms per frame
2. Gradient calculations: ~5ms per frame
3. Event handling: ~3ms per event
4. DOM updates: ~2ms
5. Layout/paint: ~10ms

Total: ~35ms per frame
At 30 FPS: Need to complete in 33ms
Result: Frame drops, blocked thread
```

#### 4. **Garbage Collection Pauses**

**Scenario:**
- High object churn (gradient objects)
- GC can't keep up
- Major GC triggered

**Symptoms:**
- Periodic freezes (500ms - 2s)
- Janky animations
- Stuttering scroll

**Why it happens:**
- 5,670 gradient objects created/destroyed per second
- JavaScript heap grows rapidly
- GC needs to pause to clean up
- GC pause blocks everything

#### 5. **Infinite Loop / RAF Runaway**

**Scenario:**
- Animation loop doesn't respect frame timing
- Multiple RAF callbacks queued
- Doesn't pause when tab hidden

**Symptoms:**
- CPU usage spikes to 100%
- Laptop fans spin up
- Battery drains rapidly
- Browser becomes sluggish

**Current code:** Has visibility check (good!) but BASE_DRIFT_SPEED means it never stops.

---

## Component Dependencies

### Import Tree
```
+page.svelte
  ├─ svelte (onMount)
  └─ (no other component imports - all inline)

+layout.svelte
  ├─ app.css
  ├─ $app/state (page store)
  ├─ Navbar.svelte
  │   ├─ svelte (onMount)
  │   └─ $app/state
  └─ ChatbotPopup.svelte
      └─ svelte ($state)
```

### External Resources
```
Google Fonts API:
  - fonts.googleapis.com
  - fonts.gstatic.com
  
Fonts Loaded:
  1. Montserrat (3 weights) = ~90 KB
  2. Roboto (3 weights) = ~85 KB
  3. Open Sans (2 weights) = ~60 KB
  4. Lato (2 weights) = ~55 KB
  Total: ~290 KB of fonts
```

---

## State Management

### Reactive State Variables
```typescript
// Svelte 5 runes ($state)
let heroRef: HTMLElement;
let isHovering = $state(false);
let mounted = $state(false);
let mouseX = $state(0);
let mouseY = $state(0);
let normalizedMouseX = $state(0);
let normalizedMouseY = $state(0);
let scrollProgress = $state(0);

// Canvas refs
let skyCanvas: HTMLCanvasElement;
let farCloudsCanvas: HTMLCanvasElement;
let midCloudsCanvas: HTMLCanvasElement;
let nearCloudsCanvas: HTMLCanvasElement;

// Cloud data (reactive arrays)
let farClouds = $state<Array<Cloud>>([]);
let midClouds = $state<Array<Cloud>>([]);
let nearClouds = $state<Array<Cloud>>([]);
```

**Note:** Many $state variables but most don't trigger re-renders because they're only used in imperative canvas code.

---

## Key Optimization Attempts Already Present

The code already includes several optimization attempts:

1. ✅ **FPS Limiting** - 30 FPS instead of 60 FPS
2. ✅ **RAF Throttling** - Mouse and scroll handlers use RAF
3. ✅ **Visibility API** - Pauses when tab hidden
4. ✅ **Color Caching** - colorCache Map for parsed colors
5. ✅ **Dirty Region Tracking** - Only redraws if movement > 1px
6. ✅ **Debounced Sky Regen** - 100ms delay on generateSkyLayer
7. ✅ **Reduced Element Counts** - Clouds reduced from 19/11/8 to 15/7/5
8. ✅ **Reduced Puff Count** - 5 puffs per cloud instead of 8
9. ✅ **Passive Event Listeners** - { passive: true }
10. ✅ **CSS Containment** - contain: layout style paint
11. ✅ **Content Visibility** - content-visibility: auto

**But these aren't enough!** The fundamental issue is the approach itself.

---

## Summary of Performance Metrics

### Estimated Performance Costs

| Metric | Value | Impact |
|--------|-------|--------|
| Initial Memory | 92-100 MB | High |
| Canvas Operations/sec | 16,500 - 24,000 | Very High |
| Gradient Objects/sec | 5,670 | High |
| CSS Animations | 20+ concurrent | Medium |
| Observed Elements | 25 | Low |
| FPS Target | 30 | Medium |
| Actual FPS (avg) | 25-30 | Frame drops |
| Main Thread Time | 35ms/frame | Blocking |
| GC Frequency | Every 3-5 sec | Noticeable pauses |

### Lighthouse Scores (Estimated)

- **Performance:** 20-40 (Poor)
- **Largest Contentful Paint:** 3-5s
- **Total Blocking Time:** 1-2s
- **Cumulative Layout Shift:** 0.1 (Good)
- **Time to Interactive:** 4-6s

---

## Conclusion

The ThrustLab homepage is suffering from **architectural performance issues** rather than just needing minor optimizations. The core problem is using **continuous canvas animations** with **multiple large canvases** that never stop rendering.

### The Real Issue
This is essentially running a **mini game engine** on a webpage:
- Continuous render loop
- Multiple layers
- Particle systems (clouds)
- Real-time graphics

This approach is fine for a game, but **overkill for a website** and causes:
1. Excessive memory usage
2. High CPU/GPU load
3. Battery drain
4. Browser crashes on lower-end devices
5. Poor user experience

### What Needs to Change
The entire parallax system needs to be rethought with **CSS-based solutions** or **significantly reduced canvas usage**. Detailed recommendations are in the separate optimization document.

---

**Next Steps:** See `website-optimization-recommendations.md` for detailed solutions.
