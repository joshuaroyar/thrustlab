<script lang="ts">
	import AssemblyActivity from '$lib/components/AssemblyActivity.svelte';
	import SkyBackground from '$lib/components/SkyBackground.svelte';
</script>

<div class="activity-wrapper">
    <!-- Sky Background -->
    <SkyBackground day={true} />

    <!-- Header Section -->
    <div class="header-section">
        <!-- Speech Bubble Box -->
        <div class="speech-bubble">
            <p class="speech-text">
                <span class="speech-label">JAJA:</span> Yey! You've mastered the fundamentals of the turbofan engine!
                Now it's time to put that knowledge into action.
            </p>
        </div>
        
        <!-- Character Image -->
        <div class="character-container">
            <img src="/images/jaja-standing.png" alt="Jaja Character" class="character-image" />
        </div>
    </div>

    <!-- Main Activity Card -->
    <div class="activity-card">
        
        <!-- Title -->
        <h1 class="activity-title">
            Assembly and Disassembly <br/> Activity
        </h1>

        <!-- Instructions -->
        <p class="activity-instructions">
            <span class="instruction-label">Instruction:</span>
			Drag and drop each component of the turbofan engine to its correct position inside the casing. Pay attention to the order and orientation — each part has its special place in the engine!
        </p>

		<!-- Assembly Activity Component -->
		// <AssemblyActivity />

    </div>
</div>

<style>
    /* Wrapper */
    .activity-wrapper {
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Header Section */
    .header-section {
        position: relative;
        max-width: 64rem; /* max-w-5xl */
        width: 100%;
        margin: 2rem auto;
        display: flex;
        justify-content: flex-end;
    }

    /* Speech Bubble */
    .speech-bubble {
        background: rgba(10, 47, 53, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--ui-yellow);
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 10;
        margin-right: 8rem; /* Space for character */
        max-width: 600px;
    }

    .speech-text {
        font-family: var(--font-body);
        font-size: 1.125rem; /* text-lg */
        color: var(--font-secondary);
        font-weight: 500;
        line-height: 1.6;
    }

    .speech-label {
        font-family: var(--font-heading);
        font-weight: 800;
        color: var(--ui-yellow);
    }

    /* Character */
    .character-container {
        position: absolute;
        right: -1rem;
        top: -1rem;
        z-index: 20;
        width: 10rem; /* w-40 */
        height: 12rem; /* h-48 */
    }

    .character-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
    }

    /* Main Activity Card */
    .activity-card {
        width: 100%;
        max-width: 72rem; /* max-w-6xl */
        background: rgba(10, 47, 53, 0.6);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-radius: 2rem;
        padding: 2rem;
        border: 2px solid rgba(135, 206, 235, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 0;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Title */
    .activity-title {
        font-family: var(--font-heading);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 900;
        text-align: center;
        margin-bottom: 1.5rem;
        background: linear-gradient(
            90deg,
            var(--ui-yellow) 0%,
            var(--font-accent-cyan) 20%,
            var(--ui-light-blue) 40%,
            var(--font-accent-yellow) 60%,
            var(--ui-yellow) 80%,
            var(--font-accent-cyan) 100%
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-flash 4s ease-in-out infinite;
        filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5));
    }

    @keyframes gradient-flash {
		0%, 100% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 50% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		75% {
			background-position: 50% 50%;
		}
	}

    /* Instructions */
    .activity-instructions {
        text-align: center;
        color: var(--font-secondary);
        max-width: 56rem; /* max-w-4xl */
        margin-bottom: 1rem;
        font-size: 1.125rem; /* text-lg */
        line-height: 1.625;
        font-family: var(--font-body);
    }

    .instruction-label {
        font-weight: 700;
        color: var(--font-accent-yellow);
    }
</style>
