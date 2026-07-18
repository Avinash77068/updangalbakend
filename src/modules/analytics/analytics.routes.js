import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { analyticsController } from './analytics.controller.js'

export const analyticsRoutes = Router()

analyticsRoutes.get('/dashboard', authenticate, authorize(permissions.viewAnalytics), asyncHandler(analyticsController.dashboard))
