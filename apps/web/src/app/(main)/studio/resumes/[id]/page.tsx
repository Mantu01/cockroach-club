'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStudioData } from '@/context/studio-data-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Download,
  Edit2,
  Check,
  FileText
} from 'lucide-react';
import { ResumeItem } from '@/lib/api';

export default function ResumeWorkspacePage() {
  const params = useParams();
  const { fetchResumeById, updateResume, compileResume, editResumeWithAI, ensureAuth } = useStudioData();

  const id = params.id as string;
  const [resume, setResume] = useState<ResumeItem | null>(null);
  const [latex, setLatex] = useState('');
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiApplying, setAiApplying] = useState(false);

  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fetched = useRef(false);

  useEffect(() => {
    if (!id || fetched.current) return;
    fetched.current = true;
    void (async () => {
      const authed = await ensureAuth();
      if (!authed) return;
      try {
        const item = await fetchResumeById(id);
        setResume(item);
        setLatex(item.latex);
        setTitle(item.title);
        await handleCompile(item.latex);
      } catch {
        toast.error('Failed to load resume workspace');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, ensureAuth, fetchResumeById]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleCompile = async (sourceCode: string) => {
    setCompiling(true);
    try {
      const blob = await compileResume(sourceCode);
      const url = URL.createObjectURL(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      toast.success('LaTeX compiled successfully');
    } catch {
      toast.error('Failed to compile LaTeX. Please check your syntax.');
    } finally {
      setCompiling(false);
    }
  };

  const handleAiModify = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI editing.');
      return;
    }
    if (!resume) return;

    setAiApplying(true);
    try {
      const updatedLatex = await editResumeWithAI(latex, aiPrompt.trim());
      setLatex(updatedLatex);
      toast.success('AI applied your LaTeX update. Recompiling now...');
      await handleCompile(updatedLatex);
    } catch {
      toast.error('AI edit failed. Please try again with a simpler instruction.');
    } finally {
      setAiApplying(false);
    }
  };

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      const updated = await updateResume(id, { title, latex });
      setResume(updated);
      toast.success('Resume workspace saved');
    } catch {
      toast.error('Failed to save resume changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) {
      toast.error('Please compile the PDF first');
      return;
    }
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${title.replace(/\s+/g, '_')}.pdf`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <FileText className="size-12 text-muted-foreground mb-4" />
        <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold mb-2">Resume Not Found</h3>
        <p className="text-xs text-muted-foreground mb-6">
          The requested resume could not be retrieved.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/studio/resume">Back to Resume List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <div className="border-b border-border/40 bg-muted/5 px-4 py-3 lg:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-7 w-7 p-0" asChild>
            <Link href="/studio/resume">
              <ArrowLeft className="size-3.5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-7 text-xs font-bold py-0 w-48 lg:w-64"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsEditingTitle(false)}
                >
                  <Check className="size-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-sm lg:text-base font-black uppercase tracking-tight">
                  {title}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit2 className="size-2.5" />
                </Button>
              </div>
            )}
            {resume.jobTitle && (
              <span className="text-[9px] font-mono text-muted-foreground uppercase border border-border/40 px-1.5 py-0.5 rounded">
                Tailored for {resume.company}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-mono uppercase tracking-wider"
            onClick={() => handleCompile(latex)}
            disabled={compiling}
          >
            <RefreshCw className={`size-3 mr-1 ${compiling ? 'animate-spin' : ''}`} />
            {compiling ? 'Compiling...' : 'Compile'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-mono uppercase tracking-wider"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="size-3 mr-1" />
            {saving ? 'Saving...' : 'Save Code'}
          </Button>

          <Button
            size="sm"
            className="h-7 text-[10px] font-mono uppercase tracking-wider bg-[#b5451b] hover:bg-[#b5451b]/90 text-white"
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <Download className="size-3 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-border/40 overflow-hidden h-full">
          <div className="bg-muted/10 border-b border-border/20 px-3 py-1 flex justify-between items-center shrink-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              LaTeX Source Code Editor
            </span>
          </div>
          <div className="flex-1 p-2 bg-background/50 h-full overflow-hidden">
            <textarea
              className="w-full h-full p-4 bg-[#0a0a0c] text-foreground font-mono text-xs leading-relaxed resize-none outline-none border border-border/20 focus:border-[#b5451b]/50 rounded-lg overflow-y-auto"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col overflow-hidden h-full bg-[#111113]">
          <div className="bg-muted/10 border-b border-border/20 px-3 py-1 flex justify-between items-center shrink-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              PDF Live Preview Workspace
            </span>
          </div>
          <div className="flex-1 p-2 h-full overflow-hidden flex items-center justify-center relative">
            {compiling && (
              <div className="absolute inset-0 bg-[#111113]/85 flex flex-col items-center justify-center gap-2 z-10">
                <Loader />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider animate-pulse">
                  Recompiling LaTeX Template...
                </span>
              </div>
            )}
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0 rounded-lg bg-white"
              />
            ) : (
              <div className="text-center p-6">
                <FileText className="size-10 text-muted-foreground/30 mx-auto mb-2" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Click Compile to view layout preview
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border/20 bg-muted/5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              AI prompt to modify your LaTeX
            </label>
            <textarea
              className="mt-2 w-full min-h-[120px] rounded-lg border border-border/20 bg-background p-3 text-xs font-mono text-foreground outline-none focus:border-[#b5451b]/50"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="For example: Update the contact section, add a skills table, or change the section order."
            />
          </div>

          <div className="flex flex-col gap-2 sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="h-10 px-4 text-[10px] font-mono uppercase tracking-wider"
              onClick={handleAiModify}
              disabled={aiApplying || !aiPrompt.trim()}
            >
              {aiApplying ? 'Applying...' : 'AI Edit & Compile'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 text-[10px] font-mono uppercase tracking-wider"
              onClick={() => setAiPrompt('')}
            >
              Clear Prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
