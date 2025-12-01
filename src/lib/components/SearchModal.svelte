<script lang="ts">
	import { searchQuery, searchResults, isSearching, showSearchModal } from '$lib/stores/searchStore';
	import { highlightText } from '$lib/stores/searchStore';
	import { goto } from '$app/navigation';

	function handleResultClick(url: string) {
		showSearchModal.set(false);
		searchQuery.set('');
		goto(url);
	}

	function handleClose() {
		showSearchModal.set(false);
		searchQuery.set('');
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if $showSearchModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" on:click={handleBackdropClick}>
		<div class="search-modal">
			<div class="modal-header">
				<h2>Search Results</h2>
				<button class="close-btn" on:click={handleClose}>×</button>
			</div>

			<div class="modal-content">
				{#if $isSearching}
					<div class="loading">Searching...</div>
				{:else if $searchResults.length === 0}
					<div class="no-results">
						<p>No results found for "{$searchQuery}"</p>
						<p class="hint">Try different keywords or check your spelling</p>
					</div>
				{:else}
					<div class="results-count">
						Found {$searchResults.length} result{$searchResults.length === 1 ? '' : 's'}
					</div>
					<div class="results-list">
						{#each $searchResults as result}
							<button class="result-item" on:click={() => handleResultClick(result.url)}>
								<div class="result-header">
									<h3 class="result-title">{@html highlightText(result.title, $searchQuery)}</h3>
									<span class="result-module">{result.module}</span>
								</div>
								{#if result.section}
									<div class="result-section">{result.section}</div>
								{/if}
								<div class="result-content">
									{@html highlightText(result.content.slice(0, 200), $searchQuery)}...
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 9999;
		padding-top: 5vh;
		overflow-y: auto;
	}

	.search-modal {
		background: white;
		border-radius: 12px;
		width: 90%;
		max-width: 800px;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		margin-bottom: 5vh;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #111827;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: #f3f4f6;
		color: #111827;
	}

	.modal-content {
		padding: 1.5rem 2rem;
		overflow-y: auto;
		flex: 1;
	}

	.loading,
	.no-results {
		text-align: center;
		padding: 3rem 2rem;
		color: #6b7280;
	}

	.no-results p {
		margin: 0.5rem 0;
	}

	.no-results .hint {
		font-size: 0.875rem;
		color: #9ca3af;
	}

	.results-count {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result-item {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		width: 100%;
	}

	.result-item:hover {
		background: #f3f4f6;
		border-color: #3b82f6;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.result-title {
		margin: 0;
		font-size: 1.125rem;
		color: #111827;
		font-weight: 600;
	}

	.result-module {
		font-size: 0.75rem;
		color: #6b7280;
		background: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.result-section {
		font-size: 0.875rem;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.result-content {
		font-size: 0.875rem;
		color: #4b5563;
		line-height: 1.6;
	}

	.result-content :global(mark) {
		background: #fef3c7;
		color: #92400e;
		padding: 0.1rem 0.2rem;
		border-radius: 2px;
	}

	.result-title :global(mark) {
		background: #fef3c7;
		color: #92400e;
		padding: 0.1rem 0.2rem;
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		.modal-backdrop {
			padding-top: 2vh;
		}

		.search-modal {
			width: 95%;
			max-height: 90vh;
		}

		.modal-header {
			padding: 1rem 1.25rem;
		}

		.modal-header h2 {
			font-size: 1.25rem;
		}

		.modal-content {
			padding: 1rem 1.25rem;
		}

		.result-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.result-module {
			align-self: flex-start;
		}
	}
</style>
