import { createCrudService } from '../../services/crudService.js'

const crud = createCrudService('ads', { searchable: ['title', 'sponsor', 'placement', 'type'] })

export const adsService = {
  ...crud,
  async list(query) {
    // Hide inactive ads by default; push the filter to the DB so pagination stays correct.
    const scoped = { ...query }
    if (query.includeInactive !== 'true') scoped.isActive = 'true'
    // Ads have no publishedAt field — default to `order` so position/order
    // actually control sequencing unless the caller asks for a different sort.
    if (!scoped.sortBy) {
      scoped.sortBy = 'order'
      scoped.order = scoped.order || 'asc'
    }
    return crud.list(scoped)
  },
  async create(payload) {
    return crud.create({ ...payload, isActive: payload.isActive ?? true })
  },
}
