/**
 * One-time backfill: assigns `position`/`order` to ads created before those
 * fields existed, based on their current (hardcoded) visual placement, so the
 * frontend can render them purely from data. Idempotent — skips ads that
 * already have a position set explicitly by an admin.
 *
 * Usage: npm run backfill:ad-position
 */
import { connectDB, disconnectDB } from '../config/db.js'
import { Ad } from './models/index.js'

// Matches the ad's role in the current UI by title, in the exact order the
// old array-index-based code (page.tsx / Sidebar.tsx) used to render them.
const SIDEBAR_POSITION_BY_ORDER = ['left', 'right', 'bottom']

// Mongoose only applies schema defaults to newly-created documents, not to
// existing ones read back from the DB — so pre-existing ads have no
// `position` field in storage at all (not merely the default value).
const NOT_YET_SET = { $or: [{ position: { $exists: false } }, { position: null }] }

async function run() {
  await connectDB()

  const leaderboards = await Ad.find({ type: 'leaderboard', ...NOT_YET_SET })
  for (const ad of leaderboards) {
    ad.position = 'bottom'
    await ad.save()
    console.log(`leaderboard "${ad.title}" -> position=bottom`)
  }

  const sidebarAds = await Ad.find({ type: 'sidebar', ...NOT_YET_SET }).sort({ createdAt: 1 })
  for (const [index, ad] of sidebarAds.entries()) {
    ad.position = SIDEBAR_POSITION_BY_ORDER[index] || 'right'
    ad.order = index
    await ad.save()
    console.log(`sidebar "${ad.title}" -> position=${ad.position}, order=${ad.order}`)
  }

  const inlineAds = await Ad.find({ type: 'inline' }).sort({ createdAt: 1 })
  for (const [index, ad] of inlineAds.entries()) {
    ad.order = index
    await ad.save()
    console.log(`inline "${ad.title}" -> order=${index}`)
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
