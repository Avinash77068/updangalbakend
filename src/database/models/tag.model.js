import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const tagSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Tag name is required'], unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
})

tagSchema.plugin(baseModelPlugin)

export const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema)
