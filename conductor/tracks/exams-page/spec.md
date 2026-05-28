# Specification: Exam Q&As

## 1. Objective
Extract and display all lesson questions and exam answers in a dedicated page, allowing users to quickly find answers without scrolling through the full walkthrough.

## 2. Requirements
- **Data Extraction**:
  - The current `exams.json` is empty. Instead of re-scraping, we will implement a client-side parser to extract entries from `walkthrough.json` that contain keywords like "Question:", "Lesson", or "-Exam-".
- **Exam Listing Page**:
  - Group questions by month or category (e.g., "Regular Lessons", "Midterms", "Finals").
  - Display the Date, the Question, and the Correct Option/Answer.
- **Search & Filter**:
  - Include a search bar specifically for questions.
- **Aesthetic**:
  - Use a "Notebook" or "Test Paper" inspired P4G style (Yellow/White/Black).
  - High-contrast typography.

## 3. Success Criteria
- A new "Exams" tab appears in the main navigation.
- All questions mentioned in the daily walkthrough are automatically listed on the Exams page.
- Users can search for specific questions.
- The layout is clean and optimized for quick reference.