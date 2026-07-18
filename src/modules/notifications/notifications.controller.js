import { createCrudController } from '../../services/crudController.js'
import { ok } from '../../utils/response.js'
import { notificationsService } from './notifications.service.js'

export const notificationsController = {
  ...createCrudController(notificationsService),
  async send(req, res) {
    return ok(res, await notificationsService.send(req.params.id))
  },
}
