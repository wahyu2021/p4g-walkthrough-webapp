# Specification: Unified Sidebar Navigation

## 1. Objective
Move the primary navigation tabs from the header to a unified sticky sidebar. This provides a more scalable navigation structure for future feature expansion and improves UX on desktop.

## 2. Requirements
- **Sidebar Consolidation**:
  - The sidebar should now contain the **Main Menu** (Walkthrough, Social Links, Dungeons, Exams).
  - If the active view is "Walkthrough", the **Month Selector** should appear below the Main Menu in the same sidebar.
- **Responsive Behavior**:
  - **Desktop**: A persistent vertical sidebar on the left.
  - **Mobile**: A top section that contains the Main Menu (horizontal scroll) and optionally the Month Selector (horizontal scroll) below it.
- **Visual Structure**:
  - Clear section headers in the sidebar (e.g., "MENU", "TIMELINE").
  - Aesthetic consistency with P4G (Yellow/Black contrast, skewed buttons).
- **Header Clean-up**:
  - The header should now only contain the Logo and the Progress Bar/System controls.

## 3. Success Criteria
- Navigating between views works via sidebar links.
- Sidebar is sticky and scrollable independently if it contains many items.
- Desktop layout uses the vertical space efficiently.
- Mobile layout remains functional and doesn't feel cramped.