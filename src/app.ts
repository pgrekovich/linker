import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import AppDataSource from './config/typeormConfig'
import routes from './routes'

const app: Application = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/', routes)

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

// Initialize TypeORM connection and start the application
AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL')
    const port = process.env.APP_PORT || 3000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => console.log(error))

export default app
