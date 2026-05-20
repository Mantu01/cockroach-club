import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IRecentSearch {
  userId: string
  query: string
  location?: string
  resultsCount: number
}

export interface IRecentSearchDocument extends IRecentSearch, Document {}

const recentSearchSchema = new Schema<IRecentSearchDocument>(
  {
    userId: { type: String, required: true, index: true },
    query: { type: String, required: true },
    location: { type: String },
    resultsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const RecentSearch: Model<IRecentSearchDocument> =
  mongoose.models.RecentSearch ||
  mongoose.model<IRecentSearchDocument>('RecentSearch', recentSearchSchema)

export default RecentSearch
