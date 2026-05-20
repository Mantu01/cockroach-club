export type JobMode =
  | "remote"
  | "onsite"
  | "hybrid";

export type PostedWithin =
  | "1h"
  | "24h"
  | "7d"
  | "30d";

export interface JobSearchParams {
  keyword?: string;

  location?: string;

  country?: string;

  domain?: string;

  type?: JobMode;

  postedWithin?: PostedWithin;

  experienceLevel?: string;

  company?: string;

  salaryMin?: number;

  salaryMax?: number;

  skills?: string[];

  language?: string;

  page?: number;

  limit?: number;

  sortBy?:
    | "latest"
    | "salary"
    | "relevance";
}

export interface JobItem {
  title: string;

  company: string;

  companyLogo?: string;

  companyWebsite?: string;

  recruiter?: string;

  location: string;

  country?: string;

  remote?: boolean;

  jobMode?: JobMode;

  salary?: string;

  currency?: string;

  salaryMin?: number;

  salaryMax?: number;

  employmentType?: string;

  seniorityLevel?: string;

  experience?: string;

  domain?: string;

  industry?: string;

  skills?: string[];

  requirements?: string[];

  responsibilities?: string[];

  qualifications?: string[];

  benefits?: string[];

  technologies?: string[];

  description?: string;

  shortDescription?: string;

  applyUrl: string;

  source: string;

  postedAt?: string;

  scrapedAt: string;

  tags?: string[];

  language?: string;

  jobId?: string;
}