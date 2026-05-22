import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob {
  title: string;
  company: string;
  location: string;
  source: string;
  url: string;
  salary?: string;
  type: string;
  postedAt: Date;
  scrapedAt: Date;
  tags: string[];
  description?: string;
  shortDescription?: string;
  companyLogo?: string;
  companyWebsite?: string;
  recruiter?: string;
  remote?: boolean;
  jobMode?: string;
  currency?: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string;
  seniorityLevel?: string;
  experienceLevel?: string;
  domain?: string;
  industry?: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  technologies: string[];
  language?: string;
  jobId?: string;
  shareId?: string;
}

export interface IJobDocument extends IJob, Document {}

const jobSchema = new Schema<IJobDocument>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    source: { type: String, required: true },
    url: { type: String, required: true },
    salary: { type: String },
    type: { type: String, default: 'Full-time' },
    postedAt: { type: Date, default: Date.now },
    scrapedAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
    description: { type: String },
    shortDescription: { type: String },
    companyLogo: { type: String },
    companyWebsite: { type: String },
    recruiter: { type: String },
    remote: { type: Boolean },
    jobMode: { type: String },
    currency: { type: String },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    employmentType: { type: String },
    seniorityLevel: { type: String },
    experienceLevel: { type: String },
    domain: { type: String },
    industry: { type: String },
    skills: [{ type: String }],
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    qualifications: [{ type: String }],
    benefits: [{ type: String }],
    technologies: [{ type: String }],
    language: { type: String },
    jobId: { type: String },
    shareId: { type: String, index: true },
  },
  { timestamps: true }
);

const Job: Model<IJobDocument> =
  mongoose.models.Job || mongoose.model<IJobDocument>('Job', jobSchema);

export default Job;
