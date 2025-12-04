1. Issue - Component descriptions in the website do not match those provided in the Turbofan Engine Google Docs.
Action - Replace all clickable-text descriptions with the ones provided below: (audio output + description).
    1. Air Inlet Duct
    "The air inlet duct directs smooth, uniform air into the compressor, recovering pressure and ensuring the engine receives steady airflow for efficient operation."
    2. Compressor Section
    "The compressor pressurizes incoming air, supplying it to the combustion chamber and providing bleed air for aircraft systems."
    3. Combustion Section
    "The combustion section mixes fuel and compressed air, ignites the mixture, and generates high-energy gases to power the turbine."
    4. Turbine Section
    "The turbine extracts energy from the hot gases to drive the compressor and engine accessories, using blades shaped for maximum efficiency."
    5. Exhaust Section
    "The exhaust section directs hot gases out of the engine, increasing thrust and, in some designs, mixing with bypass air for efficiency."

2. Issue - When selecting components in the 3D turbofan model, a single color highlight is selecting multiple separate parts, instead of treating the whole component as one unified selection.
Actions -
    1. Regroup all 3D meshes so that each major engine component is combined as ONE selectable object.
    2. Update the selection logic so that hovering or clicking highlights the entire component, not individual disconnected pieces.
    3. Ensure hover-highlight and click-highlight match the new grouping structure.

3. Issue - The box and font color do not change upon clicking a component, causing confusion with component colors.
Action - Implement a color-change indicator for selected components to improve clarity.