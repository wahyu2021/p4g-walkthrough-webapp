import type { ExamEntry } from '../../utils/examExtractor';

interface ExamCardProps {
  exam: ExamEntry;
}

export function ExamCard({ exam }: ExamCardProps) {
  const isExam = exam.category === 'Exam';

  return (
    <div 
      className={`relative p-6 transition-all border-2 ${
        isExam 
          ? 'bg-[#2a1a2a] border-red-900/50 shadow-[4px_4px_0px_0px_#7f1d1d]' 
          : 'bg-[#2a2a2a] border-p4-black shadow-[4px_4px_0px_0px_#111111]'
      }`}
      style={{ clipPath: 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-0.5 text-[10px] font-black uppercase tracking-widest ${
          isExam ? 'bg-red-600 text-white' : 'bg-p4-yellow text-p4-black'
        }`}>
          {exam.category}
        </div>
        <span className="text-p4-yellow font-black italic text-lg tracking-tighter">
          {exam.date}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Question</span>
          <p className="text-white font-bold leading-snug tracking-tight">
            {exam.question}
          </p>
        </div>

        <div className="bg-p4-black/40 p-4 border-l-4 border-p4-yellow">
          <span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Correct Answer</span>
          <p className="text-p4-yellow font-black italic uppercase tracking-wider">
            {exam.answer}
          </p>
        </div>
      </div>

      {/* Decorative notebook element */}
      <div className="absolute top-4 right-4 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/><path d="M10 18h4"/><path d="M10 14h4"/><path d="M10 10h1"/></svg>
      </div>
    </div>
  );
}
