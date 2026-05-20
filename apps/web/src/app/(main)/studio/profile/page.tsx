'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StudioPageHeader } from '@/components/studio/studio-page-header'
import { StudioLoader } from '@/components/studio/studio-loader'
import { useStudioData } from '@/context/studio-data-context'
import { useAppSelector } from '@/store/hooks'
import { UI_SIZES } from '@/lib/constants/theme'
import type { UserProfile } from '@/lib/api'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

const emptyProfile: UserProfile = {
  fullName: '',
  headline: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
}

export default function StudioProfilePage() {
  const { fetchProfile, updateProfile } = useStudioData()
  const profile = useAppSelector((s) => s.studio.profile)
  const loading = useAppSelector((s) => s.studio.loading.profile)
  const [form, setForm] = useState<UserProfile>(emptyProfile)
  const [saving, setSaving] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    void fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      const skills = form.skills.length ? form.skills : (form as UserProfile & { skillsInput?: string }).skillsInput?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
      await updateProfile({ ...form, skills })
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !profile) return <StudioLoader rows={8} />

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Profile"
        description="Professional data used across all your job applications."
        action={
          <Button size="sm" className="h-7 text-[10px] tracking-widest uppercase" onClick={handleSave} disabled={saving}>
            <Save className="size-3 mr-1" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 lg:grid-cols-2 lg:px-6">
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Basic Info</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Full Name</Label>
              <Input className="h-8 text-xs" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Headline</Label>
              <Input className="h-8 text-xs" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Phone</Label>
                <Input className="h-8 text-xs" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Location</Label>
                <Input className="h-8 text-xs" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Summary</Label>
              <Textarea className="text-xs min-h-20" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Links & Skills</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px]">LinkedIn</Label>
              <Input className="h-8 text-xs" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">GitHub</Label>
              <Input className="h-8 text-xs" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Portfolio</Label>
              <Input className="h-8 text-xs" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Skills (comma separated)</Label>
              <Input className="h-8 text-xs" value={form.skills.join(', ')} onChange={(e) => setForm({ ...form, skills: e.target.value.split(',').map((s) => s.trim()) })} />
            </div>
            <div className="flex flex-wrap gap-1">
              {form.skills.filter(Boolean).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[9px]">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
