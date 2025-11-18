# ThrustLab - Complete Codebase Documentation

**Project Name:** ThrustLab  
**Version:** 0.0.1  
**Type:** Educational Web Application for Turbofan Engine Learning  
**Repository:** thrustlab (Owner: blueberry8787)  
**Current Branch:** main  
**Last Updated:** November 16, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [Key Features](#key-features)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [UI Components](#ui-components)
9. [Routes & Pages](#routes--pages)
10. [Development Setup](#development-setup)
11. [Scripts & Commands](#scripts--commands)
12. [Configuration Files](#configuration-files)

---

## 🎯 Project Overview

**ThrustLab** is a modern, interactive educational web platform designed to teach users about turbofan engines through immersive 3D visualizations, interactive modules, and comprehensive learning materials. The application features:

- **Educational Zones**: Hangar Zone, Test Bay, Turbofan Engine, Overhaul Station
- **3D Visualizations**: Interactive turbofan engine models using Three.js
- **Dynamic UI**: Scroll-based parallax sky backgrounds with procedurally generated clouds
- **User Management**: Complete authentication system with session management
- **Responsive Design**: Mobile-first approach with glassmorphism effects

**Target Audience**: Engineering students, aviation enthusiasts, and professionals learning about gas turbine engines.

---

## 🛠 Technology Stack

### **Frontend Framework**
- **SvelteKit 2.47.1** - Full-stack meta-framework with SSR
- **Svelte 5.41.0** - Component framework with new runes API (`$state`, `$derived`, `$effect`)
- **TypeScript 5.9.3** - Type-safe development

### **Styling**
- **Tailwind CSS 4.1.14** - Utility-first CSS framework with JIT compilation
- **@tailwindcss/vite 4.1.14** - Vite plugin for Tailwind integration
- Custom CSS variables for theming

### **3D Graphics**
- **Three.js 0.181.1** - 3D library for turbofan engine visualizations
- **@types/three 0.181.0** - TypeScript definitions

### **Backend & Database**
- **PostgreSQL** - Relational database (Docker containerized)
- **Drizzle ORM 0.44.6** - TypeScript ORM with type-safe queries
- **Drizzle Kit 0.31.5** - Database migration and schema management

### **Authentication**
- **Oslo Crypto** - Cryptographic utilities (@oslojs/crypto, @oslojs/encoding)
- Session-based authentication with token hashing (SHA-256)
- Cookie-based session management

### **Build Tools**
- **Vite 7.1.10** - Fast build tool and dev server
- **ESBuild 0.27.0** - JavaScript bundler
- **Prettier 3.6.2** - Code formatter
- **ESLint 9.38.0** - Linting tool

### **Deployment**
- **Vercel Adapter** (@sveltejs/adapter-vercel 6.0.0) - Deployment to Vercel

### **Development Tools**
- **Docker Compose** - Container orchestration for PostgreSQL
- **svelte-check** - Type checking for Svelte components
- **typescript-eslint** - TypeScript linting rules

---

## 📁 Project Structure

```
thrustlab/
├── src/                          # Source code
│   ├── app.css                   # Global styles & CSS variables
│   ├── app.d.ts                  # TypeScript declarations
│   ├── app.html                  # HTML template
│   ├── hooks.server.ts           # Server-side hooks for auth
│   │
│   ├── lib/                      # Reusable libraries
│   │   ├── index.ts              # Library exports
│   │   ├── assets/               # Static assets (images, icons, etc.)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── chatbot/          # Chatbot popup component
│   │   │   │   └── ChatbotPopup.svelte
│   │   │   ├── navbar/           # Navigation bar
│   │   │   │   └── Navbar.svelte
│   │   │   └── ui/               # UI utility components
│   │   │       ├── AnimatedBackground.svelte
│   │   │       ├── AnimatedPageWrapper.svelte
│   │   │       ├── CustomCursor.svelte
│   │   │       ├── PageLoader.svelte
│   │   │       ├── ParallaxBackground.svelte
│   │   │       ├── ParticleEffect.svelte
│   │   │       └── SkyParallax.svelte
│   │   │
│   │   └── server/               # Server-side code
│   │       ├── auth.ts           # Authentication logic
│   │       └── db/               # Database configuration
│   │           ├── index.ts      # DB connection
│   │           └── schema.ts     # Drizzle schema definitions
│   │
│   └── routes/                   # SvelteKit file-based routing
│       ├── +error.svelte         # Error page
│       ├── +layout.server.ts     # Layout server load
│       ├── +layout.svelte        # Root layout component
│       ├── +page.svelte          # Home page (landing)
│       │
│       ├── dashboard/            # User dashboard
│       │   └── +page.svelte
│       │
│       ├── hangar-zone/          # Hangar zone learning module
│       │   ├── +layout.svelte
│       │   ├── +page.svelte
│       │   └── module/           # Sub-modules
│       │
│       ├── jaja/                 # Test/experimental page
│       │   └── +page.svelte
│       │
│       ├── login/                # Login page
│       │   ├── +page.server.ts   # Login actions
│       │   └── +page.svelte
│       │
│       ├── overhaul-station/     # Overhaul station module
│       │   └── +page.svelte
│       │
│       ├── profile/              # User profile page
│       │   └── +page.svelte
│       │
│       ├── sign-up/              # Registration page
│       │   └── +page.svelte
│       │
│       ├── test-bay/             # Test bay module
│       │   └── +page.svelte
│       │
│       └── turbofan-engine/      # Main turbofan learning zone
│           ├── +page.svelte
│           ├── engine-fullscreen/    # Fullscreen 3D view
│           ├── engine-instructions/  # Interactive instructions
│           └── module/               # Learning modules
│
├── static/                       # Static files (served as-is)
│   ├── robots.txt
│   ├── icons/                    # App icons
│   ├── images/                   # Images by category
│   │   ├── hangar-zone/
│   │   │   ├── history/
│   │   │   └── types/
│   │   ├── overhaul-preliminary/
│   │   ├── turbofan-module3/
│   │   └── turbofan-more-info/
│   └── models/                   # 3D models (Three.js)
│
├── docs/                         # Documentation
│   ├── main md files/            # Primary documentation
│   │   ├── hangar-zone/
│   │   ├── home/
│   │   ├── overhaul-tab/
│   │   ├── test-bay/
│   │   ├── turbofan-3d/
│   │   ├── turbofan-engine/
│   │   └── ui/
│   └── oth md files/             # Other documentation
│       └── speed-optimizatioin/
│
├── compose.yaml                  # Docker Compose config
├── drizzle.config.ts             # Drizzle ORM configuration
├── eslint.config.js              # ESLint configuration
├── package.json                  # Dependencies & scripts
├── README.md                     # Project README
├── svelte.config.js              # SvelteKit configuration
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite configuration
```

---

## 🏗 Core Architecture

### **1. SvelteKit Framework Structure**

ThrustLab uses SvelteKit's file-based routing and server-side rendering:

```typescript
// File-based routing examples:
src/routes/+page.svelte              → /
src/routes/dashboard/+page.svelte    → /dashboard
src/routes/login/+page.svelte        → /login
src/routes/turbofan-engine/+page.svelte → /turbofan-engine
```

### **2. Server-Side Hooks (Authentication Flow)**

**File:** `src/hooks.server.ts`

```typescript
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    const mockAuth = event.cookies.get('mock-auth');
    
    // Mock authentication for testing (bypasses database)
    if (mockAuth === 'true') {
        event.locals.user = MOCK_USER;
        event.locals.session = MOCK_SESSION;
        return resolve(event);
    }
    
    // Real authentication
    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }
    
    const { session, user } = await auth.validateSessionToken(sessionToken);
    
    if (session) {
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } else {
        auth.deleteSessionTokenCookie(event);
    }
    
    event.locals.user = user;
    event.locals.session = session;
    return resolve(event);
};
```

**Key Points:**
- Runs on **every request** before page load
- Validates session tokens from cookies
- Injects `user` and `session` into `event.locals` for access in pages
- Supports mock authentication for development

### **3. Svelte 5 Runes (State Management)**

ThrustLab uses Svelte 5's new runes API for reactive state:

```typescript
// $state - Reactive state
let mouseX = $state(0);
let mounted = $state(false);

// $derived - Computed values
let isHomePage = $derived(page.url.pathname === '/');

// $effect - Side effects
$effect(() => {
    console.log('Mouse position:', mouseX, mouseY);
});
```

**Benefits:**
- More explicit and predictable than Svelte 4's implicit reactivity
- Better TypeScript support
- Easier to debug

### **4. Layout System**

**Root Layout:** `src/routes/+layout.svelte`

```svelte
<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/navbar/Navbar.svelte';
    import ChatbotPopup from '$lib/components/chatbot/ChatbotPopup.svelte';
    
    let { children, data } = $props();
    let isHomePage = $derived(page.url.pathname === '/');
</script>

<Navbar user={data.user} isTransparent={isHomePage} />

{@render children()}

{#if !isJajaPage}
    <ChatbotPopup />
{/if}
```

**Features:**
- Global navigation bar with dynamic transparency
- Chatbot popup (hidden on specific pages)
- Scroll-triggered animations with IntersectionObserver
- Google Fonts preloading

---

## ⭐ Key Features

### **1. Dynamic 3D Parallax Sky Background**

**Component:** `src/lib/components/ui/SkyParallax.svelte`

**How It Works:**
- **4 Canvas Layers**: Sky, Far Clouds, Mid Clouds, Near Clouds
- **Procedural Generation**: Clouds are drawn using canvas blur filters and organic shapes
- **Parallax Effect**: Each layer moves at different speeds based on mouse position
- **Continuous Drift**: Clouds slowly move across the screen with wrapping
- **Scroll-Based Transitions**: Sky changes from day → evening → night → midnight

**Code Example:**
```typescript
// Cloud drift animation
function animateCloudLayers() {
    farClouds.forEach(cloud => {
        cloud.x += BASE_DRIFT_SPEED * 0.3;
        if (cloud.x > canvasWidth + cloud.w) {
            cloud.x = -cloud.w;
        }
    });
    drawClouds(farCloudsCanvas, farClouds);
}

// Mouse parallax
const parallaxX = (mouseX / window.innerWidth - 0.5) * 30;
const parallaxY = (mouseY / window.innerHeight - 0.5) * 30;
```

**Sky Transitions:**
```typescript
// scrollProgress: 0 = day, 0.25 = evening, 0.5 = night, 1 = midnight
if (progress < 0.25) {
    // Day: Light blue sky with sun
    gradient.addColorStop(0, '#87CEEB');
} else if (progress < 0.5) {
    // Evening: Orange/pink sunset
    gradient.addColorStop(0, '#FF6B6B');
} else if (progress < 0.75) {
    // Night: Deep blue with stars
    gradient.addColorStop(0, '#1A2847');
} else {
    // Midnight: Dark navy with moon
    gradient.addColorStop(0, '#0A0E27');
}
```

### **2. Glassmorphism UI Design**

All cards and modals use glassmorphism (frosted glass effect):

```css
/* Example from Navbar */
background: rgba(135, 206, 235, 0.15);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

### **3. Responsive Navigation**

**Component:** `src/lib/components/navbar/Navbar.svelte`

**Features:**
- **Dynamic Background**: Changes color based on scroll progress
- **Transparent Mode**: On homepage, starts transparent
- **Mobile Menu**: Hamburger menu for small screens
- **User Authentication**: Shows login/profile based on session state

```svelte
<nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    style:background-color={navbarBgColor}
    style:backdrop-filter={isTransparent ? 'blur(10px)' : 'blur(20px)'}
>
```

### **4. Scroll-Triggered Animations**

**Implementation:** `src/routes/+layout.svelte`

```typescript
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Classes: .animate-on-scroll, .animate-slide-left, .animate-slide-right
```

**CSS Animations:**
```css
.animate-slide-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.6s ease-out;
}

.animate-slide-left.visible {
    opacity: 1;
    transform: translateX(0);
}
```

### **5. Custom Cursor (Optional)**

**Component:** `src/lib/components/ui/CustomCursor.svelte`

- Follows mouse position
- Scales up on hover over interactive elements
- Smooth animations with CSS transforms

---

## 🗄 Database Schema

**File:** `src/lib/server/db/schema.ts`

### **User Table**
```typescript
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    age: integer('age')
});
```

### **Session Table**
```typescript
export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    expiresAt: timestamp('expires_at', { 
        withTimezone: true, 
        mode: 'date' 
    }).notNull()
});
```

### **Database Connection**

**File:** `src/lib/server/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### **Docker Setup**

