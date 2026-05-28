# P4G Walkthrough: Product Guidelines

## 1. Atomic Design System
We strictly follow the Atomic Design methodology for our component structure:
- **Atoms (`src/components/atoms/`)**: Basic building blocks that can't be broken down further. (e.g., `Button`, `Checkbox`, `Typography`, `Badge`).
- **Molecules (`src/components/molecules/`)**: Groups of atoms functioning together as a unit. (e.g., `EventEntry`, `MonthTab`).
- **Organisms (`src/components/organisms/`)**: Complex components forming distinct sections of an interface. (e.g., `DayCard`, `Header`, `MonthSelector`).
- **Templates (`src/components/templates/`)**: Page-level objects that articulate the design's underlying content structure. (e.g., `WalkthroughLayout`).
- **Pages (`src/pages/`)**: Specific instances of templates populated with real data. (e.g., `WalkthroughPage`).

## 2. Clean Code Principles
- **Separation of Concerns**: Logic (state, hooks) should be separated from presentation. Use custom hooks (`useProgress.ts`) to encapsulate business logic.
- **Type Safety**: Define interfaces for all data structures (e.g., `WalkthroughMonth`, `Day`, `Entry`) in a dedicated `src/types/` folder.
- **DRY (Don't Repeat Yourself)**: Extract repeating UI patterns into molecules or atoms.
- **Descriptive Naming**: Use clear and descriptive names for variables, functions, and components.

## 3. Styling Guidelines (Tailwind v4)
- **CSS Variables in Tailwind v4**: Tailwind v4 uses standard CSS variables. We will define the P4G color palette in `index.css`:
  ```css
  @theme {
    --color-p4-yellow: #F5D100;
    --color-p4-black: #111111;
    --color-p4-gray: #333333;
  }
  ```
- Keep class strings clean. Extract complex responsive classes using `clsx` or `tailwind-merge` if necessary.

## 4. P4G Visual Aesthetics
- Emphasize stark contrasts (Yellow vs Black).
- Use slight rotations or asymmetrical borders to mimic the game's UI.
- Use TV static patterns or subtle gray patterns for backgrounds.