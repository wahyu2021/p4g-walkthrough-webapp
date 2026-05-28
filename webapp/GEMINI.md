# P4G Walkthrough Web App Guidelines

This document outlines the core rules and architectural guidelines for developing the React frontend in the `webapp/` directory. You MUST strictly adhere to these instructions.

## 1. Atomic Design System
We strictly follow the Atomic Design methodology for our component structure. Never place a component in the root `components/` folder; categorize it properly.
- **Atoms (`src/components/atoms/`)**: Basic building blocks (e.g., `Button`, `Checkbox`, `Typography`, `Badge`).
- **Molecules (`src/components/molecules/`)**: Groups of atoms functioning together (e.g., `EventEntry`, `MonthTab`).
- **Organisms (`src/components/organisms/`)**: Complex components forming distinct sections (e.g., `DayCard`, `Header`, `MonthSelector`).
- **Templates (`src/components/templates/`)**: Page-level objects that articulate the structure.
- **Pages (`src/pages/`)**: Specific instances of templates populated with real data.

## 2. Clean Code Principles
- **Separation of Concerns**: Logic (state, hooks) should be separated from presentation. Use custom hooks (`src/hooks/`) to encapsulate business logic (e.g., `useProgress.ts`).
- **Type Safety**: Strictly use TypeScript. Define interfaces and types for all data structures (e.g., `WalkthroughMonth`, `Day`, `Entry`) in a dedicated `src/types/` folder. Do not use `any`.
- **DRY (Don't Repeat Yourself)**: Extract repeating UI patterns into molecules or atoms.
- **Descriptive Naming**: Use clear, descriptive names for variables, functions, and components (e.g., `handleToggleDay` instead of `toggle`).

## 3. Styling Guidelines (Tailwind CSS v4)
- **CSS Variables**: We use Tailwind v4. Standard CSS variables define the P4G color palette in `src/index.css`:
  ```css
  @theme {
    --color-p4-yellow: #F5D100;
    --color-p4-black: #111111;
    --color-p4-gray: #333333;
  }
  ```
- Use utility classes over custom CSS files whenever possible.
- Use utilities like `clsx` or `tailwind-merge` if dealing with complex, dynamic, or conflicting classes.

## 4. P4G Visual Aesthetics
- **High Contrast**: Emphasize stark contrasts (Yellow vs Black).
- **Stylization**: Use `clip-path: polygon(...)` instead of `transform: skewX` for tall cards to prevent content clipping and layout overlap.
- **Backgrounds**: Use TV static patterns or subtle gray patterns for backgrounds to fit the theme.

## 5. UI Interactions
- **Horizontal Scroll**: For horizontal containers (like Month Selector), implement a mouse wheel listener to translate vertical scroll to horizontal scroll on desktop.
- **Sticky Elements**: Use `sticky` headers for dates on long cards to maintain user context.

## 6. Development Workflow
- When modifying state or local storage logic, ensure the updates are immutable and use Global Context for synchronized state across components.
- Always add types for props in React functional components using `import type`.