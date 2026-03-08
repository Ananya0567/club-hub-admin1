import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useFacultyFeedback } from "@/hooks/use-dashboard-api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";

const FacultyFeedback = () => {
  const { data, isLoading } = useFacultyFeedback();

  const renderStars = (rating: number) => (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[hsl(var(--chart-4))]" : "text-muted-foreground/30"}>★</span>
      ))}
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Feedback</h1>
        <p className="text-sm text-muted-foreground">Reviews from students about your club and events</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Club Feedback</h2>
            {data?.clubFeedback?.length ? (
              data.clubFeedback.map((fb, i) => (
                <motion.div key={fb._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-card-foreground">{fb.student.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {renderStars(fb.rating)}
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(fb.createdAt), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No club feedback yet.</p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Event Feedback</h2>
            {data?.eventFeedback?.length ? (
              data.eventFeedback.map((fb, i) => (
                <motion.div key={fb._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="shadow-card">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-card-foreground">{fb.student.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {renderStars(fb.rating)}
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(fb.createdAt), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No event feedback yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyFeedback;
