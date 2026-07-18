import crypto from 'node:crypto'
import { Roles } from '../../config/roles.js'
import { createCrudService } from '../../services/crudService.js'
import { hashPassword } from '../../utils/password.js'

const crud = createCrudService('users', { searchable: ['name', 'email', 'username', 'role'] })

function safe(user) {
  if (!user) return user
  const { passwordHash, ...publicUser } = user
  return publicUser
}

export const usersService = {
  async list(query) {
    const result = await crud.list(query)
    result.items = result.items.map(safe)
    return result
  },
  async get(id) {
    return safe(await crud.get(id))
  },
  async create(payload) {
    // No fixed default password: generate a strong random one when none is supplied.
    const password = payload.password || crypto.randomBytes(24).toString('base64url')
    return safe(await crud.create({
      ...payload,
      role: payload.role || Roles.USER,
      status: payload.status || 'active',
      passwordHash: hashPassword(password),
    }))
  },
  async update(id, payload) {
    const next = { ...payload }
    if (payload.password) {
      next.passwordHash = hashPassword(payload.password)
      delete next.password
    }
    return safe(await crud.update(id, next))
  },
  async delete(id) {
    return crud.delete(id)
  },
}
