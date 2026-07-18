import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'title is required'], trim: true },
  body: { type: String, default: '' },
  audience: {
    type: String,
    enum: { values: ['all', 'subscribers', 'admins'], message: 'Invalid audience: {VALUE}' },
    default: 'all',
  },
  status: {
    type: String,
    enum: { values: ['draft', 'sent'], message: 'Invalid status: {VALUE}' },
    default: 'draft',
    index: true,
  },
  sentAt: { type: Date, default: null },
})

notificationSchema.plugin(baseModelPlugin)

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
