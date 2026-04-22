import mongoose, { Schema, model, models } from 'mongoose'

const CourseSchema = new Schema({
  title:       { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  duration:    { type: String },
  mode:        { type: String, default: 'Online' },
  eligibility: { type: String },
  universities:{ type: [String], default: [] },
  fees:        { type: String },
  popular:     { type: Boolean, default: false },
  icon:        { type: String },
  badge:       { type: String },
}, { timestamps: true })

export default models.Course || model('Course', CourseSchema)
