import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useMetrics } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

const iconMap: { label: string; icon: LucideIcon; color: string }[] = [
  { label: "Total Clubs", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Events This Month", icon: Calendar, color: "bg-chart-3/10 text-chart-3" },
  { label: "Pending Approvals", icon: Clock, color: "bg-status-warning/10 text-status-warning" },
  { label: "Avg Rating", icon: Star, color: "bg-chart-4/10 text-chart-4" },
];

const MetricsCards = () => {
  const { data, isLoading } = useMetrics();

  const values = data
    ? [String(data.totalClubs), String(data.eventsThisMonth), String(data.pendingApprovals), String(data.avgRating)]
    : ["--", "--", "--", "--"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {iconMap.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-card-foreground">{values[i]}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsCards;
