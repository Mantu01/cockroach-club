'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useStudioData } from '@/context/studio-data-context';
import { PreparationItem } from '@/lib/api';

const DIFFICULTY_COLORS = {
  easy: '#4a7c59',
  medium: '#c4922a',
  hard: '#b5451b',
};

export default function PreparationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchPreparationById, answerQuestion, ensureAuth } = useStudioData();

  const id = params.id as string;
  const [prep, setPrep] = useState<PreparationItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetched = useRef(false);

  const loadData = async () => {
    try {
      const item = await fetchPreparationById(id);
      setPrep(item);
    } catch {
      toast.error('Failed to load prep session details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || fetched.current) return;
    fetched.current = true;
    void (async () => {
      const authed = await ensureAuth();
      if (!authed) return;
      await loadData();
    })();
  }, [id, ensureAuth, fetchPreparationById]);

  const handleToggleExpand = (qId: string, currentAnswer?: string) => {
    if (expandedQuestionId === qId) {
      setExpandedQuestionId(null);
      setAnswerText('');
    } else {
      setExpandedQuestionId(qId);
      setAnswerText(currentAnswer || '');
    }
  };

  const handleSubmitAnswer = async (qId: string) => {
    if (!answerText.trim()) {
      toast.error('Answer text cannot be empty');
      return;
    }
    setSubmittingId(qId);
    try {
      await answerQuestion(id, qId, answerText.trim());
      toast.success('Answer saved');
      await loadData();
      setExpandedQuestionId(null);
      setAnswerText('');
    } catch {
      toast.error('Failed to save answer');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  if (!prep) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <Brain className="size-12 text-muted-foreground mb-4" />
        <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold mb-2">Prep Session Not Found</h3>
        <p className="text-xs text-muted-foreground mb-6">
          The requested interview preparation could not be retrieved.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/studio/preparations">Back to Prep List</Link>
        </Button>
      </div>
    );
  }

  const completionPct = prep.totalCount > 0 ? Math.round((prep.completedCount / prep.totalCount) * 100) : 0;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Interactive Practice"
        description="Write, refine, and commit your answers to master the target role."
        action={
          <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-widest font-black" asChild>
            <Link href="/studio/preparations">
              <ArrowLeft className="size-3 mr-1" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-12 lg:px-6 max-w-4xl flex flex-col gap-6">
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="p-5 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight">
                  {prep.title}
                </CardTitle>
                <CardDescription className="text-xs flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Role: <strong className="text-foreground">{prep.role}</strong></span>
                  {prep.company && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span>Company: <strong className="text-foreground">{prep.company}</strong></span>
                    </>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Badge variant="outline" className="h-6 font-bold text-[#b5451b] border-[#b5451b]/40 bg-[#b5451b]/5">
                  {prep.completedCount} / {prep.totalCount} Completed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-muted-foreground uppercase tracking-widest">Calibration progress</span>
              <span className="font-bold text-[#b5451b]">{completionPct}%</span>
            </div>
            <div className="w-full bg-border/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#b5451b] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
            Questions Checklist
          </h2>

          {prep.questions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q._id;

            return (
              <Card
                key={q._id}
                className={`border transition-all ${
                  isExpanded ? 'border-border bg-muted/10' : 'border-border/40 bg-muted/5 hover:border-border/80'
                }`}
              >
                <div
                  className="p-4 cursor-pointer flex items-start justify-between gap-4"
                  onClick={() => handleToggleExpand(q._id, q.userAnswer)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 shrink-0">
                      {q.answered ? (
                        <CheckCircle2 className="size-4 text-[#4a7c59] fill-[#4a7c59]/10" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-mono text-muted-foreground/60 uppercase">
                        Question #{idx + 1}
                      </span>
                      <p className="text-xs font-semibold leading-relaxed text-foreground">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px] uppercase tracking-wider py-0 px-1.5 h-4 font-mono font-normal">
                          {q.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[9px] uppercase tracking-wider py-0 px-1.5 h-4 font-mono font-bold"
                          style={{
                            color: DIFFICULTY_COLORS[q.difficulty],
                            borderColor: `${DIFFICULTY_COLORS[q.difficulty]}30`,
                            backgroundColor: `${DIFFICULTY_COLORS[q.difficulty]}05`
                          }}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-muted-foreground shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/10 pt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`answer-${q._id}`} className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Your Professional Response
                      </label>
                      <Textarea
                        id={`answer-${q._id}`}
                        rows={5}
                        placeholder="Calibrate your reply here. Focus on metrics, STAR method, and target skills."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="text-xs leading-relaxed resize-none bg-background/50"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[10px] font-mono uppercase tracking-wider"
                        onClick={() => handleToggleExpand(q._id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-[10px] font-mono uppercase tracking-wider bg-[#b5451b] hover:bg-[#b5451b]/90 text-white"
                        onClick={() => handleSubmitAnswer(q._id)}
                        disabled={submittingId === q._id}
                      >
                        {submittingId === q._id ? 'Saving...' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>
                )}

                {!isExpanded && q.answered && q.userAnswer && (
                  <div className="mx-4 mb-4 p-3 rounded bg-background/40 border border-border/20">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase block mb-1">
                      SAVED ANSWER
                    </span>
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                      "{q.userAnswer}"
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
