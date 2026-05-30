import { useState } from 'react';
import type { PersonaRecipe } from '../../types/velvet';

interface RecipeCardProps {
  recipe: PersonaRecipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1a1c29] border border-[#2a2d42] overflow-hidden mb-6 relative group transition-all duration-300 shadow-[4px_4px_0px_0px_#0b0d17] hover:shadow-[6px_6px_0px_0px_#0b0d17]">
      {/* Decorative side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
      
      {/* Header / Summary */}
      <div 
        className="p-5 pl-7 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-[#202336] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="text-xl font-black text-white tracking-tight">{recipe.name}</h3>
            <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 font-bold uppercase rounded-sm border border-blue-800">
              Lv {recipe.level}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 font-bold uppercase rounded-sm border border-gray-700">
              {recipe.arcana}
            </span>
          </div>
          <p className="text-sm text-blue-200/80 font-medium">{recipe.description}</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex flex-wrap gap-1.5 justify-end">
            {recipe.targetSkills.map(skill => (
              <span key={skill} className="text-[10px] font-bold px-1.5 py-0.5 bg-[#0b0d17] text-gray-400 uppercase tracking-wider">
                {skill}
              </span>
            ))}
          </div>
          <div className={`transform transition-transform duration-300 text-blue-500 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Accordion Content: Step-by-step */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-[#2a2d42]' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pl-7 bg-[#141622]">
          <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Fusion Recipe</h4>
          
          <div className="space-y-4">
            {recipe.recipe.map((step, idx) => (
              <div key={idx} className="relative pl-6">
                {/* Step Line/Dot */}
                <div className="absolute left-[11px] top-1.5 w-0.5 h-full bg-[#2a2d42]" />
                <div className="absolute left-2 top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                
                <div className="bg-[#1a1c29] p-3 rounded-sm border border-[#2a2d42]">
                  <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase">Step {step.step}</div>
                  <div className="text-sm font-bold text-blue-100 mb-1">{step.action}</div>
                  <div className="text-xs font-semibold text-p4-yellow mb-2">Result: {step.result}</div>
                  {step.notes && (
                    <div className="text-[11px] text-gray-400 bg-[#0b0d17] p-2 rounded-sm italic border-l-2 border-gray-700">
                      {step.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
