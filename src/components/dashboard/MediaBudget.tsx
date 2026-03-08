import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Image, FileText, IndianRupee } from "lucide-react";
import { useBudget } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";

const MediaBudget = () => {
  const { data, isLoading } = useBudget();

  const budgetPercent = data ? Math.round((data.budgetUsed / data.budgetTotal) * 100) : 0;
  const remaining = data ? data.budgetTotal - data.budgetUsed : 0;

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Media & Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Image className="h-4 w-4" />
              <span className="text-sm">Photos Uploaded</span>
            </div>
            {isLoading ? <Skeleton className="h-5 w-10" /> : (
              <span className="text-sm font-bold text-card-foreground">{data?.photosUploaded ?? "--"}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Reports Pending</span>
            </div>
            {isLoading ? <Skeleton className="h-5 w-10" /> : (
              <span className="text-sm font-bold text-card-foreground">{data?.reportsPending ?? "--"}</span>
            )}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
            View All Media & Documents
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <IndianRupee className="h-4 w-4" /> Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : (
            <>
              <Progress value={budgetPercent} className="h-2.5" />
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Budget Used</p>
                  <p className="font-bold text-card-foreground">₹{data?.budgetUsed?.toLocaleString("en-IN") ?? "--"}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-bold text-status-healthy">₹{remaining.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaBudget;
