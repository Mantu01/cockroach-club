import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPreparationQuestion {
  _id?: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answered: boolean;
  userAnswer?: string;
}

export interface IPreparation {
  userId: string;
  title: string;
  role: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  questions: IPreparationQuestion[];
  completedCount: number;
  totalCount: number;
}

export interface IPreparationDocument extends IPreparation, Document {}

const preparationQuestionSchema = new Schema<IPreparationQuestion>(
  {
    question: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    answered: { type: Boolean, default: false },
    userAnswer: { type: String },
  },
  { _id: true }
);

const preparationSchema = new Schema<IPreparationDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    jobId: { type: String },
    jobTitle: { type: String },
    company: { type: String },
    questions: [preparationQuestionSchema],
    completedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Preparation: Model<IPreparationDocument> =
  mongoose.models.Preparation ||
  mongoose.model<IPreparationDocument>('Preparation', preparationSchema);

export default Preparation;
