import express from 'express'
import { DataSource } from 'typeorm'
import { createClient } from 'redis'

const app = express()
const port = process.env.APP_PORT || 3000

// Connect to PostgreSQL
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: []
})

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL')
  })
  .catch((error) => console.log(error))

// Connect to Redis
const redisClient = createClient({ url: process.env.REDIS_URL })

redisClient.on('connect', () => {
  console.log('Connected to Redis')
})

redisClient.on('error', (error) => {
  console.error('Error connecting to Redis:', error)
})

redisClient.connect()

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
