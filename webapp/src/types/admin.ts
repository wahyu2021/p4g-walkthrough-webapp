export type Ticket = {
  _id: string;
  code: string;
  isUsed: boolean;
  usedBy: string | null;
  createdBy: string;
  createdAt: string;
};

export type User = {
  _id: string;
  username: string;
  role: string;
  status?: string;
  createdAt?: string;
  lastLoginAt?: string;
  lastIp?: string;
  lastUserAgent?: string;
  progressDays?: number;
  lastMilestone?: string;
};

export type Metrics = {
  totalUsers: number;
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  avgDays: number;
  suspendedUsers: number;
  activeToday: number;
  chartData: Array<{ name: string; Pemain: number }>;
};

export type Announcement = {
  message: string;
  isActive: boolean;
  type: 'info' | 'warning';
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
};
