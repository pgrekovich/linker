import { Router } from 'express'
import { signUp, signIn } from '../controllers/authController'
import { create, redirectToOriginalUrl } from '../controllers/linkController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)

router.post('/link', authMiddleware, create)
router.get('/:shortenedUrl', redirectToOriginalUrl)

export default router
