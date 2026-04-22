import mongoose, { Schema, Document } from 'mongoose'

export interface IUniversity extends Document {
  slug: string
  name: string
  shortName: string
  naac: string
  type: string
  established: number
  location: string
  description: string
  accreditations: string[]
  highlights: string[]
  feeRange: string
  website: string
  logo: string
  banner: string
  filterTags: string[]
  createdAt: Date
  updatedAt: Date
}

const UniversitySchema = new Schema<IUniversity>({
  slug:           { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  shortName:      { type: String, required: true },
  naac:           { type: String, default: 'A' },
  type:           { type: String, default: 'Deemed University' },
  established:    { type: Number },
  location:       { type: String },
  description:    { type: String },
  accreditations: [String],
  highlights:     [String],
  feeRange:       { type: String },
  website:        { type: String },
  logo:           { type: String, default: '' },
  banner:         { type: String, default: '' },
  filterTags:     [String],
}, { timestamps: true, strict: false })

export default (mongoose.models.University as mongoose.Model<IUniversity>) ||
  mongoose.model<IUniversity>('University', UniversitySchema)
