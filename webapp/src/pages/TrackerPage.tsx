import { useState } from 'react';
import { StatBar } from '../components/molecules/StatBar';
import { QuestRow } from '../components/molecules/QuestRow';
import { BookRow } from '../components/molecules/BookRow';
import type { Quest, Book } from '../types/collections';
import questsData from '../data/quests.json';
import booksData from '../data/books.json';

type Tab = 'stats' | 'quests' | 'books';

export function TrackerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const quests = questsData as Quest[];
  const books = booksData as Book[];

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="bg-p4-black border-l-8 border-p4-yellow p-6 mb-8 relative overflow-hidden">
        {/* Decorative TV lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">       
            Social <span className="text-p4-yellow">Tracker</span>
          </h2>
          <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">
            Monitor your personal growth and collections.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {(['stats', 'quests', 'books'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-3 uppercase tracking-widest font-black text-sm transition-all duration-300
              ${activeTab === tab 
                ? 'bg-p4-yellow text-black shadow-[4px_4px_0px_0px_#111] scale-105' 
                : 'bg-p4-black text-gray-500 hover:bg-[#222] hover:text-gray-300 border border-[#333]'
              }
            `}
            style={activeTab === tab ? { clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Stats Section */}
      {activeTab === 'stats' && (
        <div className="bg-[#2a2a2a] border-2 border-p4-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#111111] animate-in fade-in" style={{ clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)' }}>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 leading-tight border-b-2 border-dashed border-[#444] pb-4">
            Status Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-2">
              <StatBar statName="knowledge" displayName="Knowledge" colorClass="bg-blue-500" />
              <StatBar statName="courage" displayName="Courage" colorClass="bg-red-500" />
              <StatBar statName="diligence" displayName="Diligence" colorClass="bg-orange-500" />
            </div>
            <div className="space-y-2">
              <StatBar statName="understanding" displayName="Understanding" colorClass="bg-green-500" />
              <StatBar statName="expression" displayName="Expression" colorClass="bg-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Quests Section */}
      {activeTab === 'quests' && (
        <div className="bg-p4-black border border-[#333] shadow-[6px_6px_0px_0px_#111111] animate-in fade-in">
          <div className="p-4 border-b border-[#333] bg-[#111]">
            <h3 className="text-xl font-black text-p4-yellow uppercase tracking-tight">
              Quest Log ({quests.length})
            </h3>
          </div>
          <div className="flex flex-col">
            {quests.map(q => (
              <QuestRow key={q.quest} quest={q} />
            ))}
          </div>
        </div>
      )}

      {/* Books Section */}
      {activeTab === 'books' && (
        <div className="bg-p4-black border border-[#333] shadow-[6px_6px_0px_0px_#111111] animate-in fade-in">
          <div className="p-4 border-b border-[#333] bg-[#111]">
            <h3 className="text-xl font-black text-blue-500 uppercase tracking-tight">
              Books Library ({books.length})
            </h3>
          </div>
          <div className="flex flex-col">
            {books.map(b => (
              <BookRow key={b.book} book={b} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
