import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "JUN", all: 4, pending: 1, confirmed: 3 },
  { month: "AUG", all: 6, pending: 2, confirmed: 4 },
  { month: "FEB", all: 3, pending: 1, confirmed: 2 },
  { month: "MAR", all: 8, pending: 3, confirmed: 5 },
  { month: "APR", all: 5, pending: 2, confirmed: 3 },
  { month: "MAY", all: 7, pending: 1, confirmed: 6 },
];

const EventsChart = () => (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold">Monthly Events Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="all" name="All" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" name="Pending" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="confirmed" name="Confirmed" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default EventsChart;
