import { Request, Response } from 'express'
import { getAuth } from '@clerk/express'
import User from '../models/user.model.js'

interface UserParams {
  clerkId: string
}

export const getUserByClerkId = async (
  req: Request<UserParams>,
  res: Response,
) => {
  const { clerkId } = req.params

  if (!clerkId) {
    return res.status(400).json({ error: 'Missing user id' })
  }

  const user = await User.findOne({ id: clerkId }).lean()

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.status(200).json({ user })
}

export const getCurrentDbUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const auth = getAuth(req)

    if (!auth.userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await User.findOne({ id: auth.userId }).lean()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error fetching authenticated user', error)
    return res.status(500).json({ error: 'Unable to fetch authenticated user' })
  }
}
