import { nanoid } from 'nanoid'
import { AppDataSource } from '../config/typeormConfig'
import { Link } from '../entities/Link'
import { User } from '../entities/User'
import { redisClient } from '../config/redisConfig'

export const createLink = async (originalUrl: string, userId: string) => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOneBy({ id: userId })

  if (!user) {
    throw new Error('User not found')
  }

  const linkRepository = AppDataSource.getRepository(Link)

  const shortenedUrl = nanoid(10)

  const link = new Link()
  link.originalUrl = originalUrl
  link.shortenedUrl = shortenedUrl
  link.user = user

  await linkRepository.save(link)

  return link
}

export const findLinkByShortenedUrl = async (shortenedUrl: string) => {
  // Try to find the link in the Redis cache
  const cachedLink = await redisClient.get(shortenedUrl)

  if (cachedLink) {
    console.log('--> Link found in Redis cache')
    return JSON.parse(cachedLink)
  }

  const linkRepository = AppDataSource.getRepository(Link)

  const link = await linkRepository.findOneBy({ shortenedUrl })

  if (!link) {
    throw new Error('Link not found')
  }

  // Cache the link in Redis with a 1-hour expiration
  await redisClient.set(shortenedUrl, JSON.stringify(link), { EX: 3600 })

  return link
}
