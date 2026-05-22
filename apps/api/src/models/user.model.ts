import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

export interface IUserProfile {
  fullName: string;
  bio: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  certificates?: string[];
  desiredSalary?: string;
  noticePeriod?: string;
  relocationReady?: boolean;
}

export interface IUserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  jobAlerts: boolean;
  weeklyDigest: boolean;
  autoApply: boolean;
  profileVisibility: boolean;
}

export interface IResume {
  latex: string;
  template: string;
  lastGeneratedAt?: Date;
}

export interface IUser {
  id: string;
  email: string;
  credits: number;
  Tcredits: number;
  profile: IUserProfile;
  settings: IUserSettings;
  resume: IResume;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const educationSchema = new Schema<IEducation>(
  {
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 100,
    },
    Tcredits: {
      type: Number,
      required: true,
      default: 100,
    },
    profile: {
      fullName: { type: String, default: '' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: [{ type: String }],
      experience: [experienceSchema],
      education: [educationSchema],
      certificates: [{ type: String }],
      desiredSalary: { type: String, default: '' },
      noticePeriod: { type: String, default: '' },
      relocationReady: { type: Boolean, default: false },
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      emailNotifications: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      autoApply: { type: Boolean, default: false },
      profileVisibility: { type: Boolean, default: true },
    },
    resume: {
      latex: { type: String, default: '' },
      template: { type: String, default: 'modern' },
      lastGeneratedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User;
