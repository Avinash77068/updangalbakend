import dotenv from 'dotenv'

dotenv.config()

const isProduction = (process.env.NODE_ENV || 'development') === 'production'

// Values that must never be used in production because they are public defaults.
const INSECURE_DEFAULTS = new Set([
  'change-this-access-secret',
  'change-this-refresh-secret',
  'replace-with-strong-secret',
  'dev-access-secret',
  'dev-refresh-secret',
])

function required(name, value, { devFallback } = {}) {
  const missing = value === undefined || value === '' || INSECURE_DEFAULTS.has(value)
  if (!missing) return value

  if (isProduction) {
    throw new Error(
      `Config error: ${name} must be set to a strong, non-default value in production.`
    )
  }
  if (devFallback !== undefined) {
    console.warn(`[env] ${name} is missing/insecure — using development fallback. Do NOT ship this.`)
    return devFallback
  }
  throw new Error(`Config error: ${name} is required.`)
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT || 4000),
  apiVersion: process.env.API_VERSION || 'v1',
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
  mongoUri: required('MONGODB_URI', process.env.MONGODB_URI, {
    devFallback: 'mongodb://127.0.0.1:27017/updangal',
  }),
  jwtAccessSecret: required('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET, {
    devFallback: 'dev-only-access-secret-not-for-production',
  }),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, {
    devFallback: 'dev-only-refresh-secret-not-for-production',
  }),
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900),
  refreshTokenTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 604800),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
}
