import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Total Clubs", value: "3", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Events This Month", value: "8", icon: Calendar, color: "bg-chart-3/10 text-chart-3" },
  { label: "Pending Approvals", value: "4", icon: Clock, color: "bg-status-warning/10 text-status-warning" },
  { label: "Avg Rating", value: "4.1", icon: Star, color: "bg-chart-4/10 text-chart-4" },
];

const MetricsCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {metrics.map((m, i) => (
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
              <p className="text-2xl font-bold text-card-foreground">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default MetricsCards;
