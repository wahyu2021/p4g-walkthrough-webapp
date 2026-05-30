import { useState, useMemo } from 'react';
import { RecipeCard } from '../components/organisms/RecipeCard';
import type { PersonaRecipe, Tier } from '../types/velvet';
import fusionsData from '../data/fusions.json';

const tiers: Tier[] = ['Early', 'Mid', 'Late', 'End'];

export function VelvetRoomPage() {
  const [selectedTier, setSelectedTier] = useState<Tier>('Early');
  
  const recipes = useMemo(() => {
    return (fusionsData as PersonaRecipe[]).filter(r => r.tier === selectedTier);
  }, [selectedTier]);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header - Velvet Room aesthetic (deep blue) */}
      <div className="bg-[#0b0d17] border-l-8 border-blue-600 p-6 mb-8 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
        {/* Subtle velvet room pattern effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Velvet <span className="text-blue-500">Room</span>
          </h2>
          <p className="text-blue-300/80 text-xs mt-2 uppercase font-bold tracking-widest">
            Welcome to the Velvet Room. This place exists between dream and reality.
          </p>
        </div>
      </div>

      {/* Tier Selector */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`
              px-6 py-3 uppercase tracking-widest font-black text-sm italic transition-all duration-300
              ${selectedTier === tier 
                ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_#0b0d17] scale-105' 
                : 'bg-[#1a1c29] text-gray-500 hover:bg-[#202336] hover:text-blue-400 border border-[#2a2d42]'
              }
            `}
            style={selectedTier === tier ? { clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' } : {}}
          >
            {tier} Game
          </button>
        ))}
      </div>

      {/* Recipes List */}
      <div className="animate-in fade-in duration-500">
        <h3 className="text-xl font-black text-blue-500 uppercase tracking-tight mb-6 border-b-2 border-dashed border-[#2a2d42] pb-2">
          {selectedTier} Game Personas
        </h3>
        
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="text-gray-500 text-sm italic">
            No recipes found for this tier.
          </div>
        )}
      </div>
    </div>
  );
}
