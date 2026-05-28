# Implementation Plan: Exam Q&As

## Phase 1: Logic & Utilities
1. Create a utility function `src/utils/examExtractor.ts`.
   - Iterate through all months and days in `walkthroughData`.
   - Identify entries with `type: "info"` and titles/content matching "Lesson", "Question:", or "Exam".
   - Return a structured array of `ExamEntry` objects: `{ date: string, question: string, answer: string, category: string }`.

## Phase 2: Components
1. Create `src/components/molecules/ExamCard.tsx`.
   - A compact card showing the date and the Q&A pair.
   - Use a distinctive "School" aesthetic (e.g., a paper clip icon or notebook lines).
2. Create `src/pages/ExamsPage.tsx`.
   - Use the extractor utility to get the data.
   - Render a searchable list of questions.

## Phase 3: Navigation Integration
1. Update `src/components/molecules/NavTabs.tsx` to include the **Exams** tab.
2. Update `App.tsx` to handle the `'exams'` view.

## Phase 4: Verification
1. Confirm that questions from April (e.g., "1 B.C.", "Beta") appear correctly.
2. Verify the search functionality on the Exams page.
3. Ensure no regression in other views.
4. Final lint and type check.