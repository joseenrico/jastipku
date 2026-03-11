"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Bell, CheckCheck, MessageSquare, Package, Plane, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications, type AppNotification } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

function notifIcon(type: AppNotification["type"]) {
  switch (type) {
    case "order":
      return Package;
    case "chat":
      return MessageSquare;
    case "trip":
      return Plane;
    default:
      return Sparkles;
  }
}

function timeAgo(createdAt: string) {
  const dt = new Date(createdAt);
  if (Number.isNaN(dt.getTime())) return "";
  return formatDistanceToNowStrict(dt, { addSuffix: true });
}

export function NotificationBell({ className }: { className?: string }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const items = notifications
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const badgeText = unreadCount > 9 ? "9+" : unreadCount.toString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative rounded-xl", className)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black grid place-items-center">
              {badgeText}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[360px]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold leading-none">Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl font-bold"
              onClick={(e) => {
                e.preventDefault();
                markAllRead();
              }}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              Status updates and messages will appear here.
            </p>
          </div>
        ) : (
          items.map((n) => {
            const Icon = notifIcon(n.type);
            const content = (
              <div className="flex items-start gap-3 w-full">
                <div className={cn("p-2 rounded-xl border", n.read ? "bg-muted/30" : "bg-primary/10 border-primary/20")}>
                  <Icon className={cn("h-4 w-4", n.read ? "text-muted-foreground" : "text-primary")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className={cn("text-sm font-bold leading-snug", n.read ? "text-foreground" : "text-foreground")}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <Badge className="h-5 px-2 text-[10px] font-black rounded-full bg-primary/10 text-primary border border-primary/20">
                        New
                      </Badge>
                    )}
                  </div>
                  {n.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {n.description}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-wider">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </div>
            );

            if (n.href) {
              return (
                <DropdownMenuItem
                  key={n.id}
                  asChild
                  onSelect={() => markRead(n.id)}
                  className="cursor-pointer"
                >
                  <Link href={n.href} className="py-3">
                    {content}
                  </Link>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={n.id}
                onSelect={() => markRead(n.id)}
                className="cursor-pointer py-3"
              >
                {content}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

