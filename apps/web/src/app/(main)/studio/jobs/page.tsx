'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { ExternalLink, MapPin } from 'lucide-react';
import { sourceImg } from '@/components/auth/jobSources-image';

export default function JobsPage() {
  const { fetchJobs } = useStudioData();
  const jobs = useAppSelector((s) => s.studio.jobs);
  const loading = useAppSelector((s) => s.studio.loading.jobs);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchJobs();
  }, [fetchJobs]);

  const formatScrapedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading && jobs.length === 0) return <StudioLoader rows={8} />;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Jobs"
        description="Previously scraped openings from across the internet — your job radar feed."
        action={
          <Badge variant="outline" className={UI_SIZES.badge}>
            {jobs.length} scraped
          </Badge>
        }
      />
      <div className="flex flex-col gap-2 px-4 pb-6 lg:px-6">
        {jobs.map((job) => (
          <Card key={job._id} className="border border-border/40 bg-muted/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                {sourceImg[job.source as keyof typeof sourceImg] ? (
                  <Image
                    src={sourceImg[job.source as keyof typeof sourceImg]}
                    alt={`${job.source} logo`}
                    width={32}
                    height={32}
                    className="rounded-full bg-muted object-cover size-8 shrink-0"
                  />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-muted shrink-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {job.source?.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold leading-tight">{job.title}</span>
                    <Badge variant="outline" className="text-[8px] tracking-wider uppercase h-4 px-1">
                      {job.source}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="size-2.5" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span className="text-[9px] text-muted-foreground/80 font-mono">
                      {formatScrapedDate(job.scrapedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 self-end md:self-center">
                <Button variant="outline" size="sm" className="h-6 text-[9px] tracking-wider uppercase" asChild>
                  <Link href={`/studio/jobs/${job._id}`}>Details</Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-muted-foreground hover:text-foreground tracking-wider uppercase" asChild>
                  <Link href={job.url} target="_blank">
                    Link <ExternalLink className="ml-1 size-2.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
