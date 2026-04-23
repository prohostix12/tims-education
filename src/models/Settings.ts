import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
  heroStudentImage: string
  logoIcon: string
  awardPhoto: string
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>({
  heroStudentImage: { type: String, default: '' },
  logoIcon:         { type: String, default: '' },
  awardPhoto:       { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)
