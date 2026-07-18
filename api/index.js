import { createApp } from '../src/app.js'
import { connectDB } from '../src/config/db.js'

// Vercel serverless entry point.
// Unlike src/server.js (which calls app.listen for local/VM hosting),
// Vercel invokes this exported handler per request. The Express app is
// created once per warm container and reused; connectDB() caches the
// Mongoose connection internally so we only dial MongoDB on a cold start.
const app = createApp()

export default async function handler(req, res) {
  try {
    await connectDB()
  } catch (error) {
    res.status(503).json({ success: false, message: 'Database unavailable' })
    return
  }
  return app(req, res)
}
