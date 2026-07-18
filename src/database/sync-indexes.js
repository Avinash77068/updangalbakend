/**
 * Syncs every model's indexes with its schema definition: creates missing
 * indexes and drops/recreates any whose options changed (e.g. a non-unique
 * index that should now be unique). Run after deploying schema/index changes.
 *
 * Usage: npm run sync-indexes
 */
import { connectDB, disconnectDB } from '../config/db.js'
import { models } from './models/index.js'

async function run() {
  await connectDB()
  for (const [name, model] of Object.entries(models)) {
    const result = await model.syncIndexes()
    console.log(`Synced ${name}${result?.length ? ` (dropped: ${result.join(', ')})` : ''}`)
  }
  await disconnectDB()
  console.log('Index sync complete.')
  process.exit(0)
}

run().catch(async (error) => {
  console.error('Index sync failed:', error)
  await disconnectDB().catch(() => {})
  process.exit(1)
})
