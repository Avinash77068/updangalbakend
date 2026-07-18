/**
 * One-time migration: converts the legacy string primary keys (e.g. 'art-1',
 * 'u-admin') to native MongoDB ObjectIds and wires up the ObjectId references
 * (Article->Category, Comment->Article/User, Video/Trending->Category,
 * RefreshToken->User). Existing field data is preserved (no data loss).
 *
 * Idempotent: if the data already uses ObjectId keys it exits without changes.
 *
 * Usage: npm run migrate
 */
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../config/db.js'
import { models } from './models/index.js'
import { slugify } from '../utils/slug.js'

const { ObjectId } = mongoose.Types

function stripMeta(doc) {
  const { _id, __v, id, createdAt, updatedAt, ...rest } = doc
  return rest
}

async function run() {
  await connectDB()
  const db = mongoose.connection.db

  // 1. Read every collection raw (bypassing schema casting).
  const raw = {}
  for (const [name, model] of Object.entries(models)) {
    raw[name] = await db.collection(model.collection.name).find({}).toArray()
  }

  // 2. Idempotency guard — if users already use ObjectId keys, stop.
  const alreadyMigrated = raw.users.length > 0 && typeof raw.users[0]._id !== 'string'
  if (alreadyMigrated) {
    console.log('Already migrated (ObjectId keys detected). No changes made.')
    await disconnectDB()
    process.exit(0)
  }

  // 3. Assign a new ObjectId to every existing document (keyed by old id).
  const idMap = {}
  for (const [name, docs] of Object.entries(raw)) {
    idMap[name] = new Map()
    for (const d of docs) idMap[name].set(String(d._id), new ObjectId())
  }

  // Category lookups by slug and by display name (for denormalized refs).
  const catBySlug = new Map()
  const catByName = new Map()
  for (const c of raw.categories) {
    catBySlug.set(c.slug, idMap.categories.get(String(c._id)))
    catByName.set(c.name, idMap.categories.get(String(c._id)))
  }

  // 4. Build transformed documents with wired references.
  const build = {
    categories: raw.categories.map((d) => ({ _id: idMap.categories.get(String(d._id)), ...stripMeta(d) })),
    users: raw.users.map((d) => ({ _id: idMap.users.get(String(d._id)), ...stripMeta(d) })),
    ads: raw.ads.map((d) => ({ _id: idMap.ads.get(String(d._id)), ...stripMeta(d) })),
    notifications: raw.notifications.map((d) => ({ _id: idMap.notifications.get(String(d._id)), ...stripMeta(d) })),
    articles: raw.articles.map((d) => ({
      _id: idMap.articles.get(String(d._id)),
      ...stripMeta(d),
      categoryId: catBySlug.get(d.categorySlug) || catByName.get(d.category) || undefined,
    })),
    videos: raw.videos.map((d) => ({
      _id: idMap.videos.get(String(d._id)),
      ...stripMeta(d),
      categoryId: catByName.get(d.category) || null,
    })),
    trendingTopics: raw.trendingTopics.map((d) => ({
      _id: idMap.trendingTopics.get(String(d._id)),
      ...stripMeta(d),
      categoryId: catByName.get(d.category) || null,
    })),
    comments: raw.comments.map((d) => ({
      _id: idMap.comments.get(String(d._id)),
      ...stripMeta(d),
      articleId: idMap.articles.get(String(d.articleId)) || null,
      userId: d.userId ? idMap.users.get(String(d.userId)) || null : null,
    })),
    tags: raw.tags.map((d) => ({
      _id: idMap.tags.get(String(d._id)),
      name: d.name || String(d._id),
      slug: d.slug || slugify(d.name || String(d._id)),
    })),
    breakingNews: raw.breakingNews.map((d) => ({
      _id: idMap.breakingNews.get(String(d._id)),
      text: d.text,
      order: d.order ?? 0,
      isActive: d.isActive ?? true,
    })),
    refreshTokens: raw.refreshTokens
      .map((d) => ({
        _id: idMap.refreshTokens.get(String(d._id)),
        ...stripMeta(d),
        userId: idMap.users.get(String(d.userId)) || null,
      }))
      .filter((d) => d.userId),
  }

  // 5. Replace each collection's contents with the migrated documents
  //    (insertMany runs schema validation + casts strings to Date/ObjectId).
  for (const [name, docs] of Object.entries(build)) {
    const model = models[name]
    await model.collection.deleteMany({})
    if (docs.length) {
      await model.insertMany(docs, { ordered: false })
    }
    console.log(`Migrated ${name}: ${docs.length}`)
  }

  // 6. Sync indexes so unique constraints defined in the schemas actually apply
  //    (drops stale indexes whose options changed, e.g. non-unique -> unique).
  for (const [name, model] of Object.entries(models)) {
    await model.syncIndexes()
    console.log(`Synced indexes: ${name}`)
  }

  await disconnectDB()
  console.log('Migration complete.')
  process.exit(0)
}

run().catch(async (error) => {
  console.error('Migration failed:', error)
  await disconnectDB().catch(() => {})
  process.exit(1)
})
