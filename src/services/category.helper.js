import { findById, findOne } from '../database/store.js'
import { slugify } from '../utils/slug.js'

/**
 * Resolves a Category document from any of the identifiers a client might send:
 * categoryId (ObjectId), categorySlug, or category (display name).
 * Returns the Category or null.
 */
export async function findCategory({ categoryId, categorySlug, category } = {}) {
  if (categoryId) {
    const byId = await findById('categories', categoryId)
    if (byId) return byId
  }
  if (categorySlug) {
    const bySlug = await findOne('categories', { slug: slugify(categorySlug) })
    if (bySlug) return bySlug
  }
  if (category) {
    const byName = await findOne('categories', { name: category })
    if (byName) return byName
  }
  return null
}
