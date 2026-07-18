import { ok } from '../../utils/response.js'
import { createCrudController } from '../../services/crudController.js'
import { list } from '../../database/store.js'
import { trendingService } from './trending.service.js'

export const trendingController = {
  ...createCrudController(trendingService),
  async breaking(_req, res) {
    const items = await list('breakingNews', { isActive: true }, { sort: { order: 1 } })
    return ok(res, items.map((item) => item.text))
  },
}
