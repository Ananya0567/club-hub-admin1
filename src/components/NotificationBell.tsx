import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

const initialNotifications: Notification[] = [
  { id: "n1", title: "Event Approved", description: "Annual Robo Wars has been approved", time: "2 min ago", read: false, type: "success" },
  { id: "n2", title: "New Complaint", description: "A complaint was filed for Photo Walk", time: "15 min ago", read: false, type: "warning" },
  { id: "n3", title: "Budget Updated", description: "Music Club budget increased by 20%", time: "1 hr ago", read: false, type: "info" },
  { id: "n4", title: "Event Pending", description: "Hackathon 2026 awaiting approval", time: "3 hrs ago", read: true, type: "info" },
  { id: "n5", title: "Club Alert", description: "Photography Club status changed to critical", time: "5 hrs ago", read: true, type: "warning" },
];

const typeColors: Record<string, string> = {
  info: "bg-primary",
  warning: "bg-destructive",
  success: "bg-chart-2",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-3 cursor-pointer",
                !n.read && "bg-accent/50"
              )}
              onClick={() => markRead(n.id)}
            >
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", typeColors[n.type])} />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                <p className="text-[11px] text-muted-foreground/70">{n.time}</p>
              </div>
              {!n.read && (
                <Badge variant="secondary" className="shrink-0 text-[10px] h-5">
                  New
                </Badge>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
