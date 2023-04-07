import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('connect', () => {
  console.log('Connected to Redis')
})

redisClient.on('error', (error) => {
  console.error(`Redis error: ${error}`)
})

redisClient
  .connect()
  .then(() => {
    console.log('Connected to Redis')
  })
  .catch((error) => {
    console.error(`Redis error: ${error}`)
  })

export { redisClient }
