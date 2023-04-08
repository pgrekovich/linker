import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface CustomRequest extends Request {
  userId?: string
}

const jwtSecret = process.env.JWT_SECRET as string

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
