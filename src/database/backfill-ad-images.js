/**
 * One-time backfill: rewrites ad `image` values that point at a relative
 * frontend path (e.g. "/ads/rohit.png") to the backend-hosted absolute URL,
 * so ad images are served from the API domain instead of the frontend's
 * public folder. Idempotent — skips ads whose image is already absolute.
 *
 * Usage: npm run backfill:ad-images
 * Override the host with: ASSET_BASE_URL=https://your-api node src/database/backfill-ad-images.js
 */
import { connectDB, disconnectDB } from '../config/db.js'
import { Ad } from './models/index.js'

const ASSET_BASE_URL = (process.env.ASSET_BASE_URL || 'https://updangalbakend.vercel.app').replace(/\/+$/, '')

async function run() {
  await connectDB()

  // Ads whose image is a relative path ("/ads/..." or "ads/...").
  const ads = await Ad.find({ image: { $regex: /^\/?ads\//i } })
  if (ads.length === 0) {
    console.log('No ads with a relative /ads/ image path — nothing to do.')
  }

  for (const ad of ads) {
    const path = ad.image.startsWith('/') ? ad.image : `/${ad.image}`
    const absolute = `${ASSET_BASE_URL}${path}`
    console.log(`"${ad.title}": ${ad.image} -> ${absolute}`)
    ad.image = absolute
    await ad.save()
  }

  await disconnectDB()
  console.log('Backfill complete.')
  process.exit(0)
}

run().catch(async (error) => {
  console.error('Backfill failed:', error)
  await disconnectDB().catch(() => {})
  process.exit(1)
})
