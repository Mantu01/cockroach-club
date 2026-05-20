import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IJob {
  title: string
  company: string
  location: string
  source: string
  url: string
  salary?: string
  type: string
  postedAt: Date
  scrapedAt: Date
  tags: string[]
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
  },
  { timestamps: true }
)

const Job: Model<IJobDocument> =
  mongoose.models.Job || mongoose.model<IJobDocument>('Job', jobSchema)

export default Job
