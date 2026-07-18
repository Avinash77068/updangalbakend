import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createTagSchema } from '../../validations/tags.validation.js'
import { tagsController } from './tags.controller.js'

export const tagsRoutes = Router()

tagsRoutes.get('/', asyncHandler(tagsController.list))
tagsRoutes.post('/', authenticate, authorize(permissions.contentWrite), validateRequest(createTagSchema), asyncHandler(tagsController.create))
tagsRoutes.delete('/:name', authenticate, authorize(permissions.contentPublish), asyncHandler(tagsController.remove))
