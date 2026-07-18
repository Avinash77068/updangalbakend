export function parseListQuery(query) {
  const page = Math.max(Number(query.page || 1), 1)
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100)
  const sortBy = query.sortBy || 'publishedAt'
  const order = query.order === 'asc' ? 'asc' : 'desc'
  return { page, limit, sortBy, order }
}

export function buildSort(sortBy, order) {
  return { [sortBy]: order === 'asc' ? 1 : -1 }
}

export function buildMeta({ page, limit, total, sortBy, order }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
    sortBy,
    order,
  }
}
