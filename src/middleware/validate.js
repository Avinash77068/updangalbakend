import { HttpError } from '../utils/httpError.js'

// --- Declarative request validation ----------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function checkField(name, value, rules) {
  if (value === undefined || value === null || value === '') {
    if (rules.required) return `${name} is required`
    return null
  }

  switch (rules.type) {
    case 'string':
    case 'email':
      if (typeof value !== 'string') return `${name} must be a string`
      if (rules.type === 'email' && !EMAIL_RE.test(value)) return `${name} must be a valid email`
      if (rules.minLength && value.length < rules.minLength) return `${name} must be at least ${rules.minLength} characters`
      if (rules.maxLength && value.length > rules.maxLength) return `${name} must be at most ${rules.maxLength} characters`
      break
    case 'number':
      if (typeof value !== 'number' || Number.isNaN(value)) return `${name} must be a number`
      if (rules.min !== undefined && value < rules.min) return `${name} must be >= ${rules.min}`
      if (rules.max !== undefined && value > rules.max) return `${name} must be <= ${rules.max}`
      break
    case 'boolean':
      if (typeof value !== 'boolean') return `${name} must be a boolean`
      break
    case 'array':
      if (!Array.isArray(value)) return `${name} must be an array`
      break
    case 'object':
      if (typeof value !== 'object' || Array.isArray(value)) return `${name} must be an object`
      break
    default:
      break
  }

  if (rules.enum && !rules.enum.includes(value)) {
    return `${name} must be one of: ${rules.enum.join(', ')}`
  }
  return null
}

/**
 * Builds a middleware that validates `req.body` against a schema and strips
 * any field not declared in the schema (whitelist -> prevents mass assignment).
 *
 * schema: { fieldName: { type, required, enum, min, max, minLength, maxLength } }
 * `mode: 'update'` treats all fields as optional (for PATCH).
 */
export function validateRequest(schema, { mode = 'create' } = {}) {
  return (req, _res, next) => {
    const body = req.body || {}
    const errors = {}
    const clean = {}

    for (const [field, rawRules] of Object.entries(schema)) {
      const rules = mode === 'update' ? { ...rawRules, required: false } : rawRules
      const error = checkField(field, body[field], rules)
      if (error) {
        errors[field] = error
        continue
      }
      if (body[field] !== undefined) clean[field] = body[field]
    }

    if (Object.keys(errors).length > 0) {
      return next(new HttpError(422, 'Validation failed', errors))
    }

    req.body = clean
    return next()
  }
}
