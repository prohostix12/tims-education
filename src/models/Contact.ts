import mongoose, { Schema, model, models } from 'mongoose'

const ContactSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String },
  course:  { type: String },
  message: { type: String, required: true },
  status:  { type: String, default: 'new', enum: ['new', 'contacted', 'resolved'] },
}, { timestamps: true })

export default models.Contact || model('Contact', ContactSchema)
