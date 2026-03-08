import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Star, ClipboardList, MessageSquare } from "lucide-react";
import { useFacultyClub, useFacultyStats } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const FacultyDashboard = () => {
  const { data: club, isLoading: clubLoading } = useFacultyClub();
  const { data: stats, isLoading: statsLoading } = useFacultyStats();
  const isLoading = clubLoading || statsLoading;

  const statCards = [
    { label: "Total Events", value: stats?.totalEvents ?? 0, icon: CalendarDays, color: "text-[hsl(var(--chart-1))]" },
    { label: "Pending Events", value: stats?.pendingEvents ?? 0, icon: ClipboardList, color: "text-[hsl(var(--chart-4))]" },
    { label: "Registrations", value: stats?.totalRegistrations ?? 0, icon: Users, color: "text-[hsl(var(--chart-3))]" },
    { label: "Feedback", value: stats?.feedbackCount ?? 0, icon: MessageSquare, color: "text-[hsl(var(--chart-2))]" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
        {club && (
          <p className="text-sm text-muted-foreground">
            Managing <span className="font-medium text-foreground">{club.name}</span> — Rating: ⭐ {club.rating}/5
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
          : statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="shadow-card">
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                      </div>
                      <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {club && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Club Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize text-card-foreground">{club.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Members</p>
                  <p className="font-medium text-card-foreground">{club.membersCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-medium text-card-foreground">{club.rating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default FacultyDashboard;
