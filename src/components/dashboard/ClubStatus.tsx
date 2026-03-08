import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClubs } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";

const statusDot: Record<string, string> = {
  healthy: "bg-status-healthy",
  critical: "bg-status-critical",
  warning: "bg-status-warning",
};

const ClubStatus = () => {
  const { data: clubs, isLoading } = useClubs();

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Club Status Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))
        ) : clubs?.length ? (
          clubs.map((c) => (
            <div key={c._id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${statusDot[c.status] || "bg-muted-foreground"}`} />
                <span className="text-sm font-medium text-card-foreground">{c.name}</span>
              </div>
              <Badge variant={c.status as any} className="capitalize">{c.status}</Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No clubs found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubStatus;
