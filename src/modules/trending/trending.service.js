import { createCrudService } from '../../services/crudService.js'
import { findCategory } from '../../services/category.helper.js'

const crud = createCrudService('trendingTopics', { searchable: ['title', 'category'] })

export const trendingService = {
  ...crud,
  async create(payload) {
    const categoryDoc = await findCategory({ category: payload.category })
    return crud.create({
      ...payload,
      category: categoryDoc?.name || payload.category,
      categoryId: categoryDoc?.id || null,
    })
  },
}
