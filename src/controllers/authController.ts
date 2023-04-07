import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await authService.registerUser(email, password)

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error })
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const { token } = await authService.authenticateUser(email, password)

    res.status(200).json({ token })
  } catch (error) {
    res.status(400).json({ message: 'Error authenticating user', error: error })
  }
}
