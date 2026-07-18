import { insert, paginate, remove, update, findById } from '../database/store.js'
import { assertFound, HttpError } from '../utils/httpError.js'
import { parseListQuery, buildSort, buildMeta } from '../utils/pagination.js'

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function createCrudService(collectionName, options = {}) {
  const searchable = options.searchable || ['title', 'name']

  // Translates the public query string into a MongoDB filter document.
  function buildFilter(query = {}) {
    const conditions = []

    if (query.status) conditions.push({ status: query.status })
    if (query.type) conditions.push({ type: query.type })
    if (query.placement) conditions.push({ placement: query.placement })
    if (query.position) conditions.push({ position: query.position })
    if (query.category) conditions.push({ $or: [{ categorySlug: query.category }, { category: query.category }] })
    if (query.isShort !== undefined) conditions.push({ isShort: String(query.isShort) === 'true' })
    if (query.isActive !== undefined) conditions.push({ isActive: String(query.isActive) === 'true' })
    if (query.featured === 'trending') conditions.push({ isTrending: true })
    if (query.featured === 'breaking') conditions.push({ isBreaking: true })
    if (query.q) {
      const regex = new RegExp(escapeRegex(String(query.q)), 'i')
      conditions.push({ $or: searchable.map((field) => ({ [field]: regex })) })
    }

    return conditions.length ? { $and: conditions } : {}
  }

  return {
    async list(query = {}) {
      const { page, limit, sortBy, order } = parseListQuery(query)
      const filter = buildFilter(query)
      const { items, total } = await paginate(collectionName, filter, {
        page,
        limit,
        sort: buildSort(sortBy, order),
      })
      return { items, meta: buildMeta({ page, limit, total, sortBy, order }) }
    },
    async get(id) {
      return assertFound(await findById(collectionName, id))
    },
    async create(payload) {
      return insert(collectionName, payload)
    },
    async update(id, payload) {
      return assertFound(await update(collectionName, id, payload))
    },
    async delete(id) {
      if (!(await remove(collectionName, id))) throw new HttpError(404, 'Resource not found')
    },
  }
}
