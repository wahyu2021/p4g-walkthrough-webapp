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
