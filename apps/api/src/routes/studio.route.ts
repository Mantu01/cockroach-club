import express from 'express'
import {
  getDashboard,
  getJobs,
  getJobById,
  updateJobAction,
  getApplications,
  getRecentSearches,
  createRecentSearch,
  getProfile,
  updateProfile,
  getResume,
  generateResume,
  getPreparations,
  createPreparation,
  answerPreparationQuestion,
  getSettings,
  updateSettings,
  getNotifications,
  markNotificationRead,
  getBilling,
  getAccount,
} from '../controllers/studio.controller.js'

const router = express.Router()

router.get('/dashboard', getDashboard)
router.get('/jobs', getJobs)
router.get('/jobs/:id', getJobById)
router.post('/jobs/:id/action', updateJobAction)
router.get('/applications', getApplications)
router.get('/searches/recent', getRecentSearches)
router.post('/searches', createRecentSearch)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/resume', getResume)
router.post('/resume/generate', generateResume)
router.get('/preparations', getPreparations)
router.post('/preparations', createPreparation)
router.post('/preparations/answer', answerPreparationQuestion)
router.get('/settings', getSettings)
router.put('/settings', updateSettings)
router.get('/notifications', getNotifications)
router.patch('/notifications/:id/read', markNotificationRead)
router.get('/billing', getBilling)
router.get('/account', getAccount)

export default router
