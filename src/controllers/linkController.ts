import { Request, Response } from 'express'
import { Link } from '../entities/Link'
import { User } from '../entities/User'
import { AppDataSource } from '../config/typeormConfig'
import { nanoid } from 'nanoid'

export interface CustomRequest extends Request {
  userId?: string
}

export const createLink = async (req: CustomRequest, res: Response) => {
  const { originalUrl } = req.body
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (!originalUrl) {
    return res.status(400).json({ message: 'Invalid request data' })
  }

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ id: userId })

    console.log(JSON.stringify(user, null, 2))

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const linkRepository = AppDataSource.getRepository(Link)
    const newLink = new Link()
    newLink.originalUrl = originalUrl
    newLink.shortenedUrl = nanoid(7)
    newLink.user = user

    const savedLink = await linkRepository.save(newLink)
    res.status(201).json(savedLink)
  } catch (error) {
    res.status(500).json({ message: 'Error creating the link', error })
  }
}

export const getLink = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const linkRepository = AppDataSource.getRepository(Link)
    const link = await linkRepository.findOne({
      where: { id },
      relations: ['user']
    })

    if (!link) {
      return res.status(404).json({ message: 'Link not found' })
    }

    res.status(200).json(link)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the link', error })
  }
}

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortenedUrl } = req.params

    const linkRepository = AppDataSource.getRepository(Link)

    const link = await linkRepository.findOneBy({ shortenedUrl })

    if (!link) {
      return res.status(404).json({ message: 'Link not found' })
    }

    res.redirect(link.originalUrl)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error while processing the request', error })
  }
}
