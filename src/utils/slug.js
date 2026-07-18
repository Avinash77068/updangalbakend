export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
