import { Request, Response } from 'express'

import * as linkService from '../services/linkService'

export interface CustomRequest extends Request {
  userId?: string
}

export const create = async (req: CustomRequest, res: Response) => {
  try {
    const { originalUrl, customShortenedUrl } = req.body
    const userId = req['userId']

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const link = await linkService.createLink(
      originalUrl,
      userId,
      customShortenedUrl
    )

    res.status(201).json({
      shortenedUrl: link.shortenedUrl
    })
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Error creating the link', error: error.message })
    } else {
      res.status(400).json({ message: 'Error creating the link', error: error })
    }
  }
}

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortenedUrl } = req.params

    const link = await linkService.findLinkByShortenedUrl(shortenedUrl)

    res.redirect(link.originalUrl)
  } catch (error) {
    res.status(404).json({ message: 'Link not found', error: error })
  }
}
