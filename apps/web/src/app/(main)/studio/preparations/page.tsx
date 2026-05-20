'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StudioPageHeader } from '@/components/studio/studio-page-header'
import { StudioLoader } from '@/components/studio/studio-loader'
import { useStudioData } from '@/context/studio-data-context'
import { useAppSelector } from '@/store/hooks'
import { UI_SIZES } from '@/lib/constants/theme'
import { toast } from 'sonner'
import { Brain, CheckCircle2, Circle, Plus } from 'lucide-react'

const DIFFICULTY_COLORS = {
  easy: '#4a7c59',
  medium: '#c4922a',
  hard: '#b5451b',
}

export default function PreparationsPage() {
  const { fetchPreparations, createPreparation, answerQuestion } = useStudioData()
  const preparations = useAppSelector((s) => s.studio.preparations)
  const loading = useAppSelector((s) => s.studio.loading.preparations)
  const [role, setRole] = useState('')
  const [activeAnswer, setActiveAnswer] = useState<{ prepId: string; qId: string; text: string } | null>(null)
  const [creating, setCreating] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    void fetchPreparations()
  }, [fetchPreparations])

  const handleCreate = async () => {
    if (!role.trim()) return
    setCreating(true)
    try {
      await createPreparation(role.trim())
      setRole('')
      toast.success('AI interview prep session created')
    } catch {
      toast.error('Failed to create prep session')
    } finally {
      setCreating(false)
    }
  }

  const handleAnswer = async () => {
    if (!activeAnswer) return
    try {
      await answerQuestion(activeAnswer.prepId, activeAnswer.qId, activeAnswer.text)
      setActiveAnswer(null)
      toast.success('Answer saved')
    } catch {
      toast.error('Failed to save answer')
    }
  }

  if (loading && preparations.length === 0) return <StudioLoader rows={6} />

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Preparations"
        description="Practice interviews with AI-generated questions tailored to your target role."
        action={
          <div className="flex items-center gap-2">
            <Input
              className="h-7 w-40 text-xs"
              placeholder="Target role…"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Button size="sm" className="h-7 text-[10px]" onClick={handleCreate} disabled={creating || !role.trim()}>
              <Plus className="size-3 mr-1" />
              New Session
            </Button>
          </div>
        }
      />
      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-6">
        {preparations.map((prep) => (
          <Card key={prep._id} className="border border-border/40 bg-muted/5">
            <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold">{prep.title}</span>
                <span className="text-[10px] text-muted-foreground">{prep.role}</span>
              </div>
              <Badge variant="outline" className={UI_SIZES.badge}>
                <Brain className="size-3 mr-1" />
                {prep.completedCount}/{prep.totalCount}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4">
              {prep.questions.map((q) => (
                <div key={q._id} className="flex flex-col gap-2 border-b border-border/20 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    {q.answered ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#4a7c59] mt-0.5" />
                    ) : (
                      <Circle className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="text-xs">{q.question}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px]">{q.category}</Badge>
                        <Badge
                          variant="outline"
                          className="text-[9px] capitalize"
                          style={{ color: DIFFICULTY_COLORS[q.difficulty], borderColor: DIFFICULTY_COLORS[q.difficulty] }}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      {q.userAnswer && (
                        <p className="text-[10px] text-muted-foreground mt-1">{q.userAnswer}</p>
                      )}
                    </div>
                  </div>
                  {!q.answered && (
                    activeAnswer?.qId === q._id ? (
                      <div className="flex flex-col gap-2 ml-5">
                        <Textarea
                          className="text-xs min-h-16"
                          value={activeAnswer.text}
                          onChange={(e) => setActiveAnswer({ ...activeAnswer, text: e.target.value })}
                          placeholder="Type your answer…"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-[10px]" onClick={handleAnswer}>Submit</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setActiveAnswer(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] ml-5 w-fit"
                        onClick={() => setActiveAnswer({ prepId: prep._id, qId: q._id, text: '' })}
                      >
                        Practice Answer
                      </Button>
                    )
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
