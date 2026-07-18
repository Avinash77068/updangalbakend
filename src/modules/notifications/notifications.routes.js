import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createNotificationSchema, updateNotificationSchema } from '../../validations/notifications.validation.js'
import { notificationsController } from './notifications.controller.js'

export const notificationsRoutes = Router()

notificationsRoutes.use(authenticate, authorize(permissions.contentPublish))
notificationsRoutes.get('/', asyncHandler(notificationsController.list))
notificationsRoutes.post('/', validateRequest(createNotificationSchema), asyncHandler(notificationsController.create))
notificationsRoutes.patch('/:id', validateRequest(updateNotificationSchema, { mode: 'update' }), asyncHandler(notificationsController.update))
notificationsRoutes.post('/:id/send', asyncHandler(notificationsController.send))
notificationsRoutes.delete('/:id', asyncHandler(notificationsController.remove))
