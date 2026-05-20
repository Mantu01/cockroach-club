import express from 'express'
import { registerWebhook } from '../controllers/webhook.controller.js'

const router = express.Router()
router.post('/registry', registerWebhook)

export default router
