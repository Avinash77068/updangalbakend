import { Roles } from '../config/roles.js'

export const createUserSchema = {
  username: { type: 'string', required: true, minLength: 3, maxLength: 40 },
  name: { type: 'string', required: true, maxLength: 120 },
  email: { type: 'email', required: true },
  password: { type: 'string', minLength: 6, maxLength: 200 },
  role: { type: 'string', enum: Object.values(Roles) },
  status: { type: 'string', enum: ['active', 'suspended', 'inactive'] },
}

export const updateUserSchema = {
  username: { type: 'string', minLength: 3, maxLength: 40 },
  name: { type: 'string', maxLength: 120 },
  email: { type: 'email' },
  password: { type: 'string', minLength: 6, maxLength: 200 },
  role: { type: 'string', enum: Object.values(Roles) },
  status: { type: 'string', enum: ['active', 'suspended', 'inactive'] },
}
