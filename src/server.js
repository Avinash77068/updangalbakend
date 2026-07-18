import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'

async function start() {
  await connectDB()

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`UpDangal API running on http://localhost:${env.port}/api/${env.apiVersion}`)
    console.log(`Swagger docs running on http://localhost:${env.port}/docs`)
  })

  const shutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down...`)
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
