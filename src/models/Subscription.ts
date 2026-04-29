import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
  email: string
  name: string
  createdAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
