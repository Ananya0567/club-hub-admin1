import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockClubs,
  mockEvents,
  mockComplaints,
  mockMetrics,
  mockQuickStats,
  mockBudget,
  mockMonthlyEvents,
  getMockCalendarEvents,
} from "@/lib/mock-data";
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

function useDemoAware<T>(queryKey: string[], apiFn: () => Promise<T>, mockData: T) {
  const { isDemo } = useAuth();
  return useQuery<T>({
    queryKey,
    queryFn: isDemo ? () => Promise.resolve(mockData) : apiFn,
  });
}

export const useMetrics = () =>
  useDemoAware(["metrics"], async () => (await api.get("/dashboard/metrics")).data, mockMetrics);

export const useClubs = () =>
  useDemoAware(["clubs"], async () => (await api.get("/clubs")).data, mockClubs);

export const useEvents = () =>
  useDemoAware(["events"], async () => (await api.get("/events")).data, mockEvents);

export const useQuickStats = () =>
  useDemoAware(["quickStats"], async () => (await api.get("/dashboard/quick-stats")).data, mockQuickStats);

export const useComplaints = () =>
  useDemoAware(["complaints"], async () => (await api.get("/complaints")).data, mockComplaints);

export const useBudget = () =>
  useDemoAware(["budget"], async () => (await api.get("/dashboard/budget")).data, mockBudget);

export const useMonthlyEvents = () =>
  useDemoAware(["monthlyEvents"], async () => (await api.get("/dashboard/monthly-events")).data, mockMonthlyEvents);

export const useCalendarEvents = (date: string) => {
  const { isDemo } = useAuth();
  return useQuery<CalendarDayEvents>({
    queryKey: ["calendarEvents", date],
    queryFn: isDemo
      ? () => Promise.resolve(getMockCalendarEvents(date))
      : async () => (await api.get(`/dashboard/calendar/${date}`)).data,
    enabled: !!date,
  });
};
