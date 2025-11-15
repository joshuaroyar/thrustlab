Based on the analysis, the single most critical fix is to completely replace the 4-layer HTML5 canvas system used for the parallax background.

This one architectural change will solve the memory exhaustion and GPU overload that is slowing down and crashing the browser, all without changing the homepage's visual appearance.

🚨 The Core Problem
Your homepage is currently acting like a mini game engine.

It loads four separate, oversized canvases (up to 3200x1800px each), which immediately reserve ~92-100 MB of memory.

It continuously redraws three of these canvases at 30 frames per second, even when the user is doing nothing.

This results in 16,500 to 24,000 canvas operations every second, which overwhelms the CPU and GPU, causing jank, slowness, and crashes.

✅ The Solution (Keeping the Same UI)
You can achieve the exact same visual effect by removing the canvases and using modern, hardware-accelerated CSS instead.

Replace the Sky Canvas: Use a standard CSS linear-gradient for the sky. The color changes during scroll can be handled by updating CSS variables, and you can use a CSS transition to make the color change smooth.

Replace the Cloud Canvases: Instead of drawing 27 clouds 30 times a second, create them once as static elements. You can use SVG images or CSS-only <div>s styled to look like clouds.

Replace the Canvas Animation: Animate the cloud <div>s using a simple CSS @keyframes animation that changes the transform: translateX() property. This is hardware-accelerated and thousands of times more efficient than redrawing a canvas.

This single change directly addresses the performance bottlenecks. The recommendation document estimates this will lead to an 85-90% performance improvement, reduce memory usage by over 75%, and completely eliminate the crashes.