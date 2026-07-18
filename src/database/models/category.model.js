import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], trim: true, maxlength: 80 },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  nameHindi: { type: String, trim: true, default: '' },
  color: {
    type: String,
    default: '#000000',
    validate: { validator: (v) => HEX_COLOR_RE.test(v), message: 'color must be a hex value' },
  },
  bgColor: {
    type: String,
    default: '#FFFFFF',
    validate: { validator: (v) => HEX_COLOR_RE.test(v), message: 'bgColor must be a hex value' },
  },
  order: { type: Number, default: 999, min: 0, index: true },
  isActive: { type: Boolean, default: true, index: true },
})

categorySchema.plugin(baseModelPlugin)

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
