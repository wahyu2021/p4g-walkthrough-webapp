import { useProgress } from '../../hooks/useProgress';
import type { Book } from '../../types/collections';

interface BookRowProps {
  book: Book;
}

export function BookRow({ book }: BookRowProps) {
  const { isBookCompleted, toggleBook } = useProgress();
  const completed = isBookCompleted(book.book);

  return (
    <div 
      className={`border-b border-[#2a2d42] last:border-b-0 transition-all duration-300 ${completed ? 'bg-[#1a1c29]/50 opacity-60' : 'bg-[#1a1c29] hover:bg-[#202336]'}`}
    >
      <label className="flex items-center p-4 cursor-pointer">
        <div className="flex-shrink-0 mr-4 relative">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleBook(book.book)}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-sm transition-all duration-300 flex items-center justify-center
            ${completed ? 'bg-blue-500 border-blue-500 text-black' : 'border-gray-600 bg-[#0b0d17] group-hover:border-blue-500'}`}
          >
            {completed && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`text-base font-bold ${completed ? 'line-through text-gray-400' : 'text-white'}`}>
              {book.book}
            </h4>
            {book.series !== 'N/A' && (
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-sm">
                {book.series}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center">
              <span className="text-gray-500 w-20">Obtained:</span>
              <span className="text-gray-300">{book.obtained} {book.cost !== 'N/A' && `(${book.cost})`}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end text-right ml-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Chapters</span>
            <span className="text-sm font-bold text-gray-300 px-2 py-0.5 bg-[#0b0d17] border border-[#2a2d42] rounded-sm">
              {book.chapters}
            </span>
          </div>
          <span className={`text-[11px] font-bold mt-1 ${completed ? 'text-gray-500' : 'text-blue-400'}`}>
            + {book.effect}
          </span>
        </div>
      </label>
    </div>
  );
}
