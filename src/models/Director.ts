import mongoose, { Schema, Document } from 'mongoose'

export interface IDirector extends Document {
  name: string
  role: string
  bio: string
  photo: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const DirectorSchema = new Schema<IDirector>({
  name:  { type: String, required: true },
  role:  { type: String, required: true },
  bio:   { type: String },
  photo: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Director || mongoose.model<IDirector>('Director', DirectorSchema)
