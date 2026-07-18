import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createAdSchema, updateAdSchema } from '../../validations/ads.validation.js'
import { adsController } from './ads.controller.js'

export const adsRoutes = Router()

adsRoutes.get('/', asyncHandler(adsController.list))
adsRoutes.get('/:id', asyncHandler(adsController.get))
adsRoutes.post('/', authenticate, authorize(permissions.manageAds), validateRequest(createAdSchema), asyncHandler(adsController.create))
adsRoutes.patch('/:id', authenticate, authorize(permissions.manageAds), validateRequest(updateAdSchema, { mode: 'update' }), asyncHandler(adsController.update))
adsRoutes.delete('/:id', authenticate, authorize(permissions.manageAds), asyncHandler(adsController.remove))
