import { createCrudController } from '../../services/crudController.js'
import { videosService } from './videos.service.js'

export const videosController = createCrudController(videosService)
