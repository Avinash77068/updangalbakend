import { connectDB } from '../src/config/db.js'

// Vercel serverless entry point.
// Unlike src/server.js (which calls app.listen for local/VM hosting),
// Vercel invokes this exported handler per request. The Express app is
// built lazily on the first request and cached for the warm container;
// connectDB() caches the Mongoose connection internally so we only dial
// MongoDB on a cold start.
//
// createApp() is imported dynamically inside the handler so that a
// startup failure (missing env var, unreadable docs file, etc.) surfaces
// as a readable JSON error instead of an opaque FUNCTION_INVOCATION_FAILED.
let appPromise = null

async function getApp() {
  if (!appPromise) {
    appPromise = import('../src/app.js')
      .then(({ createApp }) => createApp())
      .catch((error) => {
        appPromise = null // allow a retry on the next request
        throw error
      })
  }
  return appPromise
}

export default async function handler(req, res) {
  let app
  try {
    app = await getApp()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Startup failed',
      error: error?.message || String(error),
    })
    return
  }

  try {
    await connectDB()
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database unavailable',
      error: error?.message || String(error),
    })
    return
  }

  return app(req, res)
}
