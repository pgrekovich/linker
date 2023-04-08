import { Router } from 'express'
import { signUp, signIn } from '../controllers/authController'
import { create, redirectToOriginalUrl } from '../controllers/linkController'
import { authMiddleware } from '../middlewares/authMiddleware'

import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

import { redisClient } from '../config/redisConfig'

// Set up the rate limiter middleware
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args)
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
})

const router = Router()

router.post('/signup', authLimiter, signUp)
router.post('/signin', authLimiter, signIn)

router.post('/link', authMiddleware, create)
router.get('/:shortenedUrl', redirectToOriginalUrl)

export default router
