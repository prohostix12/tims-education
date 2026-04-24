import mongoose, { Schema, model, models } from 'mongoose'

const ContactSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, default: '' },
  phone:   { type: String, default: '' },
  course:  { type: String, default: '' },
  message: { type: String, default: '' },
  source:  { type: String, default: 'Contact Form' },
  status:  { type: String, default: 'new', enum: ['new', 'contacted', 'resolved'] },
}, { timestamps: true })

export default models.Contact || model('Contact', ContactSchema)
