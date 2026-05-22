'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [filter, setFilter] = useState<'all' | 'applied' | 'rejected'>('all');

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchApplications();
  }, [fetchApplications]);

  if (loading && applications.length === 0) return <StudioLoader rows={6} />;

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

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
      <div className="flex border-b border-border/20 px-4 mb-6 lg:px-6 gap-6 text-[10px] font-mono tracking-wider uppercase">
        {(['all', 'applied', 'rejected'] as const).map((t) => {
          const isActive = filter === t;
          const count = t === 'all' ? applications.length : applications.filter((a) => a.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`pb-2 border-b-2 transition-all hover:text-foreground ${
                isActive
                  ? 'border-[#b5451b] text-foreground font-bold'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 px-4 pb-6 lg:px-6">
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/40 rounded-lg bg-muted/5 text-center">
            <span className="text-xs font-mono text-muted-foreground uppercase">No {filter} applications found</span>
          </div>
        ) : (
          filteredApplications.map((app) => (
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
          ))
        )}
      </div>
    </div>
  );
}
