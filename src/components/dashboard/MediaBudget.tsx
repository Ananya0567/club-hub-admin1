import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Image, FileText, IndianRupee } from "lucide-react";

const MediaBudget = () => (
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
          <span className="text-sm font-bold text-card-foreground">320</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Reports Pending</span>
          </div>
          <span className="text-sm font-bold text-card-foreground">3</span>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <IndianRupee className="h-4 w-4" /> Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={85} className="h-2.5" />
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Budget Used</p>
            <p className="font-bold text-card-foreground">₹85,000</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-bold text-status-healthy">₹15,000</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default MediaBudget;
