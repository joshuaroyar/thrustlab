<script>
    const turbineParts = [
        {
            title: 'Inlet',
            description: 'The inlet draws in and directs air into the engine. It ensures smooth airflow and prevents foreign object damage.',
            image: '/images/inlet.jpg' // Add actual image path
        },
        {
            title: 'Fan',
            description: 'Compresses incoming air to high pressure. Usually consists of multiple stages of rotating and stationary blades.',
            image: '/images/compressor.jpg'
        },
        {
            title: 'Combustion Chamber',
            description: 'Where fuel is mixed with compressed air and ignited, creating high-temperature, high-pressure gases.',
            image: '/images/combustor.jpg'
        },
        {
            title: 'Turbine',
            description: 'Extracts energy from the hot gases to drive the compressor. Contains multiple stages of blades that rotate at high speeds.',
            image: '/images/turbine.jpg'
        },
        {
            title: 'Exhaust Nozzle',
            description: 'Accelerates the exhaust gases to create thrust. Shape and size affect engine performance significantly.',
            image: '/images/nozzle.jpg'
        }
    ];
</script>

<div class="container">
    <h1 class="text-2xl">Turbofan Components</h1>
    
    <div class="card-grid">
        {#each turbineParts as part}
            <div class="card">
                <img src={part.image} alt={part.title} />
                <div class="card-content">
                    <h2>{part.title}</h2>
                    <p>{part.description}</p>
                </div>
            </div>
        {/each}
    </div>
</div>