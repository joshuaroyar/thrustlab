# Instructions for Overhaul Tab - Assembly Disassembly Webpage

This is an interactive webpage that tests the user's knowledge about the components of a turbofan engine. The user is presented with just the casing of the turbofan engine on the main canvas, and below it contain the shuffled components. The user must drag them to the correct positions on the casing model. The webpage provides immediate feedback on the correctness of each placement and tracks the user's score. The goal is to correctly place all components with the highest score possible.

Task 1: Match the 3d components to their respective positions on the turbofan engine model. The models are provided in models/ folder.

Constant - Casing.glb (Shown on main canvas)

Components to be placed (shuffled):
1 - Intake Section.glb
2 - Compressor Section.glb
3 - Combustion Section.glb
4 - Turbine Section.glb
5 - Exhaust Section.glb

The blank canvas should have designated drop zones for each component, clearly marked but not labeled. The user should be able to drag and drop each component from the shuffled list to the corresponding drop zone on the turbofan engine casing.

Please put the components in the following order from left to right when placed correctly:
1. Intake Section
2. Compressor Section
3. Combustion Section
4. Turbine Section
5. Exhaust Section

Task 2: Provide immediate feedback on the correctness of each placement. If the user places a component correctly, highlight it in green and increase the score by 10 points. If placed incorrectly, highlight it in red and decrease the score by 5 points.

Task 3: Track the user's score and display it prominently on the webpage. The score should start at 0 and update in real-time as the user places components.

Task 4: Once all components are placed correctly, provide a congratulatory message along with the final score to the user.

Task 5: Include a "Reset" button that allows the user to restart the game at any time, resetting the score and shuffling the components again.

# Alternative Implementation: Since the first one isn't working as intended, try this alternative implementation.

Let the main canvas be a blender screen of the turbofan engine casing model with drop zones for each component. Below the main canvas, have a horizontal row of boxes that house each of the shuffled components. The user can drag and drop the components from these boxes onto the main canvas. The rest of the functionality remains the same as described above.

Ensure the component parts aren't labeled on the main canvas, only the drop zones are marked. The user must rely on their knowledge to place the components correctly.