import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Club,
  Event,
  Complaint,
  DashboardMetrics,
  QuickStatsData,
  BudgetData,
  MonthlyEventData,
  CalendarDayEvents,
} from "@/types/api";

export const useMetrics = () =>
  useQuery<DashboardMetrics>({
    queryKey: ["metrics"],
    queryFn: async () => (await api.get("/dashboard/metrics")).data,
  });

export const useClubs = () =>
  useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: async () => (await api.get("/clubs")).data,
  });

export const useEvents = () =>
  useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => (await api.get("/events")).data,
  });

export const useQuickStats = () =>
  useQuery<QuickStatsData>({
    queryKey: ["quickStats"],
    queryFn: async () => (await api.get("/dashboard/quick-stats")).data,
  });

export const useComplaints = () =>
  useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: async () => (await api.get("/complaints")).data,
  });

export const useBudget = () =>
  useQuery<BudgetData>({
    queryKey: ["budget"],
    queryFn: async () => (await api.get("/dashboard/budget")).data,
  });

export const useMonthlyEvents = () =>
  useQuery<MonthlyEventData[]>({
    queryKey: ["monthlyEvents"],
    queryFn: async () => (await api.get("/dashboard/monthly-events")).data,
  });

export const useCalendarEvents = (date: string) =>
  useQuery<CalendarDayEvents>({
    queryKey: ["calendarEvents", date],
    queryFn: async () => (await api.get(`/dashboard/calendar/${date}`)).data,
    enabled: !!date,
  });
