import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const clubs = [
  { name: "Coding Club", status: "healthy" as const, label: "Healthy" },
  { name: "Robotics Club", status: "critical" as const, label: "Critical" },
  { name: "Dance Club", status: "warning" as const, label: "Warning" },
];

const statusDot: Record<string, string> = {
  healthy: "bg-status-healthy",
  critical: "bg-status-critical",
  warning: "bg-status-warning",
};

const ClubStatus = () => (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Club Status Overview</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {clubs.map((c) => (
        <div key={c.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${statusDot[c.status]}`} />
            <span className="text-sm font-medium text-card-foreground">{c.name}</span>
          </div>
          <Badge variant={c.status}>{c.label}</Badge>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ClubStatus;
