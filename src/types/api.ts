// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
}

// Clubs
export interface Club {
  _id: string;
  name: string;
  status: "healthy" | "critical" | "warning";
  membersCount: number;
  rating: number;
}

// Events
export interface Event {
  _id: string;
  name: string;
  club: string;
  status: "approved" | "pending" | "warning";
  rating: string;
  date: string;
  time: string;
}

// Complaints
export interface Complaint {
  _id: string;
  text: string;
  type: "alert" | "rating";
  createdAt: string;
}

// Metrics
export interface DashboardMetrics {
  totalClubs: number;
  eventsThisMonth: number;
  pendingApprovals: number;
  avgRating: number;
}

// Quick Stats
export interface QuickStatsData {
  upcomingEvents: number;
  reportsPending: number;
  totalParticipants: number;
}

// Budget
export interface BudgetData {
  budgetUsed: number;
  budgetTotal: number;
  photosUploaded: number;
  reportsPending: number;
}

// Chart data
export interface MonthlyEventData {
  month: string;
  all: number;
  pending: number;
  confirmed: number;
}

// Calendar events
export interface CalendarEvent {
  time: string;
  title: string;
  club: string;
  status: "approved" | "pending" | "warning";
}

export interface CalendarDayEvents {
  date: string;
  events: CalendarEvent[];
}
