import { useProgress } from '../../hooks/useProgress';
import type { Quest } from '../../types/collections';

interface QuestRowProps {
  quest: Quest;
}

export function QuestRow({ quest }: QuestRowProps) {
  const { isQuestCompleted, toggleQuest } = useProgress();
  const completed = isQuestCompleted(quest.quest);

  return (
    <div 
      className={`border-b border-[#2a2d42] last:border-b-0 transition-all duration-300 ${completed ? 'bg-[#1a1c29]/50 opacity-60' : 'bg-[#1a1c29] hover:bg-[#202336]'}`}
    >
      <label className="flex items-start p-4 cursor-pointer">
        <div className="flex-shrink-0 pt-0.5 mr-4 relative">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleQuest(quest.quest)}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-sm transition-all duration-300 flex items-center justify-center
            ${completed ? 'bg-p4-yellow border-p4-yellow text-black' : 'border-gray-600 bg-[#0b0d17] group-hover:border-p4-yellow'}`}
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
            <span className="text-xs font-black text-gray-500 uppercase">#{quest.quest}</span>
            <h4 className={`text-base font-bold ${completed ? 'line-through text-gray-400' : 'text-white'}`}>
              {quest.quest_name}
            </h4>
          </div>
          
          <div className="text-xs text-gray-400 mt-1.5 space-y-1">
            <div className="flex items-center">
              <span className="text-gray-500 w-20">Req/NPC:</span>
              <span className="text-blue-300">{quest.npc} {quest.requirements !== 'N/A' ? `(${quest.requirements})` : ''}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-20">Available:</span>
              <span className="text-gray-300">{quest.first_day} • {quest.location}</span>
            </div>
            <div className="flex items-start mt-2 bg-[#0b0d17] p-2 rounded-sm border-l-2 border-p4-yellow">
              <span className="text-p4-yellow font-bold uppercase tracking-wider text-[10px] w-16 shrink-0 mt-0.5">Objective</span>
              <span className="text-gray-300 text-[11px] leading-tight flex-1">{quest.objective}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex flex-col items-end text-right ml-4 max-w-[150px]">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Reward</span>
          <span className={`text-sm font-bold ${completed ? 'text-gray-500' : 'text-p4-yellow'}`}>
            {quest.reward}
          </span>
        </div>
      </label>
    </div>
  );
}
