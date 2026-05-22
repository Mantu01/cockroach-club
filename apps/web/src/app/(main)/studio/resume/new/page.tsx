'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useStudioData } from '@/context/studio-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  FileText,
  User,
  Layout,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface ExperienceField {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationField {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export default function NewResumePage() {
  const router = useRouter();
  const { fetchProfile, createResume, ensureAuth } = useStudioData();
  const profile = useAppSelector((s) => s.studio.profile);

  const [step, setStep] = useState<1 | 2>(1);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [dataSource, setDataSource] = useState<'profile' | 'custom'>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resumeTitle, setResumeTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [whyCreated, setWhyCreated] = useState('');

  const [fullName, setFullName] = useState('');
  const [bio, setbio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [desiredSalary, setDesiredSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [relocationReady, setRelocationReady] = useState(false);
  const [certificates, setCertificates] = useState('');

  const [experiences, setExperiences] = useState<ExperienceField[]>([
    { company: '', role: '', startDate: '', endDate: '', description: '' }
  ]);
  const [educations, setEducations] = useState<EducationField[]>([
    { institution: '', degree: '', field: '', startDate: '', endDate: '' }
  ]);

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void (async () => {
      const authed = await ensureAuth();
      if (!authed) return;
      try {
        await fetchProfile();
      } catch {
        toast.error('Failed to load profile');
      }
    })();
  }, [ensureAuth, fetchProfile]);

  useEffect(() => {
    if (profile && dataSource === 'custom' && !fullName) {
      setFullName(profile.fullName || '');
      setbio(profile.bio || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setPortfolio(profile.portfolio || '');
      setSummary(profile.summary || '');
      setSkills(profile.skills?.join(', ') || '');
      setDesiredSalary(profile.desiredSalary || '');
      setNoticePeriod(profile.noticePeriod || '');
      setRelocationReady(!!profile.relocationReady);
      setCertificates(profile.certificates?.join(', ') || '');
      if (profile.experience && profile.experience.length > 0) {
        setExperiences(profile.experience.map(exp => ({
          company: exp.company || '',
          role: exp.role || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })));
      }
      if (profile.education && profile.education.length > 0) {
        setEducations(profile.education.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || ''
        })));
      }
    }
  }, [profile, dataSource, fullName]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', role: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceField, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { institution: '', degree: '', field: '', startDate: '', endDate: '' }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: keyof EducationField, value: string) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleNext = () => {
    if (dataSource === 'custom') {
      setStep(2);
    } else {
      void handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        title: resumeTitle || (jobTitle ? `Resume - ${jobTitle}` : 'My Resume'),
        template,
        useProfileData: dataSource === 'profile',
        jobTitle: jobTitle || undefined,
        company: company || undefined,
        whyCreated: whyCreated || undefined
      };

      if (dataSource === 'custom') {
        payload.profileData = {
          fullName,
          bio,
          phone,
          location,
          linkedin,
          github,
          portfolio,
          summary,
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          experience: experiences.filter((e) => e.company && e.role),
          education: educations.filter((ed) => ed.institution && ed.degree),
          desiredSalary,
          noticePeriod,
          relocationReady,
          certificates: certificates.split(',').map((c) => c.trim()).filter(Boolean)
        };
      }

      const resume = await createResume(payload);
      toast.success('Resume created and AI-compiled successfully!');
      router.push(`/studio/resumes/${resume._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create resume';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Resume Forge"
        description="Design and compile your tailored LaTeX resume."
        action={
          <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-widest font-black" asChild>
            <Link href="/studio/resume">
              <ArrowLeft className="size-3 mr-1" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="px-4 pb-12 lg:px-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-8 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          <span className={step === 1 ? 'text-[#b5451b] font-bold' : ''}>1. Design & Source</span>
          {dataSource === 'custom' && (
            <>
              <ArrowRight className="size-3 text-muted-foreground/40" />
              <span className={step === 2 ? 'text-[#b5451b] font-bold' : ''}>2. Fill Details</span>
            </>
          )}
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-6">
            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Layout className="size-4 text-[#b5451b]" />
                  Select Template Layout
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose a layout designed to be clean, premium, and fully ATS-friendly.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'modern',
                      title: 'Modern Tech',
                      desc: 'Monospaced styling elements, bold layouts, tailored for engineering.'
                    },
                    {
                      id: 'classic',
                      title: 'Classic Professional',
                      desc: 'Serif fonts, traditional header hierarchy, best for business and finance.'
                    },
                    {
                      id: 'minimal',
                      title: 'Minimal Clean',
                      desc: 'Clean sans-serif, optimized spacing, maximum content density.'
                    }
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTemplate(t.id as any)}
                      className={`border p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-32 ${
                        template === t.id
                          ? 'border-[#b5451b] bg-[#b5451b]/5'
                          : 'border-border/40 hover:border-border/80 bg-background/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-xs font-bold uppercase tracking-wider">
                          {t.title}
                        </span>
                        {template === t.id && <Check className="size-4 text-[#b5451b]" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <User className="size-4 text-[#c4922a]" />
                  Data Source Selection
                </CardTitle>
                <CardDescription className="text-xs">
                  Pull from your saved profile data or enter fresh custom resume details.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setDataSource('profile')}
                    className={`border p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-28 ${
                      dataSource === 'profile'
                        ? 'border-[#c4922a] bg-[#c4922a]/5'
                        : 'border-border/40 hover:border-border/80 bg-background/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-xs font-bold uppercase tracking-wider">
                        Use Saved Profile
                      </span>
                      {dataSource === 'profile' && <Check className="size-4 text-[#c4922a]" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Instantly compile using your active Cockroach Club profile. Fast and automated.
                    </p>
                  </div>

                  <div
                    onClick={() => setDataSource('custom')}
                    className={`border p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-28 ${
                      dataSource === 'custom'
                        ? 'border-[#c4922a] bg-[#c4922a]/5'
                        : 'border-border/40 hover:border-border/80 bg-background/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-xs font-bold uppercase tracking-wider">
                        Custom Details Form
                      </span>
                      {dataSource === 'custom' && <Check className="size-4 text-[#c4922a]" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Fill out a custom form. Helpful for targeting specific applications or separate profiles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <FileText className="size-4 text-[#4a7c59]" />
                  Resume Metadata & Tailoring (Optional)
                </CardTitle>
                <CardDescription className="text-xs">
                  Add target job specifications. Our system uses these details to generate targeted LaTeX code.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="resTitle" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Resume Title
                    </Label>
                    <Input
                      id="resTitle"
                      placeholder="e.g. Senior Frontend Developer - Google"
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="jTitle" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Target Role / Job Title
                    </Label>
                    <Input
                      id="jTitle"
                      placeholder="e.g. Senior Full Stack Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="comp" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Target Company
                    </Label>
                    <Input
                      id="comp"
                      placeholder="e.g. Google"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <Label htmlFor="why" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Job Description / Tailoring Focus
                    </Label>
                    <Textarea
                      id="why"
                      rows={3}
                      placeholder="Paste the job description or main requirements to optimize keywords and structures."
                      value={whyCreated}
                      onChange={(e) => setWhyCreated(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                disabled={isSubmitting}
                onClick={handleNext}
                className="h-9 px-6 text-[10px] uppercase tracking-widest font-black"
              >
                {dataSource === 'custom' ? (
                  <>
                    Continue to Details
                    <ArrowRight className="size-3 ml-2" />
                  </>
                ) : (
                  <>
                    {isSubmitting ? 'Generating...' : 'Forge Resume'}
                    <Plus className="size-3 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <User className="size-4 text-[#b5451b]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border/40 text-left bg-muted/5 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/3">Field</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Full Name *</td>
                        <td className="p-2">
                          <Input
                            id="name"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Professional Bio</td>
                        <td className="p-2">
                          <Input
                            id="bio"
                            placeholder="e.g. Frontend Engineer & Designer"
                            value={bio}
                            onChange={(e) => setbio(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Phone Number</td>
                        <td className="p-2">
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Location</td>
                        <td className="p-2">
                          <Input
                            id="location"
                            placeholder="e.g. San Francisco, CA"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">LinkedIn URL</td>
                        <td className="p-2">
                          <Input
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">GitHub URL</td>
                        <td className="p-2">
                          <Input
                            id="github"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Portfolio / Website</td>
                        <td className="p-2">
                          <Input
                            id="portfolio"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <FileText className="size-4 text-[#c4922a]" />
                  Job Preferences & Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border/40 text-left bg-muted/5 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/3">Preference / Skill</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Desired Salary</td>
                        <td className="p-2">
                          <Input
                            id="desiredSalary"
                            placeholder="e.g. $120,000 / year"
                            value={desiredSalary}
                            onChange={(e) => setDesiredSalary(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Notice Period</td>
                        <td className="p-2">
                          <Input
                            id="noticePeriod"
                            placeholder="e.g. 2 weeks"
                            value={noticePeriod}
                            onChange={(e) => setNoticePeriod(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Relocation Status</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="relocationReady"
                              checked={relocationReady}
                              onChange={(e) => setRelocationReady(e.target.checked)}
                              className="size-3.5 rounded border-border/40 text-[#b5451b] focus:ring-[#b5451b] accent-[#b5451b]"
                            />
                            <Label htmlFor="relocationReady" className="text-xs text-muted-foreground cursor-pointer select-none">
                              Ready to relocate
                            </Label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Certifications</td>
                        <td className="p-2">
                          <Input
                            id="certificates"
                            placeholder="AWS Certified Solutions Architect, Certified Kubernetes Administrator"
                            value={certificates}
                            onChange={(e) => setCertificates(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Skills (Comma separated)</td>
                        <td className="p-2">
                          <Input
                            id="skills"
                            placeholder="React, TypeScript, Node.js, Next.js, Docker, Kubernetes"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Professional Summary</td>
                        <td className="p-2">
                          <Textarea
                            id="summary"
                            rows={3}
                            placeholder="A brief overview of your professional background, strengths, and goals."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b] resize-none"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Briefcase className="size-4 text-[#4a7c59]" />
                  Work Experience
                </CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-[9px] uppercase tracking-wider" onClick={handleAddExperience}>
                  <Plus className="size-3 mr-1" /> Add Experience
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border/40 text-left bg-muted/5 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/4">Company & Role</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/4">Dates</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-20 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {experiences.map((exp, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <div className="flex flex-col gap-2">
                              <Input
                                placeholder="Company Name *"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                              <Input
                                placeholder="Role Title *"
                                value={exp.role}
                                onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex flex-col gap-2">
                              <Input
                                placeholder="Start Date"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                              <Input
                                placeholder="End Date (e.g. Present)"
                                value={exp.endDate}
                                onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <Textarea
                              rows={3}
                              placeholder="Key Achievements / Description"
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                              className="text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b] resize-none"
                            />
                          </td>
                          <td className="p-2 text-center">
                            {experiences.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[9px] text-[#b5451b] hover:bg-[#b5451b]/10 hover:text-[#b5451b]"
                                onClick={() => handleRemoveExperience(idx)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
                <CardTitle style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <GraduationCap className="size-4 text-[#1a6b8a]" />
                  Education
                </CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-[9px] uppercase tracking-wider" onClick={handleAddEducation}>
                  <Plus className="size-3 mr-1" /> Add Education
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border/40 text-left bg-muted/5 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/3">Institution & Field</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/4">Degree</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-1/4">Dates</th>
                        <th className="p-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-20 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {educations.map((edu, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <div className="flex flex-col gap-2">
                              <Input
                                placeholder="Institution *"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                              <Input
                                placeholder="Field of Study"
                                value={edu.field}
                                onChange={(e) => handleEducationChange(idx, 'field', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <Input
                              placeholder="Degree (e.g. Bachelor) *"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                              className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex flex-col gap-2">
                              <Input
                                placeholder="Start Date"
                                value={edu.startDate}
                                onChange={(e) => handleEducationChange(idx, 'startDate', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                              <Input
                                placeholder="End Date"
                                value={edu.endDate}
                                onChange={(e) => handleEducationChange(idx, 'endDate', e.target.value)}
                                className="h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-[#b5451b]"
                              />
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            {educations.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[9px] text-[#b5451b] hover:bg-[#b5451b]/10 hover:text-[#b5451b]"
                                onClick={() => handleRemoveEducation(idx)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-9 px-6 text-[10px] uppercase tracking-widest font-black"
              >
                <ArrowLeft className="size-3 mr-2" />
                Back to Config
              </Button>

              <Button
                disabled={isSubmitting || !fullName}
                onClick={handleSubmit}
                className="h-9 px-6 text-[10px] uppercase tracking-widest font-black"
              >
                {isSubmitting ? 'Generating...' : 'Forge Resume'}
                <Plus className="size-3 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
