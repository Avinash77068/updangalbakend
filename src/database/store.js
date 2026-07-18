import mongoose from 'mongoose'
import { models } from './models/index.js'
import { deepNormalize } from '../utils/serialize.js'

function modelFor(name) {
  const model = models[name]
  if (!model) throw new Error(`Unknown collection "${name}"`)
  return model
}

function applyOptions(query, { select, populate, sort } = {}) {
  if (select) query.select(select)
  if (populate) query.populate(populate)
  if (sort) query.sort(sort)
  return query
}

export async function list(name, filter = {}, options = {}) {
  const docs = await applyOptions(modelFor(name).find(filter), options).lean()
  return docs.map(deepNormalize)
}

export async function findById(name, id, options = {}) {
  if (!mongoose.isValidObjectId(id)) return null
  const doc = await applyOptions(modelFor(name).findById(id), options).lean()
  return deepNormalize(doc)
}

export async function findOne(name, filter = {}, options = {}) {
  const doc = await applyOptions(modelFor(name).findOne(filter), options).lean()
  return deepNormalize(doc)
}

export async function insert(name, payload = {}) {
  const { id, _id, ...rest } = payload
  const data = { ...rest }
  const providedId = id || _id
  if (providedId && mongoose.isValidObjectId(providedId)) data._id = providedId
  const doc = await modelFor(name).create(data)
  return deepNormalize(doc.toObject())
}

export async function update(name, id, payload = {}) {
  if (!mongoose.isValidObjectId(id)) return null
  const { id: _ignoreId, _id: _ignoreMongoId, ...rest } = payload
  const doc = await modelFor(name)
    .findByIdAndUpdate(id, rest, { new: true, runValidators: true, context: 'query' })
    .lean()
  return deepNormalize(doc)
}

export async function remove(name, id) {
  if (!mongoose.isValidObjectId(id)) return false
  const result = await modelFor(name).findByIdAndDelete(id)
  return Boolean(result)
}

// Database-side pagination: filtering, sorting and limiting happen in MongoDB
// (backed by indexes) rather than loading whole collections into memory.
export async function paginate(name, filter = {}, { page = 1, limit = 20, sort, select, populate } = {}) {
  const model = modelFor(name)
  const skip = (page - 1) * limit
  const [docs, total] = await Promise.all([
    applyOptions(model.find(filter), { select, populate, sort }).skip(skip).limit(limit).lean(),
    model.countDocuments(filter),
  ])
  return { items: docs.map(deepNormalize), total }
}
