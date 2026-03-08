import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { useMyRegistrations } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const StudentMyRegistrations = () => {
  const { data: registrations, isLoading } = useMyRegistrations();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Registrations</h1>
        <p className="text-sm text-muted-foreground">Events you've registered for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)
        ) : registrations?.length ? (
          registrations.map((reg, i) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-card">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-base">{reg.event.name}</CardTitle>
                  <Badge variant="secondary" className="capitalize">{reg.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{reg.event.club}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{reg.event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{reg.event.time}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-12">No registrations yet. Browse events to register!</p>
        )}
      </div>
    </div>
  );
};

export default StudentMyRegistrations;
