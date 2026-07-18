import { env } from '../config/env.js'

const buckets = new Map()

export function rateLimit(req, res, next) {
  const now = Date.now()
  const key = req.ip || req.headers['x-forwarded-for'] || 'anonymous'
  const bucket = buckets.get(key) || { count: 0, resetAt: now + env.rateLimitWindowMs }

  if (bucket.resetAt < now) {
    bucket.count = 0
    bucket.resetAt = now + env.rateLimitWindowMs
  }

  bucket.count += 1
  buckets.set(key, bucket)

  res.setHeader('X-RateLimit-Limit', String(env.rateLimitMax))
  res.setHeader('X-RateLimit-Remaining', String(Math.max(env.rateLimitMax - bucket.count, 0)))

  if (bucket.count > env.rateLimitMax) {
    return res.status(429).json({ success: false, message: 'Too many requests' })
  }

  return next()
}
