import { createCrudController } from '../../services/crudController.js'
import { categoriesService } from './categories.service.js'

export const categoriesController = createCrudController(categoriesService)
