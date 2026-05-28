# Tech Stack

## Frameworks & Libraries
- **React 19**: Latest React version using hooks and functional components.
- **Vite**: Ultra-fast build tool and development server.
- **TypeScript**: For type safety and better developer experience.
- **Tailwind CSS v4**: Latest utility-first CSS framework (configured via `@tailwindcss/vite`).
- **Lucide React** (Optional): For standard icons.

## State & Data Management
- **Local Storage API**: For persisting user progress (checked days).
- **React Context / Custom Hooks**: `useProgress` to read/write from `localStorage`.
- **Static JSON**: Data loaded directly from `data/walkthrough.json` as static assets.

## Architecture
- **Atomic Design Methodology**: Organizing React components into Atoms, Molecules, Organisms, Templates, and Pages for high maintainability.