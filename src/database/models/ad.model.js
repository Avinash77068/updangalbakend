import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const adSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Ad type is required'],
    enum: {
      values: ['leaderboard', 'sidebar', 'inline', 'sponsored', 'mobile-sticky'],
      message: 'Invalid ad type: {VALUE}',
    },
    index: true,
  },
  placement: { type: String, required: [true, 'placement is required'], trim: true, index: true },
  // Where this ad renders relative to the surrounding layout — drives the
  // frontend's slot selection instead of hardcoded array indices.
  position: {
    type: String,
    enum: { values: ['left', 'right', 'top', 'bottom'], message: 'Invalid position: {VALUE}' },
    default: 'right',
    index: true,
  },
  // Sort order among ads sharing the same placement/position.
  order: { type: Number, default: 0, min: 0, index: true },
  title: { type: String, required: [true, 'title is required'], trim: true },
  description: { type: String, default: '' },
  ctaText: { type: String, required: [true, 'ctaText is required'], trim: true },
  sponsor: { type: String, required: [true, 'sponsor is required'], trim: true },
  tagline: { type: String, default: 'Advertisement' },
  bgColor: { type: String, default: '#000000' },
  image: { type: String, default: null },
  isActive: { type: Boolean, default: true, index: true },
})

adSchema.plugin(baseModelPlugin)

export const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema)
