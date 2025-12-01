# Search Functionality Documentation

## Overview

A comprehensive search system has been implemented across all module theory pages in the hangar-zone and turbofan-engine sections. This allows users to quickly find specific concepts, components, or sections across all learning content.

## Architecture

### Components

1. **Search Store** (`src/lib/stores/searchStore.ts`)
   - Centralized state management for search functionality
   - Handles search queries, results, and modal visibility
   - Provides utility functions for searching and highlighting

2. **Search Modal** (`src/lib/components/SearchModal.svelte`)
   - Displays search results in an overlay modal
   - Shows highlighted matching terms
   - Allows navigation to matched content
   - Responsive design for mobile and desktop

3. **Content Index** (`src/lib/data/searchContent.ts`)
   - Searchable content from all modules
   - Structured data with titles, content, URLs, modules, and sections
   - Currently includes:
     - Module 01: History of Gas Turbine Engines (6 entries)
     - Module 02: Types of Gas Turbine Engines (8 entries)
     - Module 03: Turbofan Components (11 entries)

### Integration Points

Search functionality is integrated into:
- `/hangar-zone/module/history` - History module with 4 pages
- `/hangar-zone/module/types` - Types module with 4 pages
- `/turbofan-engine` - Turbofan engine overview and sections

## How It Works

### Search Flow

1. **User Input**: User types query into search input field
2. **Trigger Search**: User presses Enter or clicks search button
3. **Search Execution**: `performSearch()` function processes query
4. **Relevance Scoring**: Each result is scored based on:
   - Exact phrase match: +100 points
   - Individual word matches: +10 points each
   - Title match bonus: +50 points
   - Content at start bonus: +50 points
5. **Display Results**: Modal opens showing sorted results (up to 20)
6. **Navigation**: Clicking a result navigates to that page and closes modal

### Relevance Algorithm

```typescript
function calculateMatchScore(item: SearchResult, query: string): number {
	const lowerQuery = query.toLowerCase();
	const lowerTitle = item.title.toLowerCase();
	const lowerContent = item.content.toLowerCase();
	let score = 0;

	// Exact match in title or content
	if (lowerTitle.includes(lowerQuery)) score += 100;
	if (lowerContent.includes(lowerQuery)) score += 100;

	// Word-by-word matching
	const words = lowerQuery.split(' ');
	words.forEach(word => {
		if (lowerTitle.includes(word)) score += 10;
		if (lowerContent.includes(word)) score += 10;
	});

	// Bonus for matches at the start
	if (lowerTitle.startsWith(lowerQuery)) score += 50;
	if (lowerContent.startsWith(lowerQuery)) score += 50;

	return score;
}
```

### Highlighting

Matched terms are highlighted in yellow (`#fef3c7` background) in both titles and content snippets:

```html
<mark style="background: #fef3c7; color: #92400e;">matched term</mark>
```

## Store API

### State Variables

```typescript
// User's search query
export const searchQuery = writable('');

// Array of search results
export const searchResults = writable<SearchResult[]>([]);

// Loading state
export const isSearching = writable(false);

// Modal visibility
export const showSearchModal = writable(false);
```

### Functions

```typescript
// Perform search across content
performSearch(query: string, content: SearchResult[]): void

// Highlight matched terms in text
highlightText(text: string, query: string): string

// Calculate relevance score
calculateMatchScore(item: SearchResult, query: string): number
```

## SearchResult Interface

```typescript
interface SearchResult {
	title: string;          // Section/topic title
	content: string;        // Full text content
	url: string;           // Navigation URL
	module: string;        // Module identifier
	section: string;       // Section name
	matchScore: number;    // Relevance score
}
```

## Usage Example

### In a Page Component

```svelte
<script lang="ts">
	import { searchQuery, showSearchModal, performSearch } from '$lib/stores/searchStore';
	import { MODULE_CONTENT } from '$lib/data/searchContent';
	import SearchModal from '$lib/components/SearchModal.svelte';

	function handleSearch() {
		if ($searchQuery.trim()) {
			performSearch($searchQuery, MODULE_CONTENT);
			showSearchModal.set(true);
		}
	}
</script>

<SearchModal />

<input 
	bind:value={$searchQuery}
	onkeydown={(e) => e.key === 'Enter' && handleSearch()}
/>
<button onclick={handleSearch}>Search</button>
```

