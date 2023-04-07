import { Request, Response } from 'express'
import { User } from '../entities/User'
import AppDataSource from '../config/typeormConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET as string

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const userRepository = AppDataSource.getRepository(User)
  const existingUser = await userRepository.findOneBy({ email })

  if (existingUser) {
    return res.status(409).json({ message: 'Email is already taken' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = userRepository.create({ email, password: hashedPassword })
  await userRepository.save(newUser)

  res.status(201).json({ message: 'User created' })
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOneBy({ email })

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' })

  res.status(200).json({ token })
}
