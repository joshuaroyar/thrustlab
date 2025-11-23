# 3D Turbofan Engine Viewer Implementation

## Overview
This document describes the implementation of the interactive 3D turbofan engine viewer using Babylon.js.

## Implementation Summary

### ✅ Completed Features

1. **Interactive 3D Model Viewer Component** (`src/lib/components/ModelViewer.svelte`)
   - Reusable Svelte component that can be used throughout the application
   - Dynamically loads Babylon.js modules to optimize initial page load
   - Loads and displays the `static/models/Turbofan.glb` 3D model

2. **Camera Controls**
   - **Mouse Controls:**
     - Left-click + drag: Rotate the model
     - Scroll wheel/pinch: Zoom in/out
     - Right-click + drag or middle mouse: Pan
   - **Keyboard Controls:**
     - W/A/S/D keys: Rotate the view
   - Configurable camera position and limits

3. **Part Highlighting & Tooltips**
   - Hover over engine parts to highlight them with a cyan glow
   - Displays tooltips with part name and description
   - Configurable part descriptions via props
   - Can be toggled on/off with the Labels button

4. **Responsive Design**
   - Works across different devices and screen sizes
   - Touch-enabled for mobile/tablet devices
   - Efficient rendering and resource management

5. **User Flow Implementation**
   - Main page (`/turbofan-engine`): Click on "3D Engine" overview container
   - Instructions page (`/turbofan-engine/engine-instructions`): Shows usage instructions
   - Fullscreen viewer (`/turbofan-engine/engine-fullscreen`): Interactive 3D model
   - All pages maintain the existing evening sky background aesthetic

6. **Additional Features**
   - Loading spinner while model loads
   - Reset view button to return to default camera position
   - Toggle labels on/off
   - Exit fullscreen button
   - Keyboard shortcut (ESC) to navigate back
   - Control instructions overlay

## Files Created/Modified

### New Files
1. `/src/lib/components/ModelViewer.svelte` - Reusable 3D viewer component

### Modified Files
1. `/src/routes/turbofan-engine/engine-fullscreen/+page.svelte` - Added 3D model viewer
2. `/src/lib/index.ts` - Exported ModelViewer component

## Component Usage

### Basic Usage
```svelte
<script>
  import ModelViewer from '$lib/components/ModelViewer.svelte';
</script>

<ModelViewer 
  modelPath="/models/Turbofan.glb"
  canvasClass="my-canvas"
/>
```

### Advanced Usage with All Props
```svelte
<script>
  import ModelViewer from '$lib/components/ModelViewer.svelte';

  const partDescriptions = {
    'Fan': {
      name: 'Fan',
      description: 'Large rotating blades that draw air into the engine.'
    },
    'Compressor': {
      name: 'Compressor',
      description: 'Increases the pressure of incoming air.'
    }
    // ... more parts
  };

  function handleModelLoaded() {
    console.log('Model loaded successfully!');
  }
</script>

<ModelViewer 
  modelPath="/models/Turbofan.glb"
  canvasClass="fullscreen-canvas"
  cameraPosition={{ alpha: Math.PI / 2, beta: Math.PI / 3, radius: 8 }}
  enableHighlight={true}
  partDescriptions={partDescriptions}
  onModelLoaded={handleModelLoaded}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelPath` | string | **required** | Path to the .glb model file |
| `canvasClass` | string | `'model-canvas'` | CSS class for the canvas element |
| `cameraPosition` | object | `{ alpha: π/2, beta: π/3, radius: 5 }` | Initial camera position (spherical coords) |
| `enableHighlight` | boolean | `true` | Enable hover highlighting and tooltips |
| `partDescriptions` | object | `{}` | Map of mesh names to descriptions |
| `onModelLoaded` | function | `undefined` | Callback when model finishes loading |

## Dependencies

The following Babylon.js packages are already installed:
- `@babylonjs/core@8.38.0` - Core Babylon.js engine
- `@babylonjs/loaders@8.38.0` - Model loaders (including GLB/GLTF)

## User Journey

1. **Main Page**: User sees the turbofan engine page with an overview section
2. **Click Overview**: User clicks on the "3D Turbofan Engine Model" container
3. **Instructions Page**: User sees instructions on how to interact with the 3D model
4. **Click to Continue**: User clicks anywhere to proceed to fullscreen view
5. **Fullscreen Viewer**: User can now interact with the 3D model:
   - Rotate, zoom, and pan the model
   - Hover over parts to see tooltips (if labels enabled)
   - Reset view to default position
   - Toggle labels on/off
   - Exit fullscreen to return to main page

## Performance Optimizations

1. **Lazy Loading**: Babylon.js modules are dynamically imported only when needed
2. **Efficient Rendering**: Uses Babylon.js's optimized render loop
3. **Resource Cleanup**: Properly disposes of engine and scene on component unmount
4. **Responsive Canvas**: Automatically resizes with window
5. **Model Optimization**: The GLB format is already compressed and efficient

## Customization

### Adding More Part Descriptions

To add descriptions for engine parts, update the `partDescriptions` object in the fullscreen page:

```typescript
const partDescriptions = {
  'MeshNameInGLB': {
    name: 'User-Friendly Name',
    description: 'Detailed description of this part'
  }
};
```

Note: The mesh name must match exactly with the name in the GLB file.

### Changing Camera Behavior

Modify the camera properties in the ModelViewer component:
- `camera.lowerRadiusLimit` - Minimum zoom distance
- `camera.upperRadiusLimit` - Maximum zoom distance
- `camera.wheelPrecision` - Zoom sensitivity
- `camera.panningSensibility` - Pan sensitivity

### Styling

The component includes default styling but can be customized via CSS:
- `.model-viewer-container` - Main container
- `.model-canvas` - Canvas element (or your custom class)
- `.model-tooltip` - Tooltip styling
- `.controls-info` - Controls overlay

## Browser Compatibility

The 3D viewer works on:
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Supports WebGL 2.0 (falls back to WebGL 1.0 if needed)

## Future Enhancements

Potential improvements for future iterations:
1. Add audio explanations for each part (as mentioned in instructions)
2. Implement exploded view mode
3. Add animation/rotation controls
4. Cross-section view
5. Performance metrics display
6. Screenshot/share functionality
7. VR/AR support
8. Multiple viewing modes (wireframe, x-ray, etc.)

## Troubleshooting

### Model not loading
- Verify the model file exists at `/static/models/Turbofan.glb`
- Check browser console for errors
- Ensure WebGL is supported in the browser

### Performance issues
- The model is 26MB, which is reasonable for a detailed 3D model
- Consider reducing model complexity if needed
- Ensure hardware acceleration is enabled in the browser

### Highlighting not working
- Verify mesh names in the GLB file match the partDescriptions keys
- Check that `enableHighlight` prop is true
- Open browser console to see if there are any errors

## Support

For questions or issues with the 3D viewer implementation, please refer to:
- Babylon.js documentation: https://doc.babylonjs.com/
- Svelte documentation: https://svelte.dev/docs