**File:** `compose.yaml`

```yaml
services:
  db:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: local
    volumes:
      - pgdata:/var/lib/postgresql
```

**Connection String:**
```env
DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"
```

---

## 🔐 Authentication System

**File:** `src/lib/server/auth.ts`

### **Session Token Generation**

```typescript
export function generateSessionToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(18));
    const token = encodeBase64url(bytes);
    return token;
}
```

### **Create Session**

```typescript
export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + DAY_IN_MS * 30) // 30 days
    };
    await db.insert(table.session).values(session);
    return session;
}
```

### **Validate Session**

```typescript
export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    
    const [result] = await db
        .select({
            user: { id: table.user.id, username: table.user.username },
            session: table.session
        })
        .from(table.session)
        .innerJoin(table.user, eq(table.session.userId, table.user.id))
        .where(eq(table.session.id, sessionId));
    
    if (!result) return { session: null, user: null };
    
    const { session, user } = result;
    
    // Check expiration
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(table.session).where(eq(table.session.id, session.id));
        return { session: null, user: null };
    }
    
    // Auto-renew if < 15 days remaining
    if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
        session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
        await db
            .update(table.session)
            .set({ expiresAt: session.expiresAt })
            .where(eq(table.session.id, session.id));
    }
    
    return { session, user };
}
```

