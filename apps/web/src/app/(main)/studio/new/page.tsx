'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudioLoader } from '@/components/studio/studio-loader';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { studioApi } from '@/lib/api';
import { sourceImg } from '@/components/auth/jobSources-image';
import { Search, RotateCcw } from 'lucide-react';

const jobTypes = [
  { value: 'any', label: 'Any' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
];

const postedOptions = [
  { value: 'any-time', label: 'Any time' },
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last day' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'salary', label: 'Salary' },
  { value: 'relevance', label: 'Relevance' },
];

export default function StudioNewPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('any');
  const [postedWithin, setPostedWithin] = useState('any-time');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [company, setCompany] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skills, setSkills] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setCountry('');
    setDomain('');
    setType('any');
    setPostedWithin('any-time');
    setExperienceLevel('');
    setCompany('');
    setSalaryMin('');
    setSalaryMax('');
    setSkills('');
    setSortBy('latest');
    setJobs([]);
    setSearched(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await studioApi.searchJobs({
        keyword: keyword || undefined,
        location: location || undefined,
        country: country || undefined,
        domain: domain || undefined,
        type: type === 'any' ? undefined : type,
        postedWithin: postedWithin === 'any-time' ? undefined : postedWithin,
        experienceLevel: experienceLevel || undefined,
        company: company || undefined,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        skills: skills ? skills.split(',').map((item) => item.trim()).filter(Boolean) : [],
        sortBy,
        limit: 20,
        page: 1,
      });
      setJobs(data.jobs ?? []);
      setSearched(true);
    } catch (error) {
      setJobs([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const overview = useMemo(() => {
    const total = jobs.length;
    const sources = jobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.source] = (acc[job.source] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      sources,
      topSource: Object.entries(sources).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '',
    };
  }, [jobs]);

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Search jobs"
        description="Use the internet scraping engine to discover and store real openings in your studio feed."
      />
      <div className="flex flex-col gap-3 px-4 pb-6 lg:px-6">
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Search parameters</p>
              <p className="text-[10px] text-muted-foreground">All options in the scraping API are available here.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-[10px] gap-1">
                <RotateCcw className="size-3" /> Reset
              </Button>
              <Button size="sm" onClick={handleSearch} className="h-7 text-[10px] gap-1">
                <Search className="size-3" /> Search Jobs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="keyword">Keyword</Label>
              <Input id="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Role, tech, title" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Remote, NY, Berlin" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={(event) => setCountry(event.target.value)} placeholder="US, CA, UK" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="SaaS, fintech, AI" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Stripe, Vercel" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="react, node, aws" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="type">Employment type</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="postedWithin">Posted within</Label>
              <Select value={postedWithin} onValueChange={(value) => setPostedWithin(value)}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  {postedOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="experienceLevel">Experience</Label>
              <Input id="experienceLevel" value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} placeholder="Senior, entry, mid" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="salaryMin">Salary min</Label>
              <Input id="salaryMin" type="number" value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="salaryMax">Salary max</Label>
              <Input id="salaryMax" type="number" value={salaryMax} onChange={(event) => setSalaryMax(event.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Latest" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <StudioLoader rows={5} />
        ) : searched ? (
          <div className="space-y-3">
            <Card className="border border-border/40 bg-muted/5">
              <CardHeader className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Search overview</p>
                    <p className="text-[10px] text-muted-foreground">Results have been scraped and stored in your job feed.</p>
                  </div>
                  <Badge variant="outline">{overview.total} jobs</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Top source</p>
                  <p className="text-sm font-semibold">{overview.topSource || 'None yet'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Source coverage</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(overview.sources).map((source) => (
                      <Badge key={source} variant="secondary" className="text-[9px] px-1.5 py-0">
                        {source} · {overview.sources[source]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Search intent</p>
                  <p className="text-sm font-semibold">{keyword || domain || company || 'Broad market scan'}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {jobs.map((job) => (
                <Card key={job._id} className="border border-border/40 bg-muted/5">
                  <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {sourceImg[job.source as keyof typeof sourceImg] ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          <Image
                            src={sourceImg[job.source as keyof typeof sourceImg]}
                            alt={`${job.source} logo`}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            {job.source?.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold">{job.title}</span>
                        <span className="text-[10px] text-muted-foreground">{job.company}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] shrink-0">
                      {job.source}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 px-4 pb-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{job.location}</span>
                      {job.salary && <span>{job.salary}</span>}
                      <span>{job.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/studio/jobs/${job._id}`}>View details</Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
                        <Link href={job.url} target="_blank">
                          Open listing
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}