export const createVideoSchema = {
  title: { type: 'string', required: true, maxLength: 300 },
  thumbnail: { type: 'string', required: true },
  duration: { type: 'string', required: true },
  views: { type: 'string' },
  publishedAt: { type: 'string' },
  category: { type: 'string', required: true },
  isShort: { type: 'boolean' },
  author: { type: 'object' },
}

export const updateVideoSchema = {
  title: { type: 'string', maxLength: 300 },
  thumbnail: { type: 'string' },
  duration: { type: 'string' },
  views: { type: 'string' },
  publishedAt: { type: 'string' },
  category: { type: 'string' },
  isShort: { type: 'boolean' },
  author: { type: 'object' },
}
