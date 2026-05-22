'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import Loader from '@/components/ui/loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { Brain, Plus, ArrowRight, Briefcase, Calendar } from 'lucide-react';

export default function PreparationsPage() {
  const { fetchPreparations, ensureAuth } = useStudioData();
  const preparations = useAppSelector((s) => s.studio.preparations);
  const loading = useAppSelector((s) => s.studio.loading.preparations);
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applied' | 'interview' | 'rejected' | 'offer'>('all');
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void (async () => {
      const authed = await ensureAuth();
      if (!authed) return;
      try {
        await fetchPreparations();
      } catch {
        toast.error('Failed to load preparations');
      }
    })();
  }, [ensureAuth, fetchPreparations]);

  const filteredPreps = preparations.filter((prep) => {
    if (activeTab === 'all') return true;
    return prep.jobStatus === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'saved', label: 'Saved' },
    { id: 'applied', label: 'Applied' },
    { id: 'interview', label: 'Interview' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'offer', label: 'Offer' }
  ] as const;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Preparations"
        description="Calibrate your interview responses. View generated AI practices tailored to your roles."
        action={
          <Button size="sm" className="h-7 text-[10px] uppercase tracking-widest font-black" asChild>
            <Link href="/studio/preparation/new">
              <Plus className="size-3 mr-1" />
              New Prep
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-12 lg:px-6">
        <div className="flex border-b border-border/20 mb-6 overflow-x-auto scrollbar-none gap-2">
          {tabs.map((tab) => {
            const count = tab.id === 'all'
              ? preparations.length
              : preparations.filter((p) => p.jobStatus === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-[#b5451b] text-foreground font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${
                  activeTab === tab.id ? 'bg-[#b5451b]/10 text-[#b5451b]' : 'bg-muted/10 text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading && preparations.length === 0 ? (
          <Loader />
        ) : filteredPreps.length === 0 ? (
          <Card className="border border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center p-12 text-center">
            <Brain className="size-12 text-muted-foreground mb-4" />
            <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold mb-2">No Prep Sessions Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
              {activeTab === 'all'
                ? "Generate questions customized for your skills, experience, and target jobs."
                : `No prep sessions found with status '${activeTab}'.`}
            </p>
            <Button size="sm" className="h-8 text-[10px] uppercase tracking-widest font-black" asChild>
              <Link href="/studio/preparation/new">
                Create Prep Session
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPreps.map((prep) => {
              const pct = prep.totalCount > 0 ? Math.round((prep.completedCount / prep.totalCount) * 100) : 0;

              return (
                <Card key={prep._id} className="border border-border/40 bg-muted/5 hover:border-border/80 transition-colors flex flex-col justify-between">
                  <CardHeader className="p-5 pb-3 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-black tracking-tight line-clamp-1">
                        {prep.title}
                      </CardTitle>
                      {prep.jobStatus && (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono font-bold uppercase tracking-wider shrink-0"
                        >
                          {prep.jobStatus}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                      <Briefcase className="size-3" /> {prep.role}
                    </span>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 flex flex-col gap-4">
                    {prep.company && (
                      <div className="text-[11px] font-semibold text-foreground line-clamp-1 border-t border-border/10 pt-3">
                        Targeting: <span className="text-[#b5451b]">{prep.company}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 border-t border-border/10 pt-3">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-muted-foreground">PREPARATION PROGRESS</span>
                        <span className="font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-border/20 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#b5451b] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {prep.completedCount} of {prep.totalCount} questions practice-answered
                      </span>
                    </div>

                    <div className="border-t border-border/10 pt-4">
                      <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-wider justify-between" asChild>
                        <Link href={`/studio/preparation/${prep._id}`}>
                          Start Practice Session
                          <ArrowRight className="size-3" />
                        </Link>
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

