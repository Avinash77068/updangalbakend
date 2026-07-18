import crypto from 'node:crypto'

const iterations = 100000
const keyLength = 64
const digest = 'sha512'

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  return hashPassword(password, salt) === stored
}
