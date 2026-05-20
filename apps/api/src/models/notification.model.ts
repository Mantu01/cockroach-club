import mongoose, { Document, Model, Schema } from 'mongoose'

export interface INotification {
  userId: string
  title: string
  message: string
  type: 'job' | 'application' | 'system' | 'billing'
  read: boolean
}

export interface INotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['job', 'application', 'system', 'billing'],
      default: 'system',
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification: Model<INotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDocument>('Notification', notificationSchema)

export default Notification
