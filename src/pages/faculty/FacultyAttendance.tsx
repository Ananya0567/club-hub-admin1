import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFacultyEvents, useFacultyRegistrations } from "@/hooks/use-dashboard-api";
import { useMarkAttendance } from "@/hooks/use-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users } from "lucide-react";

const FacultyAttendance = () => {
  const { data: events, isLoading: eventsLoading } = useFacultyEvents();
  const { data: registrations, isLoading: regsLoading } = useFacultyRegistrations();
  const markAttendance = useMarkAttendance();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const filtered = registrations?.filter(
    (r: any) => selectedEvent === "all" || r.event?._id === selectedEvent
  ) ?? [];

  const attendedCount = filtered.filter((r: any) => r.status === "attended").length;

  const handleToggle = (reg: any) => {
    const newStatus = reg.status === "attended" ? "registered" : "attended";
    markAttendance.mutate(
      { id: reg._id, status: newStatus },
      {
        onSuccess: () => toast({ title: `Marked as ${newStatus}` }),
        onError: (err: any) => toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" }),
      }
    );
  };

  const isLoading = eventsLoading || regsLoading;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-sm text-muted-foreground">Mark students as attended for your club's events</p>
        </div>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events?.map((e: any) => (
              <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
              <p className="text-xs text-muted-foreground">Total Registered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{attendedCount}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">%</div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {filtered.length ? Math.round((attendedCount / filtered.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card">
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
              </div>
            ) : filtered.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Attended</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((reg: any) => (
                    <TableRow key={reg._id}>
                      <TableCell>
                        <Checkbox
                          checked={reg.status === "attended"}
                          onCheckedChange={() => handleToggle(reg)}
                          disabled={markAttendance.isPending}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{reg.student?.name ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{reg.student?.email ?? "—"}</TableCell>
                      <TableCell>{reg.event?.name ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={reg.status === "attended" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {reg.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No registrations found.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FacultyAttendance;
