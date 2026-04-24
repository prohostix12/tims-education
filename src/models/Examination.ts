import mongoose, { Schema, Document } from 'mongoose'

export interface IExamination extends Document {
  universitySlug: string
  universityName: string
  courseTitle: string
  title: string
  description: string
  examDate: string
  lastDate: string
  scheduleUrl: string
  instructions: string
  createdAt: Date
}

const ExaminationSchema = new Schema<IExamination>({
  universitySlug: { type: String, required: true },
  universityName: { type: String, default: '' },
  courseTitle:    { type: String, default: '' },
  title:          { type: String, required: true },
  description:    { type: String, default: '' },
  examDate:       { type: String, default: '' },
  lastDate:       { type: String, default: '' },
  scheduleUrl:    { type: String, default: '' },
  instructions:   { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Examination ||
  mongoose.model<IExamination>('Examination', ExaminationSchema)
