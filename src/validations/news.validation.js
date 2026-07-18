export const createArticleSchema = {
  title: { type: 'string', required: true, maxLength: 300 },
  excerpt: { type: 'string', maxLength: 600 },
  content: { type: 'string' },
  slug: { type: 'string', maxLength: 300 },
  category: { type: 'string' },
  categorySlug: { type: 'string', required: true },
  image: { type: 'string' },
  imageAlt: { type: 'string' },
  author: { type: 'object' },
  status: { type: 'string', enum: ['draft', 'scheduled', 'published'] },
  scheduledAt: { type: 'string' },
  publishedAt: { type: 'string' },
  readTime: { type: 'number', min: 1 },
  isLive: { type: 'boolean' },
  isTrending: { type: 'boolean' },
  isBreaking: { type: 'boolean' },
  views: { type: 'number', min: 0 },
  tags: { type: 'array' },
  seo: { type: 'object' },
}

export const scheduleArticleSchema = {
  scheduledAt: { type: 'string', required: true },
}
