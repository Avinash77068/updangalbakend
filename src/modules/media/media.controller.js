import { env } from '../../config/env.js'
import { created } from '../../utils/response.js'
import { HttpError } from '../../utils/httpError.js'

export const mediaController = {
  upload(req, res) {
    if (!req.file) throw new HttpError(422, 'File is required')
    return created(res, {
      filename: req.file.filename,
      path: `/${env.uploadDir}/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    })
  },
}
