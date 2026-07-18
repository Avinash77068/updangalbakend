import mongoose from 'mongoose'
import { baseModelPlugin } from './plugins.js'

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
    index: true,
  },
  token: { type: String, required: [true, 'token is required'], index: true },
  expiresAt: { type: Date, default: null },
  revokedAt: { type: Date, default: null },
})

// TTL index: MongoDB removes tokens automatically once they expire.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

refreshTokenSchema.plugin(baseModelPlugin)

export const RefreshToken =
  mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema)
