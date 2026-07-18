import { list } from '../../database/store.js'
import { ok } from '../../utils/response.js'

function matches(value, q) {
  return String(value || '').toLowerCase().includes(q)
}

export const searchController = {
  async search(req, res) {
    const q = String(req.query.q || '').toLowerCase().trim()
    if (!q) return ok(res, { articles: [], videos: [], categories: [], ads: [] })

    const [allArticles, allVideos, allCategories, allAds] = await Promise.all([
      list('articles'),
      list('videos'),
      list('categories'),
      list('ads'),
    ])

    const articles = allArticles.filter((item) =>
      [item.title, item.excerpt, item.category, ...(item.tags || [])].some((field) => matches(field, q))
    )
    const videos = allVideos.filter((item) => [item.title, item.category].some((field) => matches(field, q)))
    const categories = allCategories.filter((item) => [item.name, item.nameHindi, item.slug].some((field) => matches(field, q)))
    const ads = allAds.filter((item) => [item.title, item.sponsor, item.placement].some((field) => matches(field, q)))

    return ok(res, { articles, videos, categories, ads })
  },
}
