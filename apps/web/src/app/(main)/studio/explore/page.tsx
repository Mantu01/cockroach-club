'use client';

import { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { sourceImg } from '@/components/auth/jobSources-image';
import {
  Search,
  MapPin,
  Building,
  Tag,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { toast } from 'sonner';

function ExploreContent() {
  const searchParams = useSearchParams();
  const shareIdParam = searchParams?.get('share');

  const { fetchExploreJobs, shareJob, getJobByShareId, fetchProfile } = useStudioData();
  const profile = useAppSelector((s) => s.studio.profile);
  const exploreJobs = useAppSelector((s) => s.studio.exploreJobs);
  const exploreTotal = useAppSelector((s) => s.studio.exploreTotal);
  const loading = useAppSelector((s) => s.studio.loading.exploreJobs);

  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [tag, setTag] = useState('');
  const [remote, setRemote] = useState('all');
  const [page, setPage] = useState(1);

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const fetched = useRef(false);

  const fetchJobsWithFilters = (pageNum = 1) => {
    const params: any = {
      page: String(pageNum),
      limit: '20',
    };
    if (q) params.q = q;
    if (location) params.location = location;
    if (company) params.company = company;
    if (tag) params.tag = tag;
    if (remote !== 'all') params.remote = remote;

    void fetchExploreJobs(params);
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchProfile();
    fetchJobsWithFilters(1);
  }, [fetchProfile]);

  useEffect(() => {
    if (shareIdParam) {
      void getJobByShareId(shareIdParam)
        .then((job) => {
          if (job) {
            setSelectedJob(job);
            setIsMobileDetailOpen(true);
          }
        })
        .catch(() => {
          toast.error('Unable to retrieve shared job details');
        });
    }
  }, [shareIdParam, getJobByShareId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobsWithFilters(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const nextP = page - 1;
      setPage(nextP);
      fetchJobsWithFilters(nextP);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(exploreTotal / 20)) {
      const nextP = page + 1;
      setPage(nextP);
      fetchJobsWithFilters(nextP);
    }
  };

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setIsMobileDetailOpen(true);
  };

  const handleShare = async (jobId: string) => {
    setShareLoading(true);
    try {
      const data = await shareJob(jobId);
      if (data?.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch {
      toast.error('Unable to generate share link');
    } finally {
      setShareLoading(false);
    }
  };

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

  const matchedSkills = useMemo(() => {
    if (!profile?.skills || !selectedJob?.skills) return [];
    return selectedJob.skills.filter((skill: string) => profile.skills.includes(skill));
  }, [selectedJob, profile]);

  const matchScore = useMemo(() => {
    if (!selectedJob?.skills || selectedJob.skills.length === 0) return 0;
    return Math.min(100, Math.round((matchedSkills.length / selectedJob.skills.length) * 100));
  }, [selectedJob, matchedSkills]);

  const detailViewContent = (job: any) => {
    if (!job) return null;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {sourceImg[job.source as keyof typeof sourceImg] ? (
              <Image
                src={sourceImg[job.source as keyof typeof sourceImg]}
                alt={`${job.source} logo`}
                width={40}
                height={40}
                className="rounded-full bg-muted object-cover size-10 shrink-0"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-muted shrink-0">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {job.source?.slice(0, 2)}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{job.title}</span>
              <span className="text-xs text-muted-foreground">{job.company}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-b border-border/10 py-2">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {job.location}
            </span>
            {job.salary && <span>{job.salary}</span>}
            <span>{job.type}</span>
            <span className="text-[10px] text-muted-foreground/80 font-mono">
              Scraped: {formatScrapedDate(job.scrapedAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-7 text-[10px] tracking-widest uppercase"
            onClick={async () => {
              setActionLoading(true);
              try {
                await shareJob(job._id);
                toast.success('Job marked as applied');
              } catch {
                toast.error('Unable to apply');
              } finally {
                setActionLoading(false);
              }
            }}
            disabled={actionLoading}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] tracking-widest uppercase"
            onClick={() => handleShare(job._id)}
            disabled={shareLoading}
          >
            <Share2 className="size-3 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
            <Link href={job.url} target="_blank">
              Open Original <ExternalLink className="ml-1 size-3" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Card className="border border-border/40 bg-muted/5">
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Match Score</span>
                <Badge variant="outline">{matchScore}%</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Sparkles className="size-3.5" />
                <span>{matchedSkills.length} matching skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-[8px] px-1 py-0">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[10px] text-muted-foreground">No overlapping skills.</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <div className="p-3 space-y-2">
              <span className="text-xs font-semibold">Quick Actions</span>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Instantly adjust your resume parameters for this role.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[9px] w-full"
                onClick={async () => {
                  setResumeLoading(true);
                  try {
                    await shareJob(job._id);
                    toast.success('Draft saved in Resume Builder');
                  } catch {
                    toast.error('Unable to build resume');
                  } finally {
                    setResumeLoading(false);
                  }
                }}
                disabled={resumeLoading}
              >
                Draft Resume
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold">Job Description</span>
          <div className="rounded-lg border border-border/30 bg-background/50 p-3 max-h-[300px] overflow-y-auto">
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
              {job.description || 'No description provided by source.'}
            </p>
          </div>
        </div>

        {job.skills?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold">Required Skills</span>
            <div className="flex flex-wrap gap-1">
              {job.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-[9px] px-1.5 py-0.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const totalPages = Math.ceil(exploreTotal / 20);

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <StudioPageHeader
        title="Explore"
        description="Search and filter through the complete database of scraped job listings."
        action={
          <Badge variant="outline" className={UI_SIZES.badge}>
            {exploreTotal} available
          </Badge>
        }
      />

      <div className="flex flex-1 overflow-hidden px-4 pb-6 lg:px-6 gap-4">
        <div className="flex flex-col w-full md:w-[380px] shrink-0 gap-3 overflow-y-auto pr-1">
          <Card className="border border-border/40 bg-muted/5 shrink-0">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 p-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                Search Filters
              </span>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 text-xs"
                    placeholder="Keyword (title, skill…)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 text-xs"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 text-xs"
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 text-xs"
                    placeholder="Tag / Skill"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {['all', 'true', 'false'].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={remote === option ? 'default' : 'outline'}
                      className="h-6 text-[9px] px-1 capitalize"
                      onClick={() => setRemote(option)}
                    >
                      {option === 'all' ? 'All' : option === 'true' ? 'Remote' : 'On-Site'}
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit" size="sm" className="h-7 text-[9px] w-full uppercase tracking-wider">
                Apply Filters
              </Button>
            </form>
          </Card>

          <div className="flex flex-col gap-2 flex-1">
            {loading && exploreJobs.length === 0 ? (
              <StudioLoader rows={5} />
            ) : (
              <div className="flex flex-col gap-2">
                {exploreJobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJob(job)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedJob?._id === job._id
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/40 bg-muted/5 hover:bg-muted/10'
                    }`}
                  >
                    {sourceImg[job.source as keyof typeof sourceImg] ? (
                      <Image
                        src={sourceImg[job.source as keyof typeof sourceImg]}
                        alt={`${job.source} logo`}
                        width={28}
                        height={28}
                        className="rounded-full bg-muted object-cover size-7 shrink-0"
                      />
                    ) : (
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-muted shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {job.source?.slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-xs font-semibold leading-tight truncate">{job.title}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{job.company}</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-muted-foreground/80 mt-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{formatScrapedDate(job.scrapedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {exploreJobs.length === 0 && (
                  <span className="text-xs text-muted-foreground text-center py-4">No jobs found matching criteria.</span>
                )}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/10 pt-3 mt-1 shrink-0 px-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-[10px] font-mono text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-1 flex-col overflow-y-auto border border-border/40 bg-muted/5 rounded-xl p-4">
          {selectedJob ? (
            detailViewContent(selectedJob)
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-2">
              <ClipboardCheck className="size-8 text-muted-foreground/45" />
              <span className="text-xs text-muted-foreground">Select a job from the list to view full details.</span>
            </div>
          )}
        </div>
      </div>

      <Sheet open={isMobileDetailOpen} onOpenChange={setIsMobileDetailOpen}>
        <SheetContent side="right" className="w-[85vw] sm:w-[500px] overflow-y-auto p-4 flex flex-col gap-4">
          {detailViewContent(selectedJob)}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<StudioLoader rows={8} />}>
      <ExploreContent />
    </Suspense>
  );
}
