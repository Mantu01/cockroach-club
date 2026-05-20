'use client';

import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { Bell } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  job: '#4a7c59',
  application: '#1a6b8a',
  system: '#c4922a',
  billing: '#b5451b',
};

function NotificationsContent() {
  const { fetchNotifications, markNotificationRead } = useStudioData();
  const notifications = useAppSelector((s) => s.studio.notifications);
  const loading = useAppSelector((s) => s.studio.loading.notifications);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchNotifications();
  }, [fetchNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  if (loading && notifications.length === 0) return <StudioLoader rows={4} />;

  return (
    <div className="min-h-[calc(100vh-220px)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className={UI_SIZES.pageTitle} style={{ fontFamily: "'Syne', sans-serif" }}>
              Notifications
            </h1>
            <p className={UI_SIZES.pageSubtitle}>
              Stay updated on jobs, applications, and account activity.
            </p>
          </div>
          {unread > 0 && (
            <Badge variant="outline" className={UI_SIZES.badge}>
              <Bell className="size-3 mr-1" />
              {unread} unread
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {notifications.map((notif) => (
            <Card
              key={notif._id}
              className={`border bg-muted/5 ${notif.read ? 'border-border/30 opacity-70' : 'border-border/40'}`}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2 px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold">{notif.title}</span>
                  <span className="text-[10px] text-muted-foreground">{notif.message}</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] capitalize shrink-0"
                  style={{ color: TYPE_COLORS[notif.type], borderColor: TYPE_COLORS[notif.type] }}
                >
                  {notif.type}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between px-4 pb-3">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
                {!notif.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={() => void markNotificationRead(notif._id)}
                  >
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return <NotificationsContent />;
}
