import { env } from '../config/env.js'
import { verifyToken } from '../utils/jwt.js'
import { findById } from '../database/store.js'
import { HttpError } from '../utils/httpError.js'

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    const payload = token ? verifyToken(token, env.jwtAccessSecret) : null

    if (!payload?.sub) {
      return next(new HttpError(401, 'Authentication required'))
    }

    const user = await findById('users', payload.sub)
    if (!user || user.status !== 'active') {
      return next(new HttpError(401, 'Invalid account'))
    }

    delete user.passwordHash
    req.user = user
    return next()
  } catch (error) {
    return next(error)
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    const payload = token ? verifyToken(token, env.jwtAccessSecret) : null
    if (payload?.sub) {
      const user = await findById('users', payload.sub)
      if (user?.status === 'active') {
        delete user.passwordHash
        req.user = user
      }
    }
    return next()
  } catch (error) {
    return next(error)
  }
}
