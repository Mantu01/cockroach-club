import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAnalytics {
  userId?: string;
  type: string;
  action: string;
  jobId?: string;
  meta?: Record<string, any>;
}

export interface IAnalyticsDocument extends IAnalytics, Document {}

const analyticsSchema = new Schema<IAnalyticsDocument>(
  {
    userId: { type: String, index: true },
    type: { type: String, required: true },
    action: { type: String, required: true },
    jobId: { type: String, index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Analytics: Model<IAnalyticsDocument> =
  mongoose.models.Analytics || mongoose.model<IAnalyticsDocument>('Analytics', analyticsSchema);

export default Analytics;
