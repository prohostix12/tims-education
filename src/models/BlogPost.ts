import mongoose, { Schema, model, models } from 'mongoose'

const BlogPostSchema = new Schema({
  title:     { type: String, required: true },
  slug:      { type: String, required: true, unique: true },
  excerpt:   { type: String, required: true },
  content:   { type: String, required: true },
  author:    { type: String, default: 'TIMS Team' },
  category:  { type: String },
  tags:      { type: [String], default: [] },
  image:     { type: String },
  icon:      { type: String, default: '📝' },
  date:      { type: String, default: '' },
  readTime:  { type: String, default: '' },
  featured:  { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true })

export default models.BlogPost || model('BlogPost', BlogPostSchema)
