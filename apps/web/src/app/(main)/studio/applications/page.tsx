'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { ExternalLink, MapPin } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  saved: '#c4922a',
  applied: '#1a6b8a',
  interview: '#4a7c59',
  rejected: '#b5451b',
  offer: '#4a7c59',
};

export default function ApplicationsPage() {
  const { fetchApplications } = useStudioData();
  const applications = useAppSelector((s) => s.studio.applications);
  const loading = useAppSelector((s) => s.studio.loading.applications);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchApplications();
  }, [fetchApplications]);

  if (loading && applications.length === 0) return <StudioLoader rows={6} />;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Applications"
        description="Jobs discovered through your searches — track every application from saved to offer."
        action={
          <Badge variant="outline" className={UI_SIZES.badge}>
            {applications.length} tracked
          </Badge>
        }
      />
      <div className="flex flex-col gap-2 px-4 pb-6 lg:px-6">
        {applications.map((app) => (
          <Card key={app._id} className="border border-border/40 bg-muted/5">
            <CardHeader className="flex flex-row items-start justify-between gap-2 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold">{app.title}</span>
                <span className="text-[10px] text-muted-foreground">{app.company}</span>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] capitalize shrink-0"
                style={{ borderColor: STATUS_COLORS[app.status], color: STATUS_COLORS[app.status] }}
              >
                {app.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-3">
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {app.location}
                </span>
                <span>Query: {app.searchQuery}</span>
                {app.appliedAt && (
                  <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-fit h-7 px-0 text-[10px]" asChild>
                <Link href={app.url} target="_blank">
                  View listing <ExternalLink className="ml-1 size-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