## Content Index Structure

Each entry in `MODULE_CONTENT` follows this format:

```typescript
{
	title: 'Air Inlet Function',
	content: 'Air inlet directs air engine compressor minimum loss energy...',
	url: '/turbofan-engine?section=air-inlet',
	module: 'Module 03: Turbofan Components',
	section: 'Air Inlet',
	matchScore: 0  // Calculated during search
}
```

## Styling

### Search Input Container
- Glass morphism design with backdrop blur
- Cyan accent border (`#00CED1`)
- Focus glow effect
- Responsive width

### Search Modal
- Fixed position overlay with dark backdrop (70% opacity)
- Centered modal with max-width 800px
- Max-height 85vh with scrollable content
- Shadow and rounded corners
- Mobile-responsive with 95% width on small screens

### Result Items
- Card-based design with hover effects
- Module badge in top-right corner
- Section name in blue
- Truncated content preview (200 characters)
- Full-width clickable area

## Keyboard Support

- **Enter**: Execute search from input field
- **Escape**: Close modal (handled via click outside)
- **Click outside modal**: Close modal

## Mobile Optimization

- Search input expands to full width on mobile
- Modal adjusts to 95% width on screens < 768px
- Reduced padding and font sizes on mobile
- Stack layout for result header on mobile

## Performance Considerations

1. **Result Limiting**: Maximum 20 results displayed
2. **Content Truncation**: Preview limited to 200 characters
3. **Efficient Scoring**: Simple string operations, no complex regex
4. **Lazy Modal**: Modal component only renders when visible

## Future Enhancements

### Potential Improvements
1. **Fuzzy Search**: Typo tolerance using Levenshtein distance
2. **Search History**: Store recent searches in localStorage
3. **Advanced Filters**: Filter by module, section, or content type
4. **Autocomplete**: Suggest queries as user types
5. **Search Analytics**: Track popular searches
6. **PDF/Image Text**: OCR content from technical diagrams
7. **Synonyms**: Map technical terms to common language

### Content Expansion
- Add more detailed content from module pages
- Include image alt text in search
- Add glossary terms
- Include question bank content

## Accessibility

- ARIA labels on search buttons
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Screen reader friendly result announcements

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires modern browser with ES6+ support for:
- Template literals
- Arrow functions
- Spread operator
- Array methods (filter, sort, map)

## Troubleshooting

### Search Returns No Results
- Check if `MODULE_CONTENT` is properly imported
- Verify content exists for the module being searched
- Ensure search query matches content (case-insensitive)

### Modal Doesn't Open
- Verify `showSearchModal.set(true)` is called
- Check if `SearchModal` component is imported and rendered
- Look for JavaScript errors in console

### Highlighting Doesn't Work
- Ensure `highlightText()` is called with correct parameters
- Verify `{@html ...}` is used for rendering highlighted content
- Check CSS for `.result-content mark` styles

### Navigation Issues
- Verify URLs in `MODULE_CONTENT` are correct
- Check if pages exist at specified URLs
- Ensure `goto()` from `$app/navigation` is working

## Code Locations

```
src/
├── lib/
│   ├── components/
│   │   └── SearchModal.svelte          # Search results modal
│   ├── data/
│   │   └── searchContent.ts            # Content index
│   └── stores/
│       └── searchStore.ts              # Search state & logic
└── routes/
    ├── hangar-zone/
    │   └── module/
    │       ├── history/+page.svelte    # Integrated
    │       └── types/+page.svelte      # Integrated
    └── turbofan-engine/
        └── +page.svelte                # Integrated
```

## Maintenance

### Adding New Content

1. Open `src/lib/data/searchContent.ts`
2. Add new entry to `MODULE_CONTENT` array:
```typescript
{
	title: 'Your Section Title',
	content: 'Full searchable text content...',
	url: '/your-page?section=your-section',
	module: 'Module XX: Name',
	section: 'Section Name',
	matchScore: 0
}
```
3. Test search functionality with new content

### Updating Existing Content

1. Find entry in `MODULE_CONTENT` by URL or title
2. Update `content`, `title`, or other fields
3. Verify search results reflect changes

### Modifying Search Algorithm

1. Edit `calculateMatchScore()` in `src/lib/stores/searchStore.ts`
2. Adjust scoring weights as needed
3. Test with various queries to ensure quality results
