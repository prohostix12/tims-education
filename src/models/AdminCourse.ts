import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminCourse extends Document {
  slug: string
  title: string
  category: string
  description: string
  fullDescription: string
  duration: string
  mode: string
  eligibility: string
  popular: boolean
  icon: string
  badge: string
  feeRange: string
  careers: string[]
  highlights: string[]
  universities: string[]
  createdAt: Date
  updatedAt: Date
}

const AdminCourseSchema = new Schema<IAdminCourse>({
  slug:            { type: String, required: true, unique: true },
  title:           { type: String, required: true },
  category:        { type: String, required: true },
  description:     { type: String },
  fullDescription: { type: String },
  duration:        { type: String },
  mode:            { type: String, default: 'Online' },
  eligibility:     { type: String },
  popular:         { type: Boolean, default: false },
  icon:            { type: String, default: '📚' },
  badge:           { type: String },
  feeRange:        { type: String },
  careers:         [String],
  highlights:      [String],
  universities:    [String],
}, { timestamps: true })

export default mongoose.models.AdminCourse || mongoose.model<IAdminCourse>('AdminCourse', AdminCourseSchema)
