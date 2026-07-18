import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: '' },
  },
  { _id: false }
)

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
)

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 300 },
  excerpt: { type: String, default: '', maxlength: 600 },
  content: { type: String, default: '' },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  // Normalized relationship (source of truth) + denormalized display fields
  // kept in sync so the public API stays fast and backward-compatible.
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'categoryId is required'],
    index: true,
  },
  category: { type: String, required: true, trim: true },
  categorySlug: { type: String, required: true, trim: true, lowercase: true, index: true },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  author: { type: authorSchema, required: true },
  status: {
    type: String,
    enum: { values: ['draft', 'scheduled', 'published'], message: 'Invalid status: {VALUE}' },
    default: 'draft',
    index: true,
  },
  publishedAt: { type: Date, default: null, index: true },
  scheduledAt: { type: Date, default: null },
  readTime: { type: Number, default: 4, min: 1 },
  isLive: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false, index: true },
  isBreaking: { type: Boolean, default: false, index: true },
  views: { type: Number, default: 0, min: 0 },
  tags: { type: [String], default: [] },
  seo: { type: seoSchema, default: () => ({}) },
})

// Full-text search across the fields the /search and ?q= endpoints use.
articleSchema.index({ title: 'text', excerpt: 'text', content: 'text' })

articleSchema.plugin(baseModelPlugin)

export const Article = mongoose.models.Article || mongoose.model('Article', articleSchema)
