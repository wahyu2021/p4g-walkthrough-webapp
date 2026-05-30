export type Tier = 'Early' | 'Mid' | 'Late' | 'End';

export interface FusionStep {
  step: number;
  action: string;
  result: string;
  notes: string;
}

export interface PersonaRecipe {
  id: string;
  name: string;
  arcana: string;
  level: number;
  tier: Tier;
  description: string;
  targetSkills: string[];
  recipe: FusionStep[];
}
