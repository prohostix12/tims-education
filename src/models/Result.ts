import mongoose, { Schema, Document } from 'mongoose'

export interface IResult extends Document {
  universitySlug: string
  universityName: string
  title: string
  description: string
  semester: string
  resultUrl: string
  publishedDate: string
  createdAt: Date
}

const ResultSchema = new Schema<IResult>({
  universitySlug: { type: String, required: true },
  universityName: { type: String, default: '' },
  title:          { type: String, required: true },
  description:    { type: String, default: '' },
  semester:       { type: String, default: '' },
  resultUrl:      { type: String, required: true },
  publishedDate:  { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Result ||
  mongoose.model<IResult>('Result', ResultSchema)
