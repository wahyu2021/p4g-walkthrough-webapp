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
};

export type Metrics = {
  totalUsers: number;
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  avgDays: number;
};
