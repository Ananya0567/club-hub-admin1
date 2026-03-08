import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useClubs } from "@/hooks/use-dashboard-api";
import { useCreateClub, useUpdateClub, useDeleteClub } from "@/hooks/use-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import ClubFormDialog from "@/components/dashboard/ClubFormDialog";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import type { Club } from "@/types/api";

const statusDot: Record<string, string> = {
  healthy: "bg-status-healthy",
  critical: "bg-status-critical",
  warning: "bg-status-warning",
};

const ClubsPage = () => {
  const { data: clubs, isLoading } = useClubs();
  const createClub = useCreateClub();
  const updateClub = useUpdateClub();
  const deleteClub = useDeleteClub();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = (data: Partial<Club> & { id?: string }) => {
    const mutation = data.id ? updateClub : createClub;
    mutation.mutate(data as any, {
      onSuccess: () => { setFormOpen(false); setEditingClub(null); toast({ title: data.id ? "Club updated" : "Club created" }); },
      onError: (err: any) => { toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" }); },
    });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteClub.mutate(deletingId, {
      onSuccess: () => { setDeleteOpen(false); setDeletingId(null); toast({ title: "Club deleted" }); },
      onError: (err: any) => { toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" }); },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
          <p className="text-sm text-muted-foreground">Manage all registered clubs</p>
        </div>
        <Button className="gap-2 bg-gradient-primary border-0 hover:opacity-90" onClick={() => { setEditingClub(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Club
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)
        ) : clubs?.length ? (
          clubs.map((c) => (
            <Card key={c._id} className="shadow-card">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${statusDot[c.status]}`} />
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </div>
                <Badge variant={c.status as any} className="capitalize">{c.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium text-card-foreground">{c.membersCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium text-card-foreground">{c.rating}/5</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => { setEditingClub(c); setFormOpen(true); }}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" onClick={() => { setDeletingId(c._id); setDeleteOpen(true); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-12">No clubs found. Create one to get started.</p>
        )}
      </div>

      <ClubFormDialog open={formOpen} onOpenChange={setFormOpen} club={editingClub} onSubmit={handleSubmit} isLoading={createClub.isPending || updateClub.isPending} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Club" description="Are you sure? This cannot be undone." onConfirm={handleDelete} isLoading={deleteClub.isPending} />
    </div>
  );
};

export default ClubsPage;
