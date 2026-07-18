import os from 'node:os'
import path from 'node:path'
import multer from 'multer'
import { env } from '../config/env.js'

// multer's diskStorage mkdir()s the destination at construction time.
// On serverless (Vercel) the project filesystem is read-only — only the
// OS temp dir is writable — so point uploads there to avoid an EROFS crash
// at startup. NOTE: files written here are ephemeral and are NOT served by
// the static handler; persistent uploads need object storage (S3/Cloudinary).
const uploadDestination = process.env.VERCEL
  ? path.join(os.tmpdir(), env.uploadDir)
  : env.uploadDir

const storage = multer.diskStorage({
  destination: uploadDestination,
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
