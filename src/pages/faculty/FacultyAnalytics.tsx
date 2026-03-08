import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFacultyEvents, useFacultyRegistrations, useFacultyStats } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp, Users, CheckCircle, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

const FacultyAnalytics = () => {
  const { data: events, isLoading: eventsLoading } = useFacultyEvents();
  const { data: registrations, isLoading: regsLoading } = useFacultyRegistrations();
  const { data: stats, isLoading: statsLoading } = useFacultyStats();
  const isLoading = eventsLoading || regsLoading || statsLoading;

  // Attendance by event
  const eventAttendance = (events ?? []).map((e: any) => {
    const eventRegs = (registrations ?? []).filter((r: any) => r.event?._id === e._id);
    const attended = eventRegs.filter((r: any) => r.status === "attended").length;
    return {
      name: e.name.length > 15 ? e.name.slice(0, 15) + "…" : e.name,
      registered: eventRegs.length,
      attended,
      rate: eventRegs.length ? Math.round((attended / eventRegs.length) * 100) : 0,
    };
  });

  // Status distribution pie
  const statusCounts = (registrations ?? []).reduce((acc: any, r: any) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusPie = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Monthly trend (group by month from event dates)
  const monthlyTrend = (events ?? []).reduce((acc: any[], e: any) => {
    const month = e.date?.slice(0, 7); // YYYY-MM
    const eventRegs = (registrations ?? []).filter((r: any) => r.event?._id === e._id);
    const attended = eventRegs.filter((r: any) => r.status === "attended").length;
    const existing = acc.find((m) => m.month === month);
    if (existing) {
      existing.registrations += eventRegs.length;
      existing.attended += attended;
    } else {
      acc.push({ month, registrations: eventRegs.length, attended });
    }
    return acc;
  }, []).sort((a: any, b: any) => a.month.localeCompare(b.month))
    .map((m: any) => ({
      ...m,
      month: new Date(m.month + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }),
      rate: m.registrations ? Math.round((m.attended / m.registrations) * 100) : 0,
    }));

  // Summary cards
  const totalRegs = registrations?.length ?? 0;
  const totalAttended = (registrations ?? []).filter((r: any) => r.status === "attended").length;
  const overallRate = totalRegs ? Math.round((totalAttended / totalRegs) * 100) : 0;

  const summaryCards = [
    { label: "Total Registrations", value: totalRegs, icon: Users, color: "text-[hsl(var(--chart-1))]" },
    { label: "Total Attended", value: totalAttended, icon: CheckCircle, color: "text-[hsl(var(--chart-3))]" },
    { label: "Attendance Rate", value: `${overallRate}%`, icon: TrendingUp, color: "text-[hsl(var(--chart-2))]" },
    { label: "Total Events", value: stats?.totalEvents ?? 0, icon: BarChart3, color: "text-[hsl(var(--chart-4))]" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Attendance trends and insights for your club</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : summaryCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="shadow-card">
                  <CardContent className="pt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    </div>
                    <s.icon className={`h-7 w-7 ${s.color} opacity-80`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by event */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Attendance by Event</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : eventAttendance.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={eventAttendance} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="registered" name="Registered" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attended" name="Attended" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No event data yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Status distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Registration Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : statusPie.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusPie.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No registration data yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trend line */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Attendance Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[260px] w-full rounded-lg" />
            ) : monthlyTrend.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="rate" name="Attendance Rate" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">Not enough data for trends.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FacultyAnalytics;
