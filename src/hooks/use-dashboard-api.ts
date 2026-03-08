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
  mockStudentEvents,
  mockMyRegistrations,
  mockFacultyStats,
  mockFacultyEvents,
  mockFeedback,
  mockNotifications,
  mockFacultyRegistrations,
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
  StudentEvent,
  EventRegistration,
  FacultyStats,
  Feedback,
  AppNotification,
} from "@/types/api";

function useDemoAware<T>(queryKey: string[], apiFn: () => Promise<T>, mockData: T) {
  const { isDemo } = useAuth();
  return useQuery<T>({
    queryKey,
    queryFn: isDemo ? () => Promise.resolve(mockData) : apiFn,
  });
}

// Admin hooks
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

// Student hooks
export const useStudentEvents = () =>
  useDemoAware<StudentEvent[]>(["studentEvents"], async () => (await api.get("/student/events")).data, mockStudentEvents);

export const useStudentClubs = () =>
  useDemoAware<Club[]>(["studentClubs"], async () => (await api.get("/student/clubs")).data, mockClubs);

export const useMyRegistrations = () =>
  useDemoAware<EventRegistration[]>(["myRegistrations"], async () => (await api.get("/student/my-registrations")).data, mockMyRegistrations);

// Faculty hooks
export const useFacultyClub = () =>
  useDemoAware<Club>(["facultyClub"], async () => (await api.get("/faculty/my-club")).data, mockClubs[0]);

export const useFacultyEvents = () =>
  useDemoAware<Event[]>(["facultyEvents"], async () => (await api.get("/faculty/events")).data, mockFacultyEvents);

export const useFacultyStats = () =>
  useDemoAware<FacultyStats>(["facultyStats"], async () => (await api.get("/faculty/stats")).data, mockFacultyStats);

export const useFacultyFeedback = () =>
  useDemoAware<{ clubFeedback: Feedback[]; eventFeedback: Feedback[] }>(
    ["facultyFeedback"],
    async () => (await api.get("/faculty/feedback")).data,
    mockFeedback
  );

export const useFacultyRegistrations = () =>
  useDemoAware<any[]>(["facultyRegistrations"], async () => (await api.get("/faculty/registrations")).data, mockFacultyRegistrations);

// Notifications
export const useNotifications = () =>
  useDemoAware<AppNotification[]>(["notifications"], async () => (await api.get("/notifications")).data, mockNotifications);
