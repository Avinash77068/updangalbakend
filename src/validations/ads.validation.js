const AD_TYPES = ['leaderboard', 'sidebar', 'inline', 'sponsored', 'mobile-sticky']
const AD_POSITIONS = ['left', 'right', 'top', 'bottom']

export const createAdSchema = {
  type: { type: 'string', required: true, enum: AD_TYPES },
  placement: { type: 'string', required: true },
  position: { type: 'string', enum: AD_POSITIONS },
  order: { type: 'number', min: 0 },
  title: { type: 'string', required: true },
  description: { type: 'string' },
  ctaText: { type: 'string', required: true },
  sponsor: { type: 'string', required: true },
  tagline: { type: 'string' },
  bgColor: { type: 'string' },
  image: { type: 'string' },
  isActive: { type: 'boolean' },
}

export const updateAdSchema = {
  type: { type: 'string', enum: AD_TYPES },
  placement: { type: 'string' },
  position: { type: 'string', enum: AD_POSITIONS },
  order: { type: 'number', min: 0 },
  title: { type: 'string' },
  description: { type: 'string' },
  ctaText: { type: 'string' },
  sponsor: { type: 'string' },
  tagline: { type: 'string' },
  bgColor: { type: 'string' },
  image: { type: 'string' },
  isActive: { type: 'boolean' },
}
