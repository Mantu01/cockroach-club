'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useStudioData } from '@/context/studio-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import { Plus, FileText, Download, Trash2, ArrowRight } from 'lucide-react';
import { ResumeItem } from '@/lib/api';

export default function ResumePage() {
  const { fetchResumes, deleteResume, compileResume, ensureAuth } = useStudioData();
  const resumes = useAppSelector((s) => s.studio.resumes);
  const loading = useAppSelector((s) => s.studio.loading.resumes);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void (async () => {
      const authed = await ensureAuth();
      if (!authed) return;
      try {
        await fetchResumes();
      } catch {
        toast.error('Failed to load resumes');
      }
    })();
  }, [ensureAuth, fetchResumes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);
      toast.success('Resume deleted successfully');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const handleDownloadPDF = async (resume: ResumeItem) => {
    setDownloadingId(resume._id);
    try {
      const blob = await compileResume(resume.latex);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch {
      toast.error('Failed to compile LaTeX to PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Resume Forge"
        description="Compile, edit, and tailor multiple LaTeX resumes for your job applications."
        action={
          <Button size="sm" className="h-7 text-[10px] uppercase tracking-widest font-black" asChild>
            <Link href="/studio/resume/new">
              <Plus className="size-3 mr-1" />
              New Resume
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-6 lg:px-6">
        {loading && resumes.length === 0 ? (
          <Loader />
        ) : resumes.length === 0 ? (
          <Card className="border border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center p-12 text-center">
            <FileText className="size-12 text-muted-foreground mb-4" />
            <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold mb-2">No Resumes Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Create your first ATS-optimized LaTeX resume. Tailor it to a job or make a generic one.
            </p>
            <Button size="sm" className="h-8 text-[10px] uppercase tracking-widest font-black" asChild>
              <Link href="/studio/resume/new">
                Create First Resume
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => {
              const dateStr = new Date(resume.createdAt).toLocaleDateString();
              const isHigh = resume.atsScore >= 85;
              const isMedium = resume.atsScore >= 75 && resume.atsScore < 85;

              return (
                <Card key={resume._id} className="border border-border/40 bg-muted/5 hover:border-border/80 transition-colors flex flex-col justify-between">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-black tracking-tight line-clamp-1">
                          {resume.title}
                        </CardTitle>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Created: {dateStr}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">ATS Score</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                            isHigh ? 'text-[#4a7c59] border-[#4a7c59]/50 bg-[#4a7c59]/5' :
                            isMedium ? 'text-[#c4922a] border-[#c4922a]/50 bg-[#c4922a]/5' :
                            'text-[#b5451b] border-[#b5451b]/50 bg-[#b5451b]/5'
                          }`}
                        >
                          {resume.atsScore}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex flex-col gap-4">
                    {resume.jobTitle ? (
                      <div className="flex flex-col gap-1 border-t border-border/20 pt-3">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Target Application</span>
                        <div className="text-[11px] font-semibold text-foreground line-clamp-1">
                          {resume.jobTitle} <span className="text-muted-foreground">at</span> {resume.company}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 border-t border-border/20 pt-3">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Target Application</span>
                        <div className="text-[11px] text-muted-foreground italic">
                          Generic Resume
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 border-t border-border/20 pt-4">
                      <Button size="sm" className="flex-1 h-8 text-[10px] font-bold uppercase tracking-wider justify-between" asChild>
                        <Link href={`/studio/resumes/${resume._id}`}>
                          Open Workspace
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={downloadingId === resume._id}
                        onClick={() => handleDownloadPDF(resume)}
                      >
                        <Download className="size-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-[#b5451b]/10 hover:text-[#b5451b] hover:border-[#b5451b]/50"
                        onClick={() => handleDelete(resume._id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
