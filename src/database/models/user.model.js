import mongoose from 'mongoose'
import { Roles } from '../../config/roles.js'
import { baseModelPlugin } from './plugins.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [40, 'Username must be at most 40 characters'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
    select: false,
  },
  name: { type: String, trim: true, default: '', maxlength: 120 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: {
      validator: (v) => v === '' || EMAIL_RE.test(v),
      message: 'Invalid email address',
    },
  },
  role: {
    type: String,
    enum: { values: Object.values(Roles), message: 'Invalid role: {VALUE}' },
    default: Roles.USER,
    index: true,
  },
  status: {
    type: String,
    enum: { values: ['active', 'suspended', 'inactive'], message: 'Invalid status: {VALUE}' },
    default: 'active',
    index: true,
  },
})

userSchema.plugin(baseModelPlugin)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
