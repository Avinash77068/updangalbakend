import { list } from '../../database/store.js'
import { ok } from '../../utils/response.js'

export const analyticsController = {
  async dashboard(_req, res) {
    const [articles, ads, comments, users] = await Promise.all([
      list('articles'),
      list('ads'),
      list('comments'),
      list('users'),
    ])

    return ok(res, {
      totals: {
        articles: articles.length,
        published: articles.filter((item) => item.status === 'published').length,
        drafts: articles.filter((item) => item.status === 'draft').length,
        scheduled: articles.filter((item) => item.status === 'scheduled').length,
        ads: ads.length,
        activeAds: ads.filter((item) => item.isActive).length,
        comments: comments.length,
        pendingComments: comments.filter((item) => item.status === 'pending').length,
        users: users.length,
      },
      topArticles: articles
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map((item) => ({ id: item.id, title: item.title, views: item.views || 0 })),
      byCategory: articles.reduce((acc, item) => {
        acc[item.categorySlug] = (acc[item.categorySlug] || 0) + 1
        return acc
      }, {}),
    })
  },
}
