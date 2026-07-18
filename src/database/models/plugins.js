import { deepNormalize } from '../../utils/serialize.js'

/**
 * Applies production defaults to every schema:
 * - `timestamps` (createdAt / updatedAt)
 * - a consistent `toJSON` / `toObject` transform that exposes `id` and hides `_id`/`__v`
 * Storage-layer reads go through `deepNormalize` (lean), but this keeps hydrated
 * Mongoose documents consistent when serialized directly (e.g. auth flows).
 */
export function baseModelPlugin(schema) {
  schema.set('timestamps', true)

  const transform = (_doc, ret) => deepNormalize(ret)

  schema.set('toJSON', { virtuals: false, versionKey: false, transform })
  schema.set('toObject', { virtuals: false, versionKey: false, transform })
}
