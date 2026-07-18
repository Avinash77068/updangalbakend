import { createCrudService } from '../../services/crudService.js'
import { slugify } from '../../utils/slug.js'

const crud = createCrudService('categories', { searchable: ['name', 'nameHindi', 'slug'] })

export const categoriesService = {
  ...crud,
  create(payload) {
    return crud.create({
      ...payload,
      slug: payload.slug || slugify(payload.name),
      isActive: payload.isActive ?? true,
      order: payload.order ?? 999,
    })
  },
}
