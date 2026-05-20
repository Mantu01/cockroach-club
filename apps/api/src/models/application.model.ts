import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IApplication {
  userId: string
  jobId?: string
  title: string
  company: string
  location: string
  url: string
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer'
  searchQuery: string
  appliedAt?: Date
}

export interface IApplicationDocument extends IApplication, Document {}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    userId: { type: String, required: true, index: true },
    jobId: { type: String },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'rejected', 'offer'],
      default: 'saved',
    },
    searchQuery: { type: String, required: true },
    appliedAt: { type: Date },
  },
  { timestamps: true }
)

const Application: Model<IApplicationDocument> =
  mongoose.models.Application ||
  mongoose.model<IApplicationDocument>('Application', applicationSchema)

export default Application
