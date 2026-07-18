import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const videoAuthorSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { _id: false }
)

const videoSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'title is required'], trim: true, maxlength: 300 },
  thumbnail: { type: String, required: [true, 'thumbnail is required'] },
  duration: { type: String, required: [true, 'duration is required'] },
  // Kept as a human-readable string (e.g. "25L", "2.5Cr") to match the display contract.
  views: { type: String, default: '0' },
  publishedAt: { type: Date, default: null },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
  category: { type: String, required: [true, 'category is required'], trim: true, index: true },
  isShort: { type: Boolean, default: false, index: true },
  author: { type: videoAuthorSchema, default: () => ({}) },
})

videoSchema.plugin(baseModelPlugin)

export const Video = mongoose.models.Video || mongoose.model('Video', videoSchema)
