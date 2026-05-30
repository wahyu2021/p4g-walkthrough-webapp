import React from 'react';
import { StatBar } from '../components/molecules/StatBar';

export function TrackerPage() {
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

      {/* Main Stats Section */}
      <div className="bg-[#2a2a2a] border-2 border-p4-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#111111] mb-8" style={{ clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)' }}>
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

      {/* Collections Section Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 opacity-50">
        <div className="bg-p4-black/50 border-2 border-[#333] p-6">
          <h3 className="text-xl font-black text-gray-500 uppercase tracking-tight mb-2">
            Books Library
          </h3>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Incoming transmission... (Awaiting Data)</p>
        </div>

        <div className="bg-p4-black/50 border-2 border-[#333] p-6">
          <h3 className="text-xl font-black text-gray-500 uppercase tracking-tight mb-2">
            Quest Log
          </h3>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Incoming transmission... (Awaiting Data)</p>
        </div>
      </div>

    </div>
  );
}
