import mongoose from 'mongoose'
import { env } from './env.js'

mongoose.set('strictQuery', true)

let connectionPromise = null

export function connectDB() {
  if (connectionPromise) return connectionPromise

  connectionPromise = mongoose
    .connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 })
    .then((instance) => {
      const { host, name } = instance.connection
      console.log(`MongoDB connected: ${host}/${name}`)
      return instance.connection
    })
    .catch((error) => {
      connectionPromise = null
      throw error
    })

  return connectionPromise
}

export async function disconnectDB() {
  await mongoose.disconnect()
  connectionPromise = null
}

export { mongoose }
