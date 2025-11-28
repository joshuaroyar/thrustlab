# Instructions for Gemini 3 Pro / Claude: Replacing Static Images with 3D Turbofan Models

## Overview
This document provides step-by-step instructions for Gemini 3 Pro or Claude to replace static images of turbofans with interactive 3D models. The 3D models are stored in the static folder, and the ModelViewer Svelte component is already implemented and available for use.

## Key Requirements
- Replace each static turbofan image with its corresponding 3D model.
- Scale the 3D model to match the exact size (dimensions) of the original image.
- Ensure the model viewer is lazy-loaded to optimize performance.
- Model paths are located in the static folder (e.g., `/static/models/turbofan-model.glb` or similar).

## Split into Smaller Manageable Tasks

### Task 1: Identify Static Turbofan Images
- Scan the codebase for all `<img>` tags or static image references that display turbofan images.
- List out the file paths, alt texts, and dimensions of these images.
- Ensure only turbofan-related images are targeted (ignore other images).

### Task 2: Locate Corresponding 3D Model Files
- For each identified turbofan image, find the matching 3D model file in the static folder.
- Assume naming conventions like `turbofan-model.glb` or similar; if not found, note discrepancies.
- Verify that the model files exist and are accessible.

### Task 3: Replace Image Tags with Model Viewer
- For each static image, replace the `<img>` tag with the pre-implemented model viewer component.
- Example replacement:
  - From: `<img src="path/to/turbofan.jpg" alt="Turbofan" width="400" height="300">`
  - To: `<model-viewer src="/static/models/turbofan-model.glb" alt="Turbofan 3D Model" style="width: 400px; height: 300px;" loading="lazy"></model-viewer>`
- Use the model viewer component's attributes to set the source to the 3D model path.

### Task 4: Scale the Model to Match Image Size
- Extract the width and height from the original image tag.
- Apply these dimensions directly to the model viewer component via inline styles (e.g., `style="width: 400px; height: 300px;"`).
- Ensure the model scales proportionally to fit within these dimensions without distortion.

### Task 5: Implement Lazy Loading
- Add the `loading="lazy"` attribute to each model viewer component to enable lazy loading.
- This ensures models load only when they enter the viewport, improving page performance.

### Task 6: Test and Validate
- After replacements, verify that each 3D model displays correctly in place of the original image.
- Check that scaling matches the original image size.
- Confirm lazy loading works by testing page load times and viewport interactions.
- Handle any errors, such as missing models, by falling back to the original image or logging issues.

# Note: These changes happen in the Turbofan Engine Page, Engine Sections Tab
