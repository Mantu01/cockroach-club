'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
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
            <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                {sourceImg[job.source as keyof typeof sourceImg] ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={sourceImg[job.source as keyof typeof sourceImg]}
                      alt={`${job.source} logo`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      {job.source?.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold">{job.title}</span>
                  <span className="text-[10px] text-muted-foreground">{job.company}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] shrink-0">
                {job.source}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-3">
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {job.location}
                </span>
                {job.salary && <span>{job.salary}</span>}
                <span>{job.type}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {job.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/studio/jobs/${job._id}`}>View details</Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
                  <Link href={job.url} target="_blank">
                    Open listing <ExternalLink className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
