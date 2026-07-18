import path from 'node:path'
import multer from 'multer'
import { env } from '../config/env.js'

const storage = multer.diskStorage({
  destination: env.uploadDir,
  filename: (_req, file, callback) => {
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
    callback(null, `${Date.now()}-${safeName}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4']
    callback(null, allowed.includes(path.extname(file.originalname).toLowerCase()))
  },
})
