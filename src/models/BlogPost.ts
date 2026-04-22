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
  published: { type: Boolean, default: false },
}, { timestamps: true })

export default models.BlogPost || model('BlogPost', BlogPostSchema)