### **Cookie Management**

```typescript
export const sessionCookieName = 'auth-session';

export function setSessionTokenCookie(
    event: RequestEvent, 
    token: string, 
    expiresAt: Date
) {
    event.cookies.set(sessionCookieName, token, {
        expires: expiresAt,
        path: '/'
    });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(sessionCookieName, { path: '/' });
}
```

### **Mock Authentication (Development)**

**File:** `src/routes/login/+page.server.ts`

```typescript
export const actions = {
    mockLogin: async ({ cookies }) => {
        cookies.set('mock-auth', 'true', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30
        });
        throw redirect(303, '/dashboard');
    },
    
    logout: async ({ cookies }) => {
        cookies.delete('mock-auth', { path: '/' });
        throw redirect(303, '/');
    }
};
```

---

## 🧩 UI Components

### **1. Navbar Component**

**File:** `src/lib/components/navbar/Navbar.svelte`

**Props:**
- `user`: User object (null if not logged in)
- `isTransparent`: Boolean for transparent mode

**Features:**
- Scroll-responsive background color
- Mobile hamburger menu
- Conditional rendering based on auth state
- Smooth color transitions during scroll

**Navigation Links:**
```typescript
const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hangar Zone', path: '/hangar-zone' },
    { name: 'Test Bay', path: '/test-bay' },
    { name: 'Turbofan Engine', path: '/turbofan-engine' },
    { name: 'Overhaul Station', path: '/overhaul-station' }
];
```

