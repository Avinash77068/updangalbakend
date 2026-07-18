import { Router } from 'express'
import { adsRoutes } from '../modules/ads/ads.routes.js'
import { analyticsRoutes } from '../modules/analytics/analytics.routes.js'
import { authRoutes } from '../modules/auth/auth.routes.js'
import { categoriesRoutes } from '../modules/categories/categories.routes.js'
import { commentsRoutes } from '../modules/comments/comments.routes.js'
import { mediaRoutes } from '../modules/media/media.routes.js'
import { newsRoutes } from '../modules/news/news.routes.js'
import { notificationsRoutes } from '../modules/notifications/notifications.routes.js'
import { searchRoutes } from '../modules/search/search.routes.js'
import { tagsRoutes } from '../modules/tags/tags.routes.js'
import { trendingRoutes } from '../modules/trending/trending.routes.js'
import { usersRoutes } from '../modules/users/users.routes.js'
import { videosRoutes } from '../modules/videos/videos.routes.js'

export const apiRoutes = Router()

apiRoutes.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})

apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/users', usersRoutes)
apiRoutes.use('/news', newsRoutes)
apiRoutes.use('/categories', categoriesRoutes)
apiRoutes.use('/ads', adsRoutes)
apiRoutes.use('/comments', commentsRoutes)
apiRoutes.use('/analytics', analyticsRoutes)
apiRoutes.use('/notifications', notificationsRoutes)
apiRoutes.use('/videos', videosRoutes)
apiRoutes.use('/trending', trendingRoutes)
apiRoutes.use('/tags', tagsRoutes)
apiRoutes.use('/search', searchRoutes)
apiRoutes.use('/media', mediaRoutes)
