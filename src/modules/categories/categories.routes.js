import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createCategorySchema, updateCategorySchema } from '../../validations/categories.validation.js'
import { categoriesController } from './categories.controller.js'

export const categoriesRoutes = Router()

categoriesRoutes.get('/', asyncHandler(categoriesController.list))
categoriesRoutes.get('/:id', asyncHandler(categoriesController.get))
categoriesRoutes.post('/', authenticate, authorize(permissions.contentPublish), validateRequest(createCategorySchema), asyncHandler(categoriesController.create))
categoriesRoutes.patch('/:id', authenticate, authorize(permissions.contentPublish), validateRequest(updateCategorySchema, { mode: 'update' }), asyncHandler(categoriesController.update))
categoriesRoutes.delete('/:id', authenticate, authorize(permissions.contentPublish), asyncHandler(categoriesController.remove))
