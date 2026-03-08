import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">Configure your dashboard</p>
    </div>
    <Card className="shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <SettingsIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-lg font-semibold text-card-foreground">Settings coming soon</h2>
        <p className="text-sm text-muted-foreground mt-1">App configuration will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

export default SettingsPage;
