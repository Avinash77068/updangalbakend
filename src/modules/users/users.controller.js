import { createCrudController } from '../../services/crudController.js'
import { usersService } from './users.service.js'

export const usersController = createCrudController(usersService)
