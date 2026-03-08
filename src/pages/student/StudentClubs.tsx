import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, MessageSquare } from "lucide-react";
import { useStudentClubs } from "@/hooks/use-dashboard-api";
import { useSubmitFeedback } from "@/hooks/use-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const statusDot: Record<string, string> = {
  healthy: "bg-status-healthy",
  critical: "bg-status-critical",
  warning: "bg-status-warning",
};

const StudentClubs = () => {
  const { data: clubs, isLoading } = useStudentClubs();
  const feedbackMutation = useSubmitFeedback();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<{ _id: string; name: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleFeedback = () => {
    if (!selectedClub) return;
    feedbackMutation.mutate(
      { targetType: "club", targetId: selectedClub._id, rating, comment },
      {
        onSuccess: () => {
          toast({ title: "Feedback submitted!" });
          setFeedbackOpen(false);
          setComment("");
          setRating(5);
        },
        onError: (err: any) => toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
        <p className="text-sm text-muted-foreground">Explore clubs and share your feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-lg" />)
        ) : clubs?.length ? (
          clubs.map((club, i) => (
            <motion.div
              key={club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${statusDot[club.status]}`} />
                    <CardTitle className="text-base">{club.name}</CardTitle>
                  </div>
                  <Badge variant={club.status as any} className="capitalize">{club.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Members</span>
                    <span className="font-medium text-card-foreground">{club.membersCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</span>
                    <span className="font-medium text-card-foreground">{club.rating}/5</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1 mt-2"
                    onClick={() => { setSelectedClub(club); setFeedbackOpen(true); }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Give Feedback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-12">No clubs found.</p>
        )}
      </div>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback for {selectedClub?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className={`text-xl transition-colors ${s <= rating ? "text-[hsl(var(--chart-4))]" : "text-muted-foreground/30"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-primary border-0 hover:opacity-90" onClick={handleFeedback} disabled={feedbackMutation.isPending}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentClubs;
