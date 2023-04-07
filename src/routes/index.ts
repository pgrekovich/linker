import { Router } from 'express'
import { signUp, signIn } from '../controllers/authController'
import {
  createLink,
  getLink,
  redirectToOriginalUrl
} from '../controllers/linkController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)

router.post('/link', authMiddleware, createLink)
router.get('/link/:id', getLink)

// New route for redirection
router.get('/:shortenedUrl', redirectToOriginalUrl)

export default router
