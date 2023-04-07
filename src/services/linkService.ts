import { nanoid } from 'nanoid'
import { AppDataSource } from '../config/typeormConfig'
import { Link } from '../entities/Link'
import { User } from '../entities/User'

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

export const getLinksByUser = async (userId: string) => {
  const linkRepository = AppDataSource.getRepository(Link)

  const links = await linkRepository.find({ where: { user: { id: userId } } })

  return links
}

export const findLinkByShortenedUrl = async (shortenedUrl: string) => {
  const linkRepository = AppDataSource.getRepository(Link)

  const link = await linkRepository.findOneBy({ shortenedUrl })

  if (!link) {
    throw new Error('Link not found')
  }

  return link
}
