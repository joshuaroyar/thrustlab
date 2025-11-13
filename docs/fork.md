# Contributing to ThrustLab

Thank you for your interest in contributing to ThrustLab! This guide will help you get started with forking the repository and making contributions.

## Table of Contents

- [Getting Started](#getting-started)
- [Fork and Clone](#fork-and-clone)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Common Tasks](#common-tasks)
- [Reporting Issues](#reporting-issues)

## Getting Started

Before contributing, please:

1. **Read the documentation** - Familiarize yourself with the project structure and existing features
2. **Check existing issues** - See if someone else is already working on what you want to do
3. **Open a discussion** - For major changes, open an issue first to discuss your ideas

## Fork and Clone

### 1. Fork the Repository

1. Navigate to the [ThrustLab repository](https://github.com/joshee2004/thrustlab)
2. Click the **Fork** button in the top-right corner
3. Select your account as the destination for the fork

### 2. Clone Your Fork

```bash
# Clone your fork to your local machine
git clone https://github.com/YOUR_USERNAME/thrustlab.git

# Navigate into the project directory
cd thrustlab

# Add the original repository as an upstream remote
git remote add upstream https://github.com/joshee2004/thrustlab.git
```

### 3. Keep Your Fork Synced

Before starting new work, sync your fork with the upstream repository:

```bash
# Fetch the latest changes from upstream
git fetch upstream

# Merge upstream changes into your local main branch
git checkout main
git merge upstream/main

# Push the updates to your fork
git push origin main
```

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**, **pnpm**, or **yarn**
- **Docker** (for local database)
- **Git**

### Installation

1. **Install dependencies:**

```bash
npm install
# or
pnpm install
# or
yarn install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"
```

3. **Start the database:**

```bash
npm run db:start
```

This will start a PostgreSQL database using Docker Compose.

4. **Push database schema:**

```bash
npm run db:push
```

5. **Start the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Making Changes

### 1. Create a New Branch

Always create a new branch for your changes:

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `style/` - UI/styling changes

### 2. Make Your Changes

- Write clear, concise commit messages
- Follow the existing code style and conventions
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new parallax effect to dashboard page"
```

Commit message conventions:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Submitting a Pull Request

### 1. Create the Pull Request

1. Go to your fork on GitHub
2. Click **Compare & pull request**
3. Select the base repository: `joshee2004/thrustlab`
4. Select the base branch: `main`
5. Ensure your branch is selected as the compare branch

### 2. Fill Out the PR Template

Provide a clear description of your changes:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's code style
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings or errors
```

### 3. Wait for Review

- Maintainers will review your PR
- Address any requested changes
- Be patient and responsive to feedback

### 4. After Approval

Once approved, your PR will be merged into the main branch. Congratulations! 🎉

## Code Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Follow existing code patterns
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Prefer **functional programming** patterns where appropriate

### Svelte

- Use **Svelte 5 runes** (`$state`, `$derived`, `$effect`)
- Keep components **small and focused**
- Use **semantic HTML**
- Follow **accessibility best practices**

### CSS

- Use **Tailwind CSS** for styling where possible
- Keep custom CSS **scoped to components**
- Use **CSS variables** for theming
- Follow **mobile-first** responsive design

### General Guidelines

- **DRY** (Don't Repeat Yourself) - Extract reusable logic
- **KISS** (Keep It Simple, Stupid) - Avoid over-engineering
- **YAGNI** (You Aren't Gonna Need It) - Don't add unused features
- Write **self-documenting code** with clear naming
- Add **comments for complex logic** only

## Project Structure

```
thrustlab/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── navbar/
│   │   │   └── ui/
│   │   ├── server/          # Server-side code
│   │   │   ├── auth.ts      # Authentication logic
│   │   │   └── db/          # Database configuration
│   │   │       ├── index.ts
│   │   │       └── schema.ts
│   │   └── assets/          # Static assets (images, etc.)
│   ├── routes/              # SvelteKit routes
│   │   ├── +layout.svelte   # Global layout
│   │   ├── +page.svelte     # Home page
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── ...
│   ├── app.html             # HTML template
│   ├── app.css              # Global styles
│   └── hooks.server.ts      # Server hooks
├── static/                  # Static files served as-is
├── docs/                    # Documentation
├── compose.yaml             # Docker Compose config
├── drizzle.config.ts        # Drizzle ORM config
├── svelte.config.js         # Svelte configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Database Setup

### Working with Drizzle ORM

ThrustLab uses **Drizzle ORM** with PostgreSQL.

#### Available Commands

```bash
# Start PostgreSQL in Docker
npm run db:start

# Push schema changes to the database
npm run db:push

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

#### Making Schema Changes

1. Edit `/src/lib/server/db/schema.ts`
2. Generate a migration: `npm run db:generate`
3. Apply the migration: `npm run db:migrate`
4. Or push directly (for development): `npm run db:push`

#### Example: Adding a New Table

```typescript
// src/lib/server/db/schema.ts
export const newTable = pgTable('new_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export type NewTable = typeof newTable.$inferSelect;
```

## Common Tasks

### Adding a New Route

1. Create a new directory in `src/routes/`
2. Add a `+page.svelte` file
3. Optionally add `+page.ts` for data loading
4. Update navigation in `src/lib/components/navbar/Navbar.svelte`

### Creating a New Component

1. Create a new file in `src/lib/components/`
2. Export the component
3. Import and use in your routes

Example:

```svelte
<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  interface Props {
    label: string;
    onClick?: () => void;
  }
  
  let { label, onClick }: Props = $props();
</script>

<button onclick={onClick} class="btn">
  {label}
</button>

<style>
  .btn {
    /* styles */
  }
</style>
```

### Running Tests

```bash
# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Reporting Issues

### Bug Reports

When reporting a bug, include:

1. **Clear title** - Summarize the issue
2. **Description** - What happened vs. what should happen
3. **Steps to reproduce** - How to trigger the bug
4. **Environment** - OS, browser, Node version
5. **Screenshots** - If applicable
6. **Error messages** - Console logs or errors

### Feature Requests

When requesting a feature:

1. **Clear title** - Summarize the feature
2. **Use case** - Why is this feature needed?
3. **Proposed solution** - How should it work?
4. **Alternatives** - Other approaches considered
5. **Mockups** - Visual examples if applicable

## Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/$state)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [3D Parallax Implementation Guide](./3d-parallax-implementation.md)

## Questions?

If you have questions:

- Open an issue with the `question` label
- Check existing documentation in the `/docs` folder
- Reach out to the maintainers

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive community

## License

By contributing to ThrustLab, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to ThrustLab! 🚀**
