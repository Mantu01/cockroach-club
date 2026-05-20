'use client'

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { studioApi } from '@/lib/api';
import { sourceImg } from '@/components/auth/jobSources-image';
import { useAppSelector } from '@/store/hooks';
import { MapPin, ExternalLink, Sparkles, ClipboardList, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const profile = useAppSelector((state) => state.studio.profile);
  const [job, setJob] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    studioApi
      .getJob(jobId)
      .then(({ data }) => {
        setJob(data.job);
        setApplication(data.application);
      })
      .catch(() => toast.error('Unable to load job details'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const matchedSkills = useMemo(() => {
    if (!profile?.skills || !job?.skills) return [];
    return job.skills.filter((skill: string) => profile.skills.includes(skill));
  }, [job, profile]);

  const matchScore = useMemo(() => {
    if (!job?.skills || job.skills.length === 0) return 0;
    return Math.min(100, Math.round((matchedSkills.length / job.skills.length) * 100));
  }, [job, matchedSkills]);

  const interviewQuestions = useMemo(() => {
    if (!job) return [];
    const base = job.title || 'This role';
    return [
      `Describe your experience working on systems similar to ${base}.`,
      `How would you demonstrate your expertise with ${matchedSkills.slice(0, 3).join(', ')} in an interview?`,
      `What is your approach to solving the biggest technical challenge in a ${base} role?`,
    ];
  }, [job, matchedSkills]);

  const handleAction = async (action: 'apply' | 'review' | 'discard') => {
    if (!jobId) return;
    setActionLoading(true);
    try {
      const { data } = await studioApi.updateJobAction(jobId, action);
      setApplication(data.application);
      toast.success(`Job ${action === 'apply' ? 'applied' : action === 'review' ? 'marked for review' : 'discarded'}`);
    } catch {
      toast.error('Unable to update job status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    setResumeLoading(true);
    try {
      await studioApi.generateResume();
      toast.success('Resume generated using your profile and this job details.');
    } catch {
      toast.error('Unable to generate resume');
    } finally {
      setResumeLoading(false);
    }
  };

  if (loading) {
    return <StudioPageHeader title="Job details" description="Loading the job and your profile match�" />;
  }

  if (!job) {
    return (
      <div className="flex flex-1 flex-col px-4 pb-6 lg:px-6">
        <p className="text-sm text-muted-foreground">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title={job.title}
        description={job.company}
        action={
          <Badge variant="outline" className="text-[10px]">
            {application?.status ?? 'Not saved'}
          </Badge>
        }
      />
      <div className="grid gap-3 px-4 pb-6 lg:px-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="flex flex-col gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                {sourceImg[job.source] ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <Image src={sourceImg[job.source]} alt={`${job.source} logo`} fill sizes="48px" className="object-cover" />
                  </div>
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">{job.source?.slice(0, 2)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{job.company}</p>
                  <p className="text-[10px] text-muted-foreground">{job.location}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Type</p>
                  <p className="text-sm">{job.type || 'Full-time'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Posted</p>
                  <p className="text-sm">{job.postedAt ? new Date(job.postedAt).toDateString() : 'Unknown'}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Job details</p>
                <p className="text-[10px] text-muted-foreground">Key details for the job and company fit.</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
                <Link href={job.url} target="_blank">
                  Open listing <ExternalLink className="ml-1 size-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {job.description ? <p className="text-[12px] leading-relaxed text-muted-foreground">{job.description}</p> : <p className="text-[12px] text-muted-foreground">No description available.</p>}
              <div className="grid gap-2 sm:grid-cols-2">
                {job.skills?.length ? (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-[9px] px-1.5 py-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                {job.experienceLevel ? (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Experience</p>
                    <p className="text-sm">{job.experienceLevel}</p>
                  </div>
                ) : null}
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Source</p>
                  <p className="text-sm">{job.source}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Location</p>
                  <p className="text-sm">{job.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Salary</p>
                  <p className="text-sm">{job.salary || 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Your actions</p>
                <p className="text-[10px] text-muted-foreground">Choose how you want to move this opportunity.</p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="h-8 text-[10px]" onClick={() => handleAction('apply')} disabled={actionLoading}>
                  Apply
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => handleAction('review')} disabled={actionLoading}>
                  Review
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => handleAction('discard')} disabled={actionLoading}>
                  Discard
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Current status: {application?.status || 'not tracked'}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Profile match</p>
                <p className="text-[10px] text-muted-foreground">A quick comparison between your skills and this opening.</p>
              </div>
              <Badge variant="outline">{matchScore}%</Badge>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Sparkles className="size-4" />
                  <span>{matchedSkills.length} matching skill{matchedSkills.length === 1 ? '' : 's'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-[9px] px-1.5 py-0">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground">No clear skill overlap found yet.</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Experience summary</p>
                <p className="text-sm">{profile?.experience?.[0]?.role ? `${profile.experience[0].role} at ${profile.experience[0].company}` : 'Update your profile to improve this match.'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3">
              <p className="text-sm font-semibold">Build resume</p>
              <p className="text-[10px] text-muted-foreground">Regenerate your resume with this role in mind.</p>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <p className="text-[10px] leading-relaxed text-muted-foreground">Use your profile to create an application-ready resume that better fits this listing.</p>
              <Button size="sm" className="h-8 text-[10px]" onClick={handleGenerateResume} disabled={resumeLoading}>
                {resumeLoading ? 'Generating�' : 'Generate resume'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3">
              <p className="text-sm font-semibold">Interview prep</p>
              <p className="text-[10px] text-muted-foreground">Questions tailored to this role and your profile.</p>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {interviewQuestions.map((question, index) => (
                <div key={index} className="space-y-1 rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Question {index + 1}</p>
                  <p className="text-sm">{question}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
