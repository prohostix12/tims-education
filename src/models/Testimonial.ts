import mongoose, { Schema, model, models } from 'mongoose'

const TestimonialSchema = new Schema({
  name:    { type: String, required: true },
  program: { type: String, required: true },
  quote:   { type: String, required: true },
  rating:  { type: Number, default: 5, min: 1, max: 5 },
  avatar:  { type: String },
  active:  { type: Boolean, default: true },
}, { timestamps: true })

export default models.Testimonial || model('Testimonial', TestimonialSchema)
