import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const trendingTopicSchema = new mongoose.Schema({
  rank: { type: Number, default: 0, min: 0, index: true },
  title: { type: String, required: [true, 'title is required'], trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  category: { type: String, required: [true, 'category is required'], trim: true },
  views: { type: String, default: '0' },
  isHot: { type: Boolean, default: false },
})

trendingTopicSchema.plugin(baseModelPlugin)

export const TrendingTopic =
  mongoose.models.TrendingTopic || mongoose.model('TrendingTopic', trendingTopicSchema)
