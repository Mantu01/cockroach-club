import express from 'express';
import {
  getDashboard,
  getJobs,
  getJobById,
  getExploreJobs,
  shareJob,
  getJobByShareId,
  updateJobAction,
  getApplications,
  getRecentSearches,
  createRecentSearch,
  getProfile,
  updateProfile,
  getResume,
  generateResume,
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  compileResume,
  editResumeLatex,
  getPreparations,
  createPreparation,
  getPreparationById,
  answerPreparationQuestion,
  getSettings,
  updateSettings,
  getNotifications,
  markNotificationRead,
  getBilling,
  getAccount,
} from '../controllers/studio.controller.js';

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/jobs', getJobs);
router.get('/jobs/explore', getExploreJobs);
router.get('/jobs/share/:shareId', getJobByShareId);
router.post('/jobs/:id/share', shareJob);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/action', updateJobAction);
router.get('/applications', getApplications);
router.get('/searches/recent', getRecentSearches);
router.post('/searches', createRecentSearch);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/resume', getResume);
router.post('/resume/generate', generateResume);
router.get('/resumes', getResumes);
router.get('/resumes/:id', getResumeById);
router.post('/resumes', createResume);
router.put('/resumes/:id', updateResume);
router.delete('/resumes/:id', deleteResume);
router.post('/resumes/compile', compileResume);
router.post('/resumes/ai-edit', editResumeLatex);
router.get('/preparations', getPreparations);
router.post('/preparations', createPreparation);
router.get('/preparations/:id', getPreparationById);
router.post('/preparations/answer', answerPreparationQuestion);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.get('/billing', getBilling);
router.get('/account', getAccount);

export default router;
