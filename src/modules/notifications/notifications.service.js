import { createCrudService } from '../../services/crudService.js'

const crud = createCrudService('notifications', { searchable: ['title', 'body', 'audience', 'status'] })

export const notificationsService = {
  ...crud,
  create(payload) {
    return crud.create({
      ...payload,
      audience: payload.audience || 'all',
      status: payload.status || 'draft',
    })
  },
  send(id) {
    return crud.update(id, { status: 'sent', sentAt: new Date().toISOString() })
  },
}
