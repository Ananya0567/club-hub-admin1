import EventsTable from "@/components/dashboard/EventsTable";

const EventsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Events</h1>
      <p className="text-sm text-muted-foreground">Manage all events across clubs</p>
    </div>
    <EventsTable />
  </div>
);

export default EventsPage;