### **2. SkyParallax Component**

**File:** `src/lib/components/ui/SkyParallax.svelte`

**Props:**
```typescript
interface Props {
    scrollProgress?: number;        // 0 = day, 1 = midnight
    enableMouseParallax?: boolean;  // Enable mouse tracking
    enableDrift?: boolean;          // Enable cloud animation
    staticSky?: boolean;            // Disable scroll transitions
    skyMode?: 'day' | 'evening' | 'night' | 'midnight'; // Fixed mode
}
```

**Usage:**
```svelte
<SkyParallax 
    scrollProgress={0.5} 
    enableDrift={true}
    enableMouseParallax={true}
/>
```

### **3. ChatbotPopup Component**

**File:** `src/lib/components/chatbot/ChatbotPopup.svelte`

- Fixed position chatbot icon (bottom-right)
- Click to expand/collapse chat interface
- Smooth animations

### **4. AnimatedPageWrapper**

**File:** `src/lib/components/ui/AnimatedPageWrapper.svelte`

- Wraps page content with fade-in animations
- Used across all pages for consistent transitions

### **5. PageLoader**

**File:** `src/lib/components/ui/PageLoader.svelte`

- Loading spinner with blur backdrop
- Shown during page transitions

---

## 🌐 Routes & Pages

### **Home Page** (`/`)

