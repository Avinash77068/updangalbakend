import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { rateLimit } from './middleware/rateLimit.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { apiRoutes } from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const openapi = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'openapi.json'), 'utf8')
)

export function createApp() {
  const app = express()

  // helmet's default Cross-Origin-Resource-Policy ("same-origin") makes browsers
  // block cross-origin loads of this API's images/responses — the frontend runs
  // on a different origin, so relax it (CORS below only governs fetch/XHR, not
  // this separate CORP check that <img> tags are also subject to).
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  // Allow any origin — the API is public and consumed from multiple frontends.
  app.use(cors({ origin: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  app.use(rateLimit)

  app.get('/', (_req, res) => {
    res.json({
      name: 'UpDangal API',
      status: 'ok',
      version: env.apiVersion,
      docs: '/docs',
      api: `/api/${env.apiVersion}`,
      health: `/api/${env.apiVersion}/health`,
    })
  })

  // vercel.json routes every request through this single function, so Vercel's
  // own static-file serving for /public never kicks in — serve it ourselves.
  app.use(express.static(path.resolve(__dirname, '..', 'public')))
  app.use(`/${env.uploadDir}`, express.static(path.resolve(__dirname, '..', '..', env.uploadDir)))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))
  app.use(`/api/${env.apiVersion}`, apiRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
