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
        const content = entry.content;

        // Check if it's a lesson or exam entry
        if (titleLower.includes('lesson') || titleLower.includes('exam') || content.toLowerCase().includes('question:')) {
          
          if (content.toLowerCase().includes('question:')) {
            // Split content by "Question:" to handle multiple Q&As in one entry
            const parts = content.split(/Question:/i);
            
            parts.forEach((part) => {
              const cleanPart = part.trim();
              if (!cleanPart) return;

              // Extract question and answer from this part
              // We search for the first "Option" marker
              const optionMatch = cleanPart.match(/Option\s+[A-D]:/i);
              
              if (optionMatch && optionMatch.index !== undefined) {
                const question = cleanPart.substring(0, optionMatch.index).trim();
                const answer = cleanPart.substring(optionMatch.index).trim();

                if (question && answer) {
                  exams.push({
                    date: day.date,
                    question: question,
                    answer: answer,
                    category: titleLower.includes('exam') ? 'Exam' : 'Lesson'
                  });
                }
              }
            });
          } else {
            // Handle simple lesson entries that don't have "Question:" label in content
            // but have "Lesson" in title and "UP" in content.
            const simpleQuestion = entry.title.replace(/-/g, '').trim();
            const simpleAnswer = content.trim();
            
            if (simpleQuestion && simpleAnswer) {
               exams.push({
                 date: day.date,
                 question: simpleQuestion,
                 answer: simpleAnswer,
                 category: titleLower.includes('exam') ? 'Exam' : 'Lesson'
               });
            }
          }
        }
      });
    });
  });

  // Filter out duplicates if any (same question on same date)
  const uniqueExams = exams.filter((exam, index, self) =>
    index === self.findIndex((t) => (
      t.date === exam.date && t.question === exam.question
    ))
  );

  return uniqueExams;
};
