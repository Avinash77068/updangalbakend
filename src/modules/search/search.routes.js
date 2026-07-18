import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { searchController } from './search.controller.js'

export const searchRoutes = Router()

searchRoutes.get('/', asyncHandler(searchController.search))
