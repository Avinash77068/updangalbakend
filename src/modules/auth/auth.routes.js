import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { loginSchema, refreshSchema } from '../../validations/auth.validation.js'
import { authController } from './auth.controller.js'

export const authRoutes = Router()

authRoutes.post('/login', validateRequest(loginSchema), asyncHandler(authController.login))
authRoutes.post('/refresh', validateRequest(refreshSchema), asyncHandler(authController.refresh))
authRoutes.get('/me', authenticate, asyncHandler(authController.me))
authRoutes.post('/logout', asyncHandler(authController.logout))
