import { AppDataSource } from '../config/typeormConfig'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (email: string, password: string) => {
  const userRepository = AppDataSource.getRepository(User)

  const existingUser = await userRepository.findOneBy({ email })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User()
  user.email = email
  user.password = hashedPassword

  await userRepository.save(user)

  return user
}

export const authenticateUser = async (email: string, password: string) => {
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOneBy({ email })

  if (!user) {
    throw new Error('User not found')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h'
    }
  )

  return { user, token }
}
