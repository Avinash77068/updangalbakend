import { createCrudService } from '../../services/crudService.js'
import { findCategory } from '../../services/category.helper.js'

const crud = createCrudService('videos', { searchable: ['title', 'category'] })

export const videosService = {
  ...crud,
  async create(payload) {
    // category (display name) is required; link the normalized ref when it matches a Category.
    const categoryDoc = await findCategory({ category: payload.category })
    return crud.create({
      ...payload,
      category: categoryDoc?.name || payload.category,
      categoryId: categoryDoc?.id || null,
      isShort: payload.isShort ?? false,
      publishedAt: payload.publishedAt || new Date().toISOString(),
      author: payload.author || { name: 'UpDangal Video', avatar: '' },
    })
  },
}
