import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createArticleSchema, scheduleArticleSchema } from '../../validations/news.validation.js'
import { newsController } from './news.controller.js'

export const newsRoutes = Router()

newsRoutes.get('/', asyncHandler(newsController.list))
newsRoutes.get('/:id', asyncHandler(newsController.get))
newsRoutes.post('/', authenticate, authorize(permissions.contentWrite), validateRequest(createArticleSchema), asyncHandler(newsController.create))
newsRoutes.patch('/:id', authenticate, authorize(permissions.contentWrite), validateRequest(createArticleSchema, { mode: 'update' }), asyncHandler(newsController.update))
newsRoutes.delete('/:id', authenticate, authorize(permissions.contentPublish), asyncHandler(newsController.remove))
newsRoutes.post('/:id/publish', authenticate, authorize(permissions.contentPublish), asyncHandler(newsController.publish))
newsRoutes.post('/:id/schedule', authenticate, authorize(permissions.contentPublish), validateRequest(scheduleArticleSchema), asyncHandler(newsController.schedule))
