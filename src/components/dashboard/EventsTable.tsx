import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const events = [
  { name: "Hackathon 2026", club: "Coding Club", status: "Approved", statusVariant: "healthy" as const, rating: "4.5" },
  { name: "Dance Night", club: "Dance Club", status: "Pending", statusVariant: "warning" as const, rating: "--" },
  { name: "Demo Party", club: "Robotics Club", status: "Warning", statusVariant: "critical" as const, rating: "--" },
];

const EventsTable = () => (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Events Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e) => (
            <TableRow key={e.name}>
              <TableCell className="font-medium">{e.name}</TableCell>
              <TableCell className="text-muted-foreground">{e.club}</TableCell>
              <TableCell><Badge variant={e.statusVariant}>{e.status}</Badge></TableCell>
              <TableCell className="text-right font-mono">{e.rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default EventsTable;
