export interface Quest {
  quest: string;
  quest_name: string;
  first_day: string;
  location: string;
  npc: string;
  requirements: string;
  objective: string;
  reward: string;
  notes: string;
}

export interface Book {
  book: string;
  series: string;
  chapters: string;
  effect: string;
  cost: string;
  obtained: string;
}
