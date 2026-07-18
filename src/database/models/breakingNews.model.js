import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const breakingNewsSchema = new mongoose.Schema({
  text: { type: String, required: [true, 'text is required'], trim: true },
  order: { type: Number, default: 0, min: 0, index: true },
  isActive: { type: Boolean, default: true, index: true },
})

breakingNewsSchema.plugin(baseModelPlugin)

export const BreakingNews =
  mongoose.models.BreakingNews || mongoose.model('BreakingNews', breakingNewsSchema)