**File:** `src/routes/+page.svelte` (1874 lines)

**Features:**
- Full-page 3D parallax sky background
- Hero section with call-to-action
- Feature cards with glassmorphism
- Scroll-based sky transitions (day → night)
- Responsive design

**Structure:**
```svelte
<script>
    // Sky animation logic
    let scrollProgress = $state(0);
    let farClouds = $state([...]);
    let midClouds = $state([...]);
    let nearClouds = $state([...]);
    
    onMount(() => {
        // Initialize canvas layers
        initializeSkies();
        // Start drift animation
        animate();
    });
</script>

<!-- Sky Canvases -->
<div class="fixed inset-0">
    <canvas bind:this={skyCanvas} />
    <canvas bind:this={farCloudsCanvas} />
    <canvas bind:this={midCloudsCanvas} />
    <canvas bind:this={nearCloudsCanvas} />
</div>

<!-- Page Content -->
<section class="hero">
    <h1>Welcome to ThrustLab</h1>
    <p>Learn about turbofan engines</p>
</section>
```

### **Dashboard Page** (`/dashboard`)

**File:** `src/routes/dashboard/+page.svelte` (670 lines)

**Features:**
- User-specific dashboard
- Tab navigation (Dashboard / Profile)
- Sky background (day theme)
- Statistics cards
- Quick access links

**Protected Route:** Requires authentication

### **Turbofan Engine** (`/turbofan-engine`)

**File:** `src/routes/turbofan-engine/+page.svelte` (1828 lines)

**Features:**
- Evening sky theme (orange/pink sunset)
- Tab navigation (Overview / Sections)
- Interactive module cards
- Links to 3D fullscreen viewer
- Learning modules (Module 3, More Info, etc.)

**Sub-routes:**
- `/turbofan-engine/engine-fullscreen` - 3D engine viewer
- `/turbofan-engine/engine-instructions` - Interactive instructions
- `/turbofan-engine/module/*` - Learning modules

### **Hangar Zone** (`/hangar-zone`)

**Features:**
- History of gas turbine engines
- Types of gas turbine engines
- Interactive timeline
- Image galleries

### **Test Bay** (`/test-bay`)

**Features:**
- Engine testing simulations
- Performance metrics
- Data visualization

### **Overhaul Station** (`/overhaul-station`)

**Features:**
- Assembly/Disassembly guides
- Preliminary overhaul information
- Step-by-step instructions

### **Login Page** (`/login`)

**File:** `src/routes/login/+page.server.ts`

**Actions:**
- `mockLogin` - Development login (bypasses database)
- `logout` - Clear session

**Form:**
```svelte
<form method="POST" action="?/mockLogin">
    <button type="submit">Login (Mock)</button>
</form>
```

### **Sign Up Page** (`/sign-up`)

**Features:**
- User registration form
- Password validation
- Terms of service checkbox

### **Profile Page** (`/profile`)

**Features:**
- User information
- Avatar upload
- Settings management

---

## 🚀 Development Setup

### **1. Prerequisites**

- **Node.js** v18+ (for Vite 7)
- **Docker** (for PostgreSQL)
- **npm**, **pnpm**, or **yarn**

### **2. Installation Steps**

