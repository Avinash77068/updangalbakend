import crypto from 'node:crypto'

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function decodeBase64Url(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(normalized, 'base64').toString()
}

export function signToken(payload, secret, ttlSeconds) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const body = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(body))}`
  const signature = crypto.createHmac('sha256', secret).update(unsigned).digest('base64url')
  return `${unsigned}.${signature}`
}

export function verifyToken(token, secret) {
  const [header, payload, signature] = String(token || '').split('.')
  if (!header || !payload || !signature) return null
  const unsigned = `${header}.${payload}`
  const expected = crypto.createHmac('sha256', secret).update(unsigned).digest('base64url')
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const decoded = JSON.parse(decodeBase64Url(payload))
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null
  return decoded
}
