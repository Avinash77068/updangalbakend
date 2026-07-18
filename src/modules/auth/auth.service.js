import crypto from 'node:crypto'
import { env } from '../../config/env.js'
import { findById, findOne, insert, remove } from '../../database/store.js'
import { User } from '../../database/models/index.js'
import { deepNormalize } from '../../utils/serialize.js'
import { HttpError } from '../../utils/httpError.js'
import { signToken, verifyToken } from '../../utils/jwt.js'
import { verifyPassword } from '../../utils/password.js'

function publicUser(user) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

async function issueTokens(user) {
  const accessToken = signToken({ sub: user.id, role: user.role }, env.jwtAccessSecret, env.accessTokenTtlSeconds)
  const refreshToken = signToken(
    { sub: user.id, tokenId: crypto.randomUUID() },
    env.jwtRefreshSecret,
    env.refreshTokenTtlSeconds
  )
  await insert('refreshTokens', {
    id: crypto.randomUUID(),
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + env.refreshTokenTtlSeconds * 1000).toISOString(),
    revokedAt: null,
  })
  return { accessToken, refreshToken }
}

export const authService = {
  async login({ username, password }) {
    // passwordHash is `select: false`, so fetch it explicitly for verification only.
    const record = await User.findOne({ username }).select('+passwordHash').lean()
    const user = deepNormalize(record)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new HttpError(401, 'Invalid username or password')
    }
    if (user.status !== 'active') {
      throw new HttpError(403, 'Account is not active')
    }
    return { user: publicUser(user), ...(await issueTokens(user)) }
  },

  async refresh(refreshToken) {
    const payload = verifyToken(refreshToken, env.jwtRefreshSecret)
    const session = await findOne('refreshTokens', { token: refreshToken, revokedAt: null })
    if (!payload?.sub || !session) {
      throw new HttpError(401, 'Invalid refresh token')
    }
    const user = await findById('users', payload.sub)
    if (!user) throw new HttpError(401, 'Invalid refresh token')
    return { user: publicUser(user), ...(await issueTokens(user)) }
  },

  async me(userId) {
    const user = await findById('users', userId)
    if (!user) throw new HttpError(404, 'User not found')
    return publicUser(user)
  },

  async logout(refreshToken) {
    if (!refreshToken) return
    const session = await findOne('refreshTokens', { token: refreshToken })
    if (session) await remove('refreshTokens', session.id)
  },
}
