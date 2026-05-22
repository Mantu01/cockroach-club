'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { toast } from 'sonner';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { useStudioData } from '@/context/studio-data-context';

export default function NewPreparationPage() {
  const router = useRouter();
  const { createPreparation } = useStudioData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error('Target role is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const prep = await createPreparation({
        role: role.trim(),
        company: company.trim() || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
        experience: experience.trim() || undefined,
        title: title.trim() || undefined
      });

      toast.success('AI Interview Prep session calibrated successfully!');
      router.push(`/studio/preparation/${prep._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create prep session';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Calibrate Prep"
        description="Configure your interview parameters to generate highly targeted mock practice questions."
        action={
          <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-widest font-black" asChild>
            <Link href="/studio/preparations">
              <ArrowLeft className="size-3 mr-1" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-12 lg:px-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card className="border border-border/40 bg-muted/5">
            <CardHeader className="p-6 pb-4">
              <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Brain className="size-4 text-[#b5451b]" />
                Interview Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the details of the job and your experience. AI will tailor questions accordingly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Target Role / Job Title *
                </Label>
                <Input
                  id="role"
                  required
                  placeholder="e.g. Senior React Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Company Name (Optional)
                </Label>
                <Input
                  id="company"
                  placeholder="e.g. Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Session Title (Optional)
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Stripe Frontend Prep"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="skills" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Focus Skills (Comma separated, Optional)
                </Label>
                <Input
                  id="skills"
                  placeholder="e.g. React, Webpack, Performance Optimization, CSS grid"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="experience" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Your Experience Summary (Optional)
                </Label>
                <Textarea
                  id="experience"
                  rows={4}
                  placeholder="e.g. 5 years building frontend applications. Familiar with bundlers and system architectures."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !role}
              className="h-9 px-6 text-[10px] uppercase tracking-widest font-black"
            >
              {isSubmitting ? (
                'Generating...'
              ) : (
                <>
                  Calibrate AI Prep
                  <Sparkles className="size-3.5 ml-2 text-yellow-500 fill-yellow-500" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
