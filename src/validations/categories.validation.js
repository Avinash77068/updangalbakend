export const createCategorySchema = {
  name: { type: 'string', required: true, maxLength: 80 },
  slug: { type: 'string' },
  nameHindi: { type: 'string', required: true },
  color: { type: 'string', required: true },
  bgColor: { type: 'string', required: true },
  order: { type: 'number', min: 0 },
  isActive: { type: 'boolean' },
}

export const updateCategorySchema = {
  name: { type: 'string', maxLength: 80 },
  slug: { type: 'string' },
  nameHindi: { type: 'string' },
  color: { type: 'string' },
  bgColor: { type: 'string' },
  order: { type: 'number', min: 0 },
  isActive: { type: 'boolean' },
}
