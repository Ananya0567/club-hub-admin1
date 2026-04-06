import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubs, useAdminClubEvents } from "@/hooks/use-dashboard-api";
import { CalendarDays, Clock, Image, FileText, DollarSign, ExternalLink, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const getFileUrl = (path: string) => `${API_BASE}${path}`;

const ClubDocuments = () => {
  const { data: clubs, isLoading: clubsLoading } = useClubs();
  const [selectedClubId, setSelectedClubId] = useState("");
  const { data: clubEvents, isLoading: eventsLoading } = useAdminClubEvents(selectedClubId);

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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Club</label>
            {clubsLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
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
        </CardContent>
      </Card>

      {selectedClubId && (
        <>
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
            </div>
          ) : clubEvents?.events?.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing {clubEvents.events.length} events for <span className="font-medium text-foreground">{clubEvents.club.name}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubEvents.events.map((event, i) => (
                  <EventDocCard key={event._id} event={event} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center text-muted-foreground">
                No events found for this club.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

const EventDocCard = ({ event, index }: { event: Event; index: number }) => {
  const hasPhotos = (event.photos?.length ?? 0) > 0;
  const hasDocs = (event.documents?.length ?? 0) > 0;
  const hasBudgetProof = (event.budgetProof?.length ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{event.name}</CardTitle>
            <Badge variant={event.status as any} className="capitalize">{event.status}</Badge>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {event.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(event.budgetUsed ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Budget Used: ₹{event.budgetUsed?.toLocaleString()}</span>
            </div>
          )}

          {/* Photos */}
          {hasPhotos && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5" /> Photos ({event.photos!.length})
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {event.photos!.map((photo, j) => (
                  <a key={j} href={getFileUrl(photo)} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={getFileUrl(photo)}
                      alt={`Event photo ${j + 1}`}
                      className="w-full h-20 object-cover rounded-md border hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {hasDocs && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Documents ({event.documents!.length})
              </h4>
              <div className="space-y-1">
                {event.documents!.map((doc, j) => (
                  <a
                    key={j}
                    href={getFileUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:underline p-1.5 rounded-md hover:bg-accent transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doc.split("/").pop()}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Budget Proofs */}
          {hasBudgetProof && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" /> Budget Proofs ({event.budgetProof!.length})
              </h4>
              <div className="space-y-1">
                {event.budgetProof!.map((proof, j) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(proof);
                  return isImage ? (
                    <a key={j} href={getFileUrl(proof)} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={getFileUrl(proof)}
                        alt={`Budget proof ${j + 1}`}
                        className="w-full h-20 object-cover rounded-md border hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ) : (
                    <a
                      key={j}
                      href={getFileUrl(proof)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:underline p-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{proof.split("/").pop()}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-auto" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {!hasPhotos && !hasDocs && !hasBudgetProof && (
            <p className="text-xs text-muted-foreground text-center py-4">No files uploaded for this event yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClubDocuments;
