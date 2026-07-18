import { createCrudService } from '../../services/crudService.js'

const crud = createCrudService('comments', { searchable: ['body', 'authorName', 'status'] })

export const commentsService = {
  ...crud,
  async create(payload) {
    // articleId/userId are cast to ObjectId references by the schema.
    return crud.create({
      ...payload,
      status: payload.status || 'pending',
    })
  },
}
