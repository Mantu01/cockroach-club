import express from 'express'
import { getCurrentDbUser, getUserByClerkId } from '../controllers/user.controller.js'

const router = express.Router()
router.get('/me', getCurrentDbUser)
router.get('/:clerkId', getUserByClerkId)

export default router
