import { createCrudController } from '../../services/crudController.js'
import { adsService } from './ads.service.js'

export const adsController = createCrudController(adsService)
