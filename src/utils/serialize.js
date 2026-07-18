import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

/**
 * Recursively converts a Mongoose/lean document into a plain, API-safe object:
 * - `_id` (ObjectId) becomes a string `id`
 * - any ObjectId (e.g. unpopulated references) becomes its hex string
 * - Date values become ISO strings
 * - `__v` is dropped
 * Populated references become nested normalized objects automatically.
 */
export function deepNormalize(value) {
  if (value === null || value === undefined) return value
  if (value instanceof ObjectId) return value.toString()
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(deepNormalize)

  if (typeof value === 'object') {
    // Handle Buffer / other non-plain objects gracefully.
    if (typeof value.toHexString === 'function') return value.toHexString()

    const output = {}
    for (const [key, val] of Object.entries(value)) {
      if (key === '__v') continue
      if (key === '_id') {
        output.id = deepNormalize(val)
        continue
      }
      output[key] = deepNormalize(val)
    }
    return output
  }

  return value
}
