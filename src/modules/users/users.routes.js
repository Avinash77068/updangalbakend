import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createUserSchema, updateUserSchema } from '../../validations/users.validation.js'
import { usersController } from './users.controller.js'

export const usersRoutes = Router()

usersRoutes.use(authenticate, authorize(permissions.manageUsers))
usersRoutes.get('/', asyncHandler(usersController.list))
usersRoutes.get('/:id', asyncHandler(usersController.get))
usersRoutes.post('/', validateRequest(createUserSchema), asyncHandler(usersController.create))
usersRoutes.patch('/:id', validateRequest(updateUserSchema, { mode: 'update' }), asyncHandler(usersController.update))
usersRoutes.delete('/:id', asyncHandler(usersController.remove))
