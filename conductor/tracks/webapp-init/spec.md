# Specification: Init Web App

## 1. Objective
Initialize the React 19 web application for the P4G Walkthrough project, complete with Vite, TypeScript, Tailwind CSS v4, and the Atomic Design directory structure.

## 2. Requirements
- Create the app in the `webapp/` directory.
- Use `npm create vite@latest webapp -- --template react-ts`.
- Install Tailwind CSS v4 (`tailwindcss@latest @tailwindcss/vite@latest`).
- Configure `vite.config.ts` with the Tailwind Vite plugin.
- Create standard Atomic Design directories (`src/components/{atoms,molecules,organisms,templates}`, `src/pages`, `src/hooks`, `src/types`, `src/utils`).
- Create initial placeholder components to prove the Tailwind v4 and Atomic Design setup works.
- Define basic P4G theme CSS variables in `index.css`.

## 3. Success Criteria
- Running `npm run dev` in `webapp/` successfully starts the Vite server.
- Tailwind v4 classes apply correctly to components.
- The directory structure is fully established and clean of default Vite boilerplate.