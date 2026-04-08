import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubs, useAdminClubEvents } from "@/hooks/use-dashboard-api";
import { FolderOpen, Filter } from "lucide-react";
import { EventDocCard } from "@/components/documents/EventDocCard";
import type { Event } from "@/types/api";

const PROOF_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ClubDocuments = () => {
  const { data: clubs, isLoading: clubsLoading } = useClubs();
  const [selectedClubId, setSelectedClubId] = useState("");
  const [proofFilter, setProofFilter] = useState("all");
  const { data: clubEvents, isLoading: eventsLoading } = useAdminClubEvents(selectedClubId);

  const filteredEvents: Event[] = (clubEvents?.events ?? []).filter(
    (e) => proofFilter === "all" || e.proofStatus === proofFilter
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <FolderOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Club Documents</h1>
          <p className="text-sm text-muted-foreground">View event photos, documents & budget proofs per club</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Club</label>
              {clubsLoading ? (
                <Skeleton className="h-10 w-64" />
              ) : (
                <Select value={selectedClubId} onValueChange={(v) => { setSelectedClubId(v); setProofFilter("all"); }}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Choose a club..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs?.map((club) => (
                      <SelectItem key={club._id} value={club._id}>{club.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedClubId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" /> Proof Status
                </label>
                <Select value={proofFilter} onValueChange={setProofFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROOF_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedClubId && (
        <>
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
            </div>
          ) : filteredEvents.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} for <span className="font-medium text-foreground">{clubEvents!.club.name}</span>
                {proofFilter !== "all" && <span className="ml-1">({proofFilter})</span>}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map((event, i) => (
                  <EventDocCard key={event._id} event={event} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center text-muted-foreground">
                {proofFilter === "all" ? "No events found for this club." : `No events with "${proofFilter}" proof status.`}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ClubDocuments;
