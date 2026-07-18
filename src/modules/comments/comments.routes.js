import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate, optionalAuth } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { createCommentSchema, updateCommentSchema } from '../../validations/comments.validation.js'
import { commentsController } from './comments.controller.js'

export const commentsRoutes = Router()

commentsRoutes.get('/', asyncHandler(commentsController.list))
commentsRoutes.post('/', optionalAuth, validateRequest(createCommentSchema), asyncHandler(commentsController.create))
commentsRoutes.patch('/:id', authenticate, authorize(permissions.contentPublish), validateRequest(updateCommentSchema, { mode: 'update' }), asyncHandler(commentsController.update))
commentsRoutes.delete('/:id', authenticate, authorize(permissions.contentPublish), asyncHandler(commentsController.remove))
