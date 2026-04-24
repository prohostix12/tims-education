import mongoose, { Schema, Document } from 'mongoose'

export interface IStudyMaterial extends Document {
  universitySlug: string
  universityName: string
  courseTitle: string
  subject: string
  title: string
  description: string
  fileUrl: string
  type: 'pdf' | 'video' | 'link'
  semester: string
  createdAt: Date
}

const StudyMaterialSchema = new Schema<IStudyMaterial>({
  universitySlug: { type: String, required: true },
  universityName: { type: String, default: '' },
  courseTitle:    { type: String, default: '' },
  subject:        { type: String, default: '' },
  title:          { type: String, required: true },
  description:    { type: String, default: '' },
  fileUrl:        { type: String, required: true },
  type:           { type: String, enum: ['pdf', 'video', 'link'], default: 'pdf' },
  semester:       { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.StudyMaterial ||
  mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema)
