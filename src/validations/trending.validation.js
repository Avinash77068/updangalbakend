export const createTrendingSchema = {
  title: { type: 'string', required: true },
  category: { type: 'string', required: true },
  rank: { type: 'number', min: 0 },
  views: { type: 'string' },
  isHot: { type: 'boolean' },
}

export const updateTrendingSchema = {
  title: { type: 'string' },
  category: { type: 'string' },
  rank: { type: 'number', min: 0 },
  views: { type: 'string' },
  isHot: { type: 'boolean' },
}
