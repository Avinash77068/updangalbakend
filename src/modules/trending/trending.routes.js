import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createTrendingSchema, updateTrendingSchema } from '../../validations/trending.validation.js'
import { trendingController } from './trending.controller.js'

export const trendingRoutes = Router()

trendingRoutes.get('/', asyncHandler(trendingController.list))
trendingRoutes.get('/breaking', asyncHandler(trendingController.breaking))
trendingRoutes.get('/:id', asyncHandler(trendingController.get))
trendingRoutes.post('/', authenticate, authorize(permissions.contentPublish), validateRequest(createTrendingSchema), asyncHandler(trendingController.create))
trendingRoutes.patch('/:id', authenticate, authorize(permissions.contentPublish), validateRequest(updateTrendingSchema, { mode: 'update' }), asyncHandler(trendingController.update))
trendingRoutes.delete('/:id', authenticate, authorize(permissions.contentPublish), asyncHandler(trendingController.remove))
