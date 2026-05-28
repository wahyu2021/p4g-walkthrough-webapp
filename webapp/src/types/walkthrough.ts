export interface Entry {
  type: string;
  title: string;
  content: string;
}

export interface Day {
  date: string;
  day_num: number;
  month_num: number;
  date_label?: string;
  entries: Entry[];
}

export interface WalkthroughMonth {
  month: string;
  month_num: number;
  days: Day[];
}

export interface SocialLinkRank {
  rank: number;
  choices: { text: string; points: number; is_best?: boolean }[];
  notes?: string;
}

export interface SocialLink {
  id: string;
  arcana: string;
  arcana_num: number;
  character: string;
  start_date?: string;
  auto?: boolean;
  req_stat?: string;
  ranks: SocialLinkRank[];
  overview: string;
}

export interface DungeonFloor {
  name: string;
  enemies: string[];
  items: string[];
}

export interface Dungeon {
  id: string;
  name: string;
  order: number;
  deadline: string;
  dungeon_num: number;
  status: string;
  floors_count: number;
  boss: { name: string; weaknesses: string[]; strategy: string } | null;
  floors: DungeonFloor[];
  overview: string;
}
