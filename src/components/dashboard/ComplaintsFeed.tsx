import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Star } from "lucide-react";

const complaints = [
  { text: "Issue at Cultural Fest", time: "5 min ago", icon: AlertTriangle, iconColor: "text-status-warning" },
  { text: "Low Rating: Robotics Club Alert", time: "15 min ago", icon: Star, iconColor: "text-status-critical" },
];

const ComplaintsFeed = () => (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Complaints & Feedback</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {complaints.map((c, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
          <c.icon className={`h-4 w-4 mt-0.5 ${c.iconColor}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground">{c.text}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.time}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ComplaintsFeed;
