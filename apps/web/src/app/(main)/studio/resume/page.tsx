'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { StudioPageHeader } from '@/components/studio/studio-page-header'
import { useStudioData } from '@/context/studio-data-context'
import { UI_SIZES } from '@/lib/constants/theme'
import { toast } from 'sonner'
import { Download, FileText, Sparkles } from 'lucide-react'
import { studioApi } from '@/lib/api'

export default function ResumePage() {
  const { generateResume, ensureAuth } = useStudioData()
  const [latex, setLatex] = useState('')
  const [template, setTemplate] = useState('modern')
  const [generating, setGenerating] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    void (async () => {
      const authed = await ensureAuth()
      if (!authed) return
      try {
        const { data } = await studioApi.getResume()
        if (data.resume?.latex) setLatex(data.resume.latex)
        if (data.resume?.template) setTemplate(data.resume.template)
      } catch {
        toast.error('Failed to load resume')
      }
    })()
  }, [ensureAuth])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const response = await generateResume(template) as { data: { resume: { latex: string } } }
      setLatex(response.data.resume.latex)
      toast.success('Resume generated from profile data')
    } catch {
      toast.error('Failed to generate resume')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.tex'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('LaTeX file downloaded — compile to PDF with your LaTeX editor')
  }

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Resume"
        description="Generate ATS-optimized resumes from your profile — LaTeX source compiled to PDF."
        action={
          <div className="flex items-center gap-2">
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger className="h-7 w-28 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern" className="text-xs">Modern</SelectItem>
                <SelectItem value="classic" className="text-xs">Classic</SelectItem>
                <SelectItem value="minimal" className="text-xs">Minimal</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-7 text-[10px]" onClick={handleGenerate} disabled={generating}>
              <Sparkles className="size-3 mr-1" />
              {generating ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 lg:grid-cols-3 lg:px-6">
        <Card className="border border-border/40 bg-muted/5 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>LaTeX Source</span>
            <Badge variant="outline" className={UI_SIZES.badge}>
              <FileText className="size-3 mr-1" />
              .tex
            </Badge>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Textarea
              className="min-h-[400px] font-mono text-[10px] leading-relaxed"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="Click Generate to create LaTeX from your profile data…"
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3">
              <span className={UI_SIZES.sectionLabel}>Export</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" className="h-8 text-[10px] justify-start" onClick={handleDownload} disabled={!latex}>
                <Download className="size-3 mr-2" />
                Download .tex file
              </Button>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Compile the LaTeX source with pdflatex or an online editor like Overleaf to produce your PDF resume.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3">
              <span className={UI_SIZES.sectionLabel}>Tips</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4 text-[10px] text-muted-foreground leading-relaxed">
              <p>Update your profile first for the best generated output.</p>
              <p>Use keyword-dense skills matching your target roles.</p>
              <p>Keep experience descriptions concise and quantified.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
