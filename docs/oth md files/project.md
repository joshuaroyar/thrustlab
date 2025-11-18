# ThrustLab

ThrustLab is a web-based educational platform that enables students and instructors to engage with 3D engineering models through real-time interactive simulations, guided tutorials, and instant assessments—all directly in the browser.⁠
⁠​
## Features

- Interactive 3D simulation environment enabling real-time component manipulation and assembly analysis
- Comprehensive educational modules featuring detailed Gas Turbine and Turbofan Engine systems
- Integrated assessment system with performance tracking and practice evaluations
- Advanced AI-powered assistant "JAJA" providing expert guidance and technical support

## Tech Stack

- SvelteKit for frontend and backend
- TypeScript for type-safe development
- Tailwind CSS for styling
- PostgreSQL + Drizzle ORM for database
- Lucia for authentication and session management
- Three.js with STLLoader for 3D model visualization
- Gemini API for AI-powered assistant and technical support
- Vercel for deployment

## Design Stack

### Colors

| Purpose          | Color Name       | HEX            |
|------------------|------------------|----------------|
| Primary          | Deep Blue        | #223A5E        |
| Secondary        | Fresh Green      | #38C172        |
| Accent           | Magenta          | #FF3C7E        |
| Accent           | Orange           | #FFA726        |
| Background       | Soft Slate       | #F6F7FA        |
| Contrast Text    | Charcoal Gray    | #222831        |

### Fonts

| Usage Area       | Font        | Type       | Style                   | Example Use Case               |
|------------------|-------------|------------|-------------------------|--------------------------------|
| Heading          | Montserrat  | Sans-serif | Modern, bold, geometric | Page titles, section headers   |
| Body/Text        | Roboto      | Sans-serif | Clean, neutral          | Paragraphs, quizzes, UI labels |
| Alternative body | Open Sans   | Sans-serif | Friendly, versatile     | Mobile, instructions           |
| Data/Table Text  | Lato        | Sans-serif | Sleek, semi-rounded     | Data tables, sidebar info      |

## Website Structure

```
Open Routes:
/ — ThrustLab (Homepage)
/hangar-zone — Hangar Zone (Tutorial on Gas Turbine Engine)
/turbofan-engine — Turbofan Engine (Tutorial on Turbofan Engine)
/overhaul-station — Overhaul Station (3D model viewer on assembly and disassembly)
/jaja — JAJA (AI-powered assistant)
/login — Login
/sign-up — Signup

Protected Routes:
/profile — Profile (Profile page to edit user details)
/test-bay — Test Bay (Assessment page) 
/dashboard — Dashboard (Dashboard page providing user progress, assessment results, and activity insights)
```