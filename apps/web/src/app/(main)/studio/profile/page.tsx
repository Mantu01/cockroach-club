'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import type { UserProfile } from '@/lib/api';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const emptyProfile: UserProfile = {
  fullName: '',
  bio: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  desiredSalary: '',
  noticePeriod: '',
  relocationReady: false,
};

export default function StudioProfilePage() {
  const { fetchProfile, updateProfile } = useStudioData();
  const profile = useAppSelector((s) => s.studio.profile);
  const loading = useAppSelector((s) => s.studio.loading.profile);
  const [form, setForm] = useState<UserProfile>(emptyProfile);
  const [saving, setSaving] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm({
        ...emptyProfile,
        ...profile,
        experience: profile.experience || [],
        education: profile.education || [],
        certificates: profile.certificates || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const skills = form.skills.length
        ? form.skills
        : ((form as UserProfile & { skillsInput?: string }).skillsInput
            ?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) ?? []);
      await updateProfile({ ...form, skills });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) return <StudioLoader rows={8} />;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Profile"
        description="Professional data used across all your job applications."
        action={
          <Button
            size="sm"
            className="h-7 text-[10px] tracking-widest uppercase"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="size-3 mr-1" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 lg:px-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3">
              <span className={UI_SIZES.sectionLabel}>Basic Info</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-4 pb-4">
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Full Name</Label>
                <Input
                  className="h-8 text-xs"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Bio</Label>
                <Input
                  className="h-8 text-xs"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1.5">
                  <Label className="text-[10px]">Phone</Label>
                  <Input
                    className="h-8 text-xs"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[10px]">Location</Label>
                  <Input
                    className="h-8 text-xs"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Summary</Label>
                <Textarea
                  className="text-xs min-h-20"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
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
                <Input
                  className="h-8 text-xs"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">GitHub</Label>
                <Input
                  className="h-8 text-xs"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Portfolio</Label>
                <Input
                  className="h-8 text-xs"
                  value={form.portfolio}
                  onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px]">Skills (comma separated)</Label>
                <Input
                  className="h-8 text-xs"
                  value={form.skills.join(', ')}
                  onChange={(e) =>
                    setForm({ ...form, skills: e.target.value.split(',').map((s) => s.trim()) })
                  }
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {form.skills.filter(Boolean).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-[9px]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Job Application Preferences</span>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Desired Salary</Label>
              <Input
                className="h-8 text-xs"
                placeholder="e.g. $120,000"
                value={form.desiredSalary || ''}
                onChange={(e) => setForm({ ...form, desiredSalary: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Notice Period</Label>
              <Input
                className="h-8 text-xs"
                placeholder="e.g. 2 weeks"
                value={form.noticePeriod || ''}
                onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-5">
              <Checkbox
                id="relocation"
                checked={form.relocationReady || false}
                onCheckedChange={(checked) => setForm({ ...form, relocationReady: !!checked })}
              />
              <Label htmlFor="relocation" className="text-xs select-none cursor-pointer">
                Open to Relocation
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
              <span className={UI_SIZES.sectionLabel}>Work Experience</span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[9px] uppercase tracking-wider"
                onClick={() => {
                  setForm({
                    ...form,
                    experience: [
                      ...form.experience,
                      { company: '', role: '', startDate: '', endDate: '', description: '' },
                    ],
                  });
                }}
              >
                + Add Experience
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-4 pb-4">
              {form.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-lg border border-border/30 bg-background/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      Experience #{idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[9px] text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        const list = [...form.experience];
                        list.splice(idx, 1);
                        setForm({ ...form, experience: list });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Company</Label>
                      <Input
                        className="h-7 text-xs"
                        value={exp.company}
                        onChange={(e) => {
                          const list = [...form.experience];
                          list[idx] = { ...list[idx], company: e.target.value };
                          setForm({ ...form, experience: list });
                        }}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Role</Label>
                      <Input
                        className="h-7 text-xs"
                        value={exp.role}
                        onChange={(e) => {
                          const list = [...form.experience];
                          list[idx] = { ...list[idx], role: e.target.value };
                          setForm({ ...form, experience: list });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Start Date</Label>
                      <Input
                        className="h-7 text-xs"
                        placeholder="e.g. Jan 2024"
                        value={exp.startDate}
                        onChange={(e) => {
                          const list = [...form.experience];
                          list[idx] = { ...list[idx], startDate: e.target.value };
                          setForm({ ...form, experience: list });
                        }}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-[9px]">End Date</Label>
                      <Input
                        className="h-7 text-xs"
                        placeholder="e.g. Present"
                        value={exp.endDate || ''}
                        onChange={(e) => {
                          const list = [...form.experience];
                          list[idx] = { ...list[idx], endDate: e.target.value };
                          setForm({ ...form, experience: list });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[9px]">Description</Label>
                    <Textarea
                      className="min-h-12 text-xs"
                      value={exp.description}
                      onChange={(e) => {
                        const list = [...form.experience];
                        list[idx] = { ...list[idx], description: e.target.value };
                        setForm({ ...form, experience: list });
                      }}
                    />
                  </div>
                </div>
              ))}
              {form.experience.length === 0 && (
                <span className="text-xs text-muted-foreground">No experience items added.</span>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
              <span className={UI_SIZES.sectionLabel}>Education</span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[9px] uppercase tracking-wider"
                onClick={() => {
                  setForm({
                    ...form,
                    education: [
                      ...form.education,
                      { institution: '', degree: '', field: '', startDate: '', endDate: '' },
                    ],
                  });
                }}
              >
                + Add Education
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-4 pb-4">
              {form.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-lg border border-border/30 bg-background/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      Education #{idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[9px] text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        const list = [...form.education];
                        list.splice(idx, 1);
                        setForm({ ...form, education: list });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[9px]">Institution</Label>
                    <Input
                      className="h-7 text-xs"
                      value={edu.institution}
                      onChange={(e) => {
                        const list = [...form.education];
                        list[idx] = { ...list[idx], institution: e.target.value };
                        setForm({ ...form, education: list });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Degree</Label>
                      <Input
                        className="h-7 text-xs"
                        value={edu.degree}
                        onChange={(e) => {
                          const list = [...form.education];
                          list[idx] = { ...list[idx], degree: e.target.value };
                          setForm({ ...form, education: list });
                        }}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Field of Study</Label>
                      <Input
                        className="h-7 text-xs"
                        value={edu.field}
                        onChange={(e) => {
                          const list = [...form.education];
                          list[idx] = { ...list[idx], field: e.target.value };
                          setForm({ ...form, education: list });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-[9px]">Start Date</Label>
                      <Input
                        className="h-7 text-xs"
                        placeholder="e.g. Sep 2020"
                        value={edu.startDate}
                        onChange={(e) => {
                          const list = [...form.education];
                          list[idx] = { ...list[idx], startDate: e.target.value };
                          setForm({ ...form, education: list });
                        }}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-[9px]">End Date</Label>
                      <Input
                        className="h-7 text-xs"
                        placeholder="e.g. May 2024"
                        value={edu.endDate || ''}
                        onChange={(e) => {
                          const list = [...form.education];
                          list[idx] = { ...list[idx], endDate: e.target.value };
                          setForm({ ...form, education: list });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {form.education.length === 0 && (
                <span className="text-xs text-muted-foreground">No education items added.</span>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Certificates</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px]">Certificates (comma separated)</Label>
              <Input
                className="h-8 text-xs"
                placeholder="e.g. AWS Certified Developer, Certified Scrum Master"
                value={(form.certificates ?? []).join(', ')}
                onChange={(e) =>
                  setForm({ ...form, certificates: e.target.value.split(',').map((s) => s.trim()) })
                }
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {(form.certificates ?? []).filter(Boolean).map((cert) => (
                <Badge key={cert} variant="secondary" className="text-[9px]">
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
