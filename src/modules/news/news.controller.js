import { createCrudController } from '../../services/crudController.js'
import { ok } from '../../utils/response.js'
import { newsService } from './news.service.js'

export const newsController = {
  ...createCrudController(newsService),
  async publish(req, res) {
    return ok(res, await newsService.publish(req.params.id))
  },
  async schedule(req, res) {
    return ok(res, await newsService.schedule(req.params.id, req.body.scheduledAt))
  },
}
