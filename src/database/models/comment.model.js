import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'articleId is required'],
    index: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  authorName: { type: String, default: 'Guest', trim: true },
  body: { type: String, required: [true, 'body is required'], trim: true, maxlength: 2000 },
  status: {
    type: String,
    enum: { values: ['pending', 'approved', 'rejected'], message: 'Invalid status: {VALUE}' },
    default: 'pending',
    index: true,
  },
})

commentSchema.plugin(baseModelPlugin)

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)
