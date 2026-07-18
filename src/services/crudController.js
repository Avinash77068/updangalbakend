import { ok, created, noContent } from '../utils/response.js'

export function createCrudController(service) {
  return {
    async list(req, res) {
      const { items, meta } = await service.list(req.query)
      return ok(res, items, meta)
    },
    async get(req, res) {
      return ok(res, await service.get(req.params.id))
    },
    async create(req, res) {
      return created(res, await service.create(req.body))
    },
    async update(req, res) {
      return ok(res, await service.update(req.params.id, req.body))
    },
    async remove(req, res) {
      await service.delete(req.params.id)
      return noContent(res)
    },
  }
}
