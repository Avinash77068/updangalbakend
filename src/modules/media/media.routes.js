import { Router } from 'express'
import { permissions } from '../../config/roles.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorize.js'
import { upload } from '../../middleware/upload.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { mediaController } from './media.controller.js'

export const mediaRoutes = Router()

mediaRoutes.post('/upload', authenticate, authorize(permissions.contentWrite), upload.single('file'), asyncHandler(mediaController.upload))
