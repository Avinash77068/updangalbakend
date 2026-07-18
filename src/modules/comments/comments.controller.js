import { createCrudController } from '../../services/crudController.js'
import { commentsService } from './comments.service.js'

export const commentsController = createCrudController(commentsService)
