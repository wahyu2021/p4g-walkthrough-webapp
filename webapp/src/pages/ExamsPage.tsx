import { useMemo, useState, useEffect } from 'react';
import { extractExams } from '../utils/examExtractor';
import type { ExamEntry } from '../utils/examExtractor';
import { ExamCard } from '../components/molecules/ExamCard';
import { SearchInput } from '../components/atoms/SearchInput';

export function ExamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allExams, setAllExams] = useState<ExamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    extractExams().then(data => {
      setAllExams(data);
      setIsLoading(false);
    });
  }, []);

  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) return allExams;
    const query = searchQuery.toLowerCase();
    return allExams.filter(exam => 
      exam.question.toLowerCase().includes(query) || 
      exam.answer.toLowerCase().includes(query) ||
      exam.date.includes(query)
    );
  }, [allExams, searchQuery]);

  if (isLoading) {
    return <div className="text-p4-yellow p-6 font-bold uppercase animate-pulse">Loading Exams...</div>;
  }

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-p4-black border-l-8 border-p4-yellow p-6 relative overflow-hidden">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter relative z-10">
          Academic <span className="text-p4-yellow">Q&As</span>
        </h2>
        <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest relative z-10">
          All lesson questions and exam answers collected in one place.
        </p>
      </div>

      <div className="px-0">
        <SearchInput 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search questions or answers..." 
        />
      </div>

      {filteredExams.length === 0 ? (
        <div className="bg-p4-black/50 border-2 border-dashed border-p4-gray p-12 text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest">No matching questions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam, idx) => (
            <ExamCard key={`${exam.date}-${idx}`} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
