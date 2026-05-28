import type { SocialLink } from '../../types/walkthrough';

interface SocialLinkCardProps {
  sl: SocialLink;
}

export function SocialLinkCard({ sl }: SocialLinkCardProps) {
  return (
    <div 
      className="relative group bg-[#2a2a2a] border-2 border-p4-black p-4 transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#111111]"
      style={{ clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-p4-black px-3 py-1 border-l-4 border-p4-yellow">
          <span className="text-[10px] text-gray-500 uppercase font-black block leading-none">Arcana</span>
          <span className="text-p4-yellow font-black italic uppercase tracking-tighter text-sm">{sl.arcana}</span>
        </div>
        <div className="text-3xl font-black text-white/10 group-hover:text-p4-yellow/20 transition-colors">
          {sl.arcana_num.toString().padStart(2, '0')}
        </div>
      </div>
      
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
        {sl.character}
      </h3>
      
      <div className="space-y-1">
        {sl.start_date && (
          <div className="flex justify-between text-[10px] uppercase font-bold">
            <span className="text-gray-500">Available From</span>
            <span className="text-p4-yellow">{sl.start_date}</span>
          </div>
        )}
        {sl.auto && (
          <div className="inline-block bg-blue-500/20 text-blue-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded">
            Automatic
          </div>
        )}
        {sl.req_stat && (
          <div className="flex justify-between text-[10px] uppercase font-bold">
            <span className="text-gray-500">Required Stat</span>
            <span className="text-pink-500">{sl.req_stat}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-p4-gray flex justify-end">
        <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-p4-yellow transition-colors cursor-not-allowed">
          View Ranks →
        </button>
      </div>
    </div>
  );
}
