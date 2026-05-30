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

export interface DungeonEnemy {
  enemy: string;
  arcana: string;
  lv: string;
  hp: string;
  sp: string;
  phy: string;
  fir: string;
  ice: string;
  elc: string;
  wnd: string;
  lgt: string;
  drk: string;
  rd?: string;
  floor: string;
}

export interface DungeonBoss {
  boss: string;
  lv: string;
  hp: string;
  sp: string;
  phy: string;
  fir: string;
  ice: string;
  elc: string;
  wnd: string;
  lgt: string;
  drk: string;
  floor: string;
}

export interface DungeonFloor {
  floor: number;
  title: string;
  notes: string;
}

export interface Dungeon {
  id: string;
  name: string;
  order: number;
  deadline: string;
  dungeon_num: number;
  status?: string;
  floors_count: number;
  boss: { name: string; weaknesses: string[]; strategy: string } | null;
  bosses: DungeonBoss[];
  mini_bosses: DungeonBoss[];
  enemies: DungeonEnemy[];
  floors: DungeonFloor[];
  overview: string;
}

