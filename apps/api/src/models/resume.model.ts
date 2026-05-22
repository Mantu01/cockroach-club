import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IResume {
  userId: string;
  title: string;
  latex: string;
  template: string;
  atsScore: number;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  whyCreated?: string;
}

export interface IResumeDocument extends IResume, Document {}

const resumeSchema = new Schema<IResumeDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    latex: { type: String, required: true },
    template: { type: String, required: true, default: 'modern' },
    atsScore: { type: Number, required: true, default: 80 },
    jobId: { type: String },
    jobTitle: { type: String },
    company: { type: String },
    whyCreated: { type: String },
  },
  { timestamps: true }
);

const Resume: Model<IResumeDocument> =
  mongoose.models.Resume || mongoose.model<IResumeDocument>('Resume', resumeSchema);

export default Resume;
