import { findOne, insert, list, remove } from '../../database/store.js'
import { ok, created, noContent } from '../../utils/response.js'
import { slugify } from '../../utils/slug.js'

export const tagsController = {
  async list(_req, res) {
    const tags = await list('tags', {}, { sort: { name: 1 } })
    return ok(res, tags.map((tag) => tag.name))
  },
  async create(req, res) {
    const name = String(req.body.name).trim()
    const slug = slugify(name)
    const existing = await findOne('tags', { slug })
    if (existing) return created(res, existing.name)
    const tag = await insert('tags', { name, slug })
    return created(res, tag.name)
  },
  async remove(req, res) {
    const slug = slugify(req.params.name)
    const tag = await findOne('tags', { slug })
    if (tag) await remove('tags', tag.id)
    return noContent(res)
  },
}