```bash
# Clone repository
git clone https://github.com/blueberry8787/thrustlab.git
cd thrustlab

# Install dependencies
npm install

# Set up environment variables
echo 'DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"' > .env

# Start PostgreSQL container
npm run db:start

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### **3. Environment Variables**

Create `.env` file:

```env
DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"
```

### **4. Development Server**

```bash
npm run dev
# Server starts at: http://localhost:5173
```

---

## 📜 Scripts & Commands

**File:** `package.json`

### **Development**
```bash
npm run dev           # Start Vite dev server
npm run dev -- --open # Start and open browser
```

### **Building**
```bash
npm run build         # Build for production
npm run preview       # Preview production build
```

### **Type Checking**
```bash
npm run check         # Run svelte-check
npm run check:watch   # Watch mode
```

### **Code Quality**
```bash
npm run format        # Format with Prettier
npm run lint          # Lint with ESLint
```

### **Database**
```bash
npm run db:start      # Start PostgreSQL (Docker)
npm run db:push       # Push schema to database
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:studio     # Open Drizzle Studio (GUI)
```

### **Utilities**
```bash
npm run prepare       # Sync SvelteKit
```

---

## ⚙️ Configuration Files

### **1. SvelteKit Config**

**File:** `svelte.config.js`

```javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
    preprocess: vitePreprocess(),
    kit: { 
        adapter: adapter() 
    }
};
```

**Key Points:**
- Uses Vercel adapter for deployment
- Preprocesses Svelte files with Vite

### **2. Vite Config**

**File:** `vite.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        fs: {
            allow: ['..'] // Allow parent directory access
        }
    },
    plugins: [tailwindcss(), sveltekit()]
});
```

**Plugins:**
- `tailwindcss()` - Tailwind CSS integration
- `sveltekit()` - SvelteKit plugin

### **3. TypeScript Config**

**File:** `tsconfig.json`

```json
{
    "extends": "./.svelte-kit/tsconfig.json",
    "compilerOptions": {
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    }
}
```

### **4. Drizzle Config**

**File:** `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/server/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: { url: process.env.DATABASE_URL },
    verbose: true,
    strict: true
});
```

### **5. ESLint Config**

**File:** `eslint.config.js`

```javascript
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...svelte.configs['flat/recommended'],
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    }
];
```

### **6. Docker Compose**

**File:** `compose.yaml`

```yaml
services:
  db:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: local
    volumes:
      - pgdata:/var/lib/postgresql
volumes:
  pgdata:
```

---

## 🎨 Theming & Design System

### **CSS Variables**

**File:** `src/app.css`

```css
:root {
    /* Fonts */
    --font-heading: 'Poppins', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-special: 'Concert One', cursive;
    
    /* Background Colors */
    --bg-primary: #223A5E;      /* Deep Blue/Navy */
    --bg-secondary: #D75E2E;    /* Orange */
    --bg-tertiary: #74B3D4;     /* Light Blue */
    --bg-quaternary: #9B8AA4;   /* Purple/Mauve */
    
    /* Font Colors */
    --font-primary: #1E3A5F;    /* Dark Navy Blue */
    --font-secondary: #FFFFFF;  /* White */
    --font-accent-cyan: #00CED1;
    --font-accent-yellow: #FFE66D;
    --font-accent-green: #4CAF50;
    
    /* UI Elements */
    --ui-dark-teal: #0A2F35;
    --ui-slate: #657786;
    --ui-navy: #1C2E3A;
    --ui-deep-navy: #243447;
    --ui-yellow: #FFD966;
}
```

### **Glassmorphism Pattern**

```css
.glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

---

## 📊 Performance Optimizations

**Documentation Reference:** `docs/oth md files/speed-optimizatioin/`

### **1. Image Optimization**
- WebP format for all images
- Lazy loading with `loading="lazy"`
- Responsive images with `srcset`

### **2. Code Splitting**
- Dynamic imports for large components
- Route-based code splitting (automatic with SvelteKit)

### **3. Canvas Optimizations**
- RequestAnimationFrame for smooth animations
- Throttled scroll handlers
- Debounced expensive operations (sky regeneration)

### **4. CSS Optimizations**
- Tailwind JIT for minimal CSS bundle
- CSS variables for theming
- Hardware-accelerated transforms (`transform3d`)

---

## 🔧 Troubleshooting

### **Database Connection Issues**

```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker compose down
docker compose up -d

# Check logs
docker compose logs db
```

### **Type Errors**

