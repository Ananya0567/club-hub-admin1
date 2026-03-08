import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const ReportsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>
      <p className="text-sm text-muted-foreground">View and generate reports</p>
    </div>
    <Card className="shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-lg font-semibold text-card-foreground">Reports coming soon</h2>
        <p className="text-sm text-muted-foreground mt-1">Report generation will be available once connected to the backend.</p>
      </CardContent>
    </Card>
  </div>
);

export default ReportsPage;
