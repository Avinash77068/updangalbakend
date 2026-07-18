import { createCrudService } from '../../services/crudService.js'
import { findById, findOne } from '../../database/store.js'
import { HttpError } from '../../utils/httpError.js'
import { slugify } from '../../utils/slug.js'

const crud = createCrudService('articles', {
  searchable: ['title', 'excerpt', 'category', 'categorySlug'],
})

// Resolves the Category relationship from whatever the client sent
// (categoryId, categorySlug, or category name) and returns the synced
// denormalized fields the public API/frontend rely on.
async function resolveCategory({ categoryId, categorySlug, category }) {
  let doc = null
  if (categoryId) doc = await findById('categories', categoryId)
  if (!doc && categorySlug) doc = await findOne('categories', { slug: slugify(categorySlug) })
  if (!doc && category) doc = await findOne('categories', { name: category })

  if (!doc) {
    throw new HttpError(422, 'Validation failed', {
      categorySlug: 'Unknown category — provide a valid categoryId, categorySlug, or category name',
    })
  }
  return { categoryId: doc.id, category: doc.name, categorySlug: doc.slug }
}

export const newsService = {
  ...crud,
  async create(payload) {
    const status = payload.status || 'draft'
    const category = await resolveCategory(payload)
    return crud.create({
      ...payload,
      ...category,
      slug: payload.slug || slugify(payload.title),
      status,
      publishedAt:
        status === 'published' ? payload.publishedAt || new Date().toISOString() : payload.publishedAt || null,
      author: payload.author || { name: 'UpDangal Desk', avatar: '', role: 'Desk' },
      views: payload.views || 0,
      readTime: payload.readTime || 4,
      seo: payload.seo || { title: payload.title, description: payload.excerpt },
    })
  },
  async update(id, payload) {
    const next = { ...payload }
    // Only re-resolve the category when the client is changing it.
    if (payload.categoryId || payload.categorySlug || payload.category) {
      Object.assign(next, await resolveCategory(payload))
    }
    return crud.update(id, next)
  },
  publish(id) {
    return crud.update(id, { status: 'published', publishedAt: new Date().toISOString() })
  },
  schedule(id, scheduledAt) {
    return crud.update(id, { status: 'scheduled', scheduledAt })
  },
}