```bash
# Regenerate types
npm run prepare

# Check types
npm run check
```

### **Port Already in Use**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

## 📚 Learning Resources

### **Key Concepts to Understand**

1. **SvelteKit Routing**: File-based routing system
2. **Svelte 5 Runes**: New reactive primitives
3. **Server-Side Hooks**: Request interception
4. **Drizzle ORM**: Type-safe database queries
5. **Canvas API**: For 3D parallax backgrounds
6. **Three.js**: 3D rendering (for engine models)

### **Documentation Links**

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte-5-preview.vercel.app/docs/runes)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js](https://threejs.org/docs/)

---

## 🚢 Deployment

### **Vercel Deployment**

```bash
# Build for production
npm run build

# Deploy (requires Vercel CLI)
vercel deploy
```

### **Environment Variables (Production)**

Set in Vercel dashboard:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### **Build Output**

- Adapter: `@sveltejs/adapter-vercel`
- Output: `.vercel/output/`
- Serverless functions for API routes

---

## 📝 Code Style Guidelines

### **Svelte Components**

```svelte
<script lang="ts">
    // 1. Imports
    import { onMount } from 'svelte';
    
    // 2. Props
    let { user, data } = $props();
    
    // 3. State
    let count = $state(0);
    let doubled = $derived(count * 2);
    
    // 4. Lifecycle
    onMount(() => {
        // Init code
    });
    
    // 5. Functions
    function handleClick() {
        count++;
    }
</script>

<!-- 6. Markup -->
<div>
    <button onclick={handleClick}>
        Count: {count}
    </button>
</div>

<!-- 7. Styles -->
<style>
    div {
        padding: 1rem;
    }
</style>
```

### **TypeScript**

- Use `interface` for object types
- Use `type` for unions/intersections
- Always type function parameters and return values

---

## 🎯 Future Enhancements

### **Planned Features**

1. **Real Authentication**: Replace mock auth with production-ready system
2. **Progress Tracking**: Save user progress through modules
3. **Quiz System**: Interactive quizzes after each module
4. **3D Model Interactions**: Click parts of engine for detailed info
5. **Mobile App**: React Native version
6. **Multiplayer**: Collaborative learning sessions
7. **Gamification**: Badges, achievements, leaderboards
8. **AR/VR Support**: View engines in augmented reality

### **Technical Improvements**

1. **Testing**: Add Vitest for unit tests, Playwright for E2E
2. **CI/CD**: GitHub Actions for automated testing/deployment
3. **PWA**: Service worker for offline support
4. **Internationalization**: Multi-language support
5. **Analytics**: Track user engagement
6. **Performance Monitoring**: Sentry or similar

---

## 👥 Contributing

### **Development Workflow**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Review Checklist**

- [ ] TypeScript types are correct
- [ ] Components are responsive
- [ ] No console errors
- [ ] Follows code style guidelines
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile-friendly

---

## 📞 Support & Contact

**Repository:** https://github.com/blueberry8787/thrustlab  
**Owner:** blueberry8787  
**Current Branch:** main

---

## 📄 License

_License information not specified in current codebase_

---

## 🏆 Credits

### **Technologies Used**

- **Framework**: SvelteKit (Svelte 5)
- **Styling**: Tailwind CSS 4
- **3D Graphics**: Three.js
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Oslo Crypto
- **Deployment**: Vercel

### **Design Inspiration**

- Modern glassmorphism UI trends
- Aviation-themed color palettes
- Educational platform best practices

---

**Last Updated:** November 16, 2025  
**Documentation Version:** 1.0  
**Codebase Version:** 0.0.1

---

## 📌 Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run db:start           # Start database
npm run db:push            # Sync database schema
npm run db:studio          # Open database GUI

# Building
npm run build              # Production build
npm run preview            # Preview build

# Code Quality
npm run lint               # Run linter
npm run format             # Format code
npm run check              # Type check

# Database Management
npm run db:generate        # Generate migration
npm run db:migrate         # Run migrations

# Docker
docker compose up -d       # Start services
docker compose down        # Stop services
docker compose logs db     # View database logs
```

---

**End of Documentation**
