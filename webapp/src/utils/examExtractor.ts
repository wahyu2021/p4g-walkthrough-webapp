import { getWalkthroughData } from './dataFetcher';

export interface ExamEntry {
  date: string;
  question: string;
  answer: string;
  category: 'Lesson' | 'Exam';
}

export const extractExams = (): ExamEntry[] => {
  const allData = getWalkthroughData();
  const exams: ExamEntry[] = [];

  allData.forEach((month) => {
    month.days.forEach((day) => {
      day.entries.forEach((entry) => {
        const titleLower = entry.title.toLowerCase();
        const contentLower = entry.content.toLowerCase();

        // Check if it's a lesson or exam entry
        if (titleLower.includes('lesson') || titleLower.includes('exam') || contentLower.includes('question:')) {
          
          // Regex to extract Question and Option/Answer
          // Pattern: Question: ... Option X: "..."
          const questionMatch = entry.content.match(/Question:\s*(.*?)(?=Option|$)/i);
          const optionMatch = entry.content.match(/(Option\s+[A-D]:\s*".*?")/i);

          if (questionMatch || optionMatch) {
            exams.push({
              date: day.date,
              question: questionMatch ? questionMatch[1].trim() : entry.title.replace(/-/g, '').trim(),
              answer: optionMatch ? optionMatch[1].trim() : entry.content.trim(),
              category: titleLower.includes('exam') ? 'Exam' : 'Lesson'
            });
          } else if (titleLower.includes('lesson') && entry.content.includes('UP')) {
            // Handle simple lesson entries like "Knowledge UP"
            exams.push({
              date: day.date,
              question: entry.title.replace(/-/g, '').trim(),
              answer: entry.content.trim(),
              category: 'Lesson'
            });
          }
        }
      });
    });
  });

  return exams;
};
