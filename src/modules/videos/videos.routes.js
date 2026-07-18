import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createVideoSchema, updateVideoSchema } from '../../validations/videos.validation.js'
import { videosController } from './videos.controller.js'

export const videosRoutes = Router()

videosRoutes.get('/', asyncHandler(videosController.list))
videosRoutes.get('/:id', asyncHandler(videosController.get))
videosRoutes.post('/', authenticate, authorize(permissions.contentWrite), validateRequest(createVideoSchema), asyncHandler(videosController.create))
videosRoutes.patch('/:id', authenticate, authorize(permissions.contentWrite), validateRequest(updateVideoSchema, { mode: 'update' }), asyncHandler(videosController.update))
videosRoutes.delete('/:id', authenticate, authorize(permissions.contentPublish), asyncHandler(videosController.remove))
