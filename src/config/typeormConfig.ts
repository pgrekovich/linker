import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { User } from '../entities/User'
import { Link } from '../entities/Link'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'linker_db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Link],
  synchronize: true,
  logging: false
})

export default AppDataSource
