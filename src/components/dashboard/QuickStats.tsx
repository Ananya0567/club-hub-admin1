import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, FileText, Users } from "lucide-react";

const stats = [
  { label: "Upcoming Events", value: "5", icon: CalendarDays },
  { label: "Reports Pending", value: "2", icon: FileText },
  { label: "Total Participants", value: "450", icon: Users },
];

const QuickStats = () => (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 text-muted-foreground">
            <s.icon className="h-4 w-4" />
            <span className="text-sm">{s.label}</span>
          </div>
          <span className="text-sm font-bold text-card-foreground">{s.value}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default QuickStats;
