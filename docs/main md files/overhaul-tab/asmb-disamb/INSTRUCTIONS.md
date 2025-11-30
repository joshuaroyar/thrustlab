# Instructions for Overhaul Tab - Assembly Disassembly Webpage

Note: Use the following wireframe for reference given in reference.png. Make sureto implement all features as listed in the reference image. You can use any libraries or frameworks of your choice to implement the functionality described below.

This is an interactive webpage that tests the user's knowledge about the components of a turbofan engine. The user is presented with just the casing of the turbofan engine on the main canvas, and below it contain the shuffled components. The user must drag them to the correct positions on the casing model. The webpage provides immediate feedback on the correctness of each placement and tracks the user's score. The goal is to correctly place all components with the highest score possible.

Task 1: Match the 3d components to their respective positions on the turbofan engine model. The models are provided in models/ folder.

Constant - Casing.glb (Shown on main canvas)

Components to be placed (shuffled):
1 - Intake Section.glb
2 - Compressor Section.glb
3 - Combustion Section.glb
4 - Turbine Section.glb
5 - Exhaust Section.glb

Task 2: Provide immediate feedback on the correctness of each placement. If the user places a component correctly, highlight it in green and increase the score by 10 points. If placed incorrectly, highlight it in red and decrease the score by 5 points.

Task 3: Track the user's score and display it prominently on the webpage. The score should start at 0 and update in real-time as the user places components.

Task 4: Once all components are placed correctly, provide a congratulatory message along with the final score to the user.
