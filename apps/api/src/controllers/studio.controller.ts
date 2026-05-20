import { Request, Response } from 'express'
import { getAuth } from '@clerk/express'
import User from '../models/user.model.js'
import Job from '../models/job.model.js'
import Application from '../models/application.model.js'
import RecentSearch from '../models/recent-search.model.js'
import Preparation from '../models/preparation.model.js'
import Notification from '../models/notification.model.js'

const getUserId = (req: Request): string | null => {
  const auth = getAuth(req)
  return auth.userId ?? null
}

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const [applications, preparations, searches, jobs] = await Promise.all([
      Application.countDocuments({ userId }),
      Preparation.find({ userId }).lean(),
      RecentSearch.countDocuments({ userId }),
      Job.countDocuments(),
    ])

    const prepCompleted = preparations.reduce(
      (sum, p) => sum + (p.completedCount ?? 0),
      0
    )
    const prepTotal = preparations.reduce(
      (sum, p) => sum + (p.totalCount ?? 0),
      0
    )

    const activity = await Application.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean()

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        searches: Math.floor(Math.random() * 8) + searches / 7,
        applications: Math.floor(Math.random() * 4) + applications / 7,
      }
    })

    const predictions = [
      {
        label: 'Interview readiness',
        value: prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 42,
        trend: 'up' as const,
      },
      {
        label: 'Application success rate',
        value: applications > 0 ? Math.min(78, 20 + applications * 3) : 24,
        trend: 'up' as const,
      },
      {
        label: 'Market match score',
        value: 67,
        trend: 'stable' as const,
      },
      {
        label: 'Resume ATS score',
        value: 81,
        trend: 'up' as const,
      },
    ]

    return res.status(200).json({
      stats: {
        jobsSearched: searches,
        totalApplications: applications,
        preparationsDone: prepCompleted,
        totalJobsScraped: jobs,
        prepProgress: prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 0,
      },
      activity,
      chartData,
      predictions,
    })
  } catch (error) {
    console.error('Dashboard error', error)
    return res.status(500).json({ error: 'Unable to fetch dashboard data' })
  }
}

export const getJobs = async (_req: Request, res: Response) => {
  try {
    let jobs = await Job.find().sort({ scrapedAt: -1 }).limit(50).lean()

    if (jobs.length === 0) {
      const seedJobs = [
        {
          title: 'Senior Frontend Engineer',
          company: 'Vercel',
          location: 'Remote',
          source: 'LinkedIn',
          url: 'https://example.com/jobs/1',
          salary: '$140k - $180k',
          type: 'Full-time',
          tags: ['React', 'TypeScript', 'Next.js'],
        },
        {
          title: 'Full Stack Developer',
          company: 'Stripe',
          location: 'San Francisco, CA',
          source: 'Indeed',
          url: 'https://example.com/jobs/2',
          salary: '$130k - $170k',
          type: 'Full-time',
          tags: ['Node.js', 'React', 'PostgreSQL'],
        },
        {
          title: 'Software Engineer II',
          company: 'Google',
          location: 'Mountain View, CA',
          source: 'Glassdoor',
          url: 'https://example.com/jobs/3',
          salary: '$150k - $200k',
          type: 'Full-time',
          tags: ['Go', 'Python', 'Distributed Systems'],
        },
        {
          title: 'React Developer',
          company: 'Shopify',
          location: 'Remote',
          source: 'LinkedIn',
          url: 'https://example.com/jobs/4',
          salary: '$120k - $155k',
          type: 'Full-time',
          tags: ['React', 'GraphQL', 'Ruby'],
        },
        {
          title: 'Backend Engineer',
          company: 'Notion',
          location: 'New York, NY',
          source: 'Indeed',
          url: 'https://example.com/jobs/5',
          salary: '$135k - $175k',
          type: 'Full-time',
          tags: ['Node.js', 'MongoDB', 'AWS'],
        },
      ]
      await Job.insertMany(seedJobs)
      jobs = await Job.find().sort({ scrapedAt: -1 }).limit(50).lean()
    }

    return res.status(200).json({ jobs })
  } catch (error) {
    console.error('Jobs error', error)
    return res.status(500).json({ error: 'Unable to fetch jobs' })
  }
}

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    if (applications.length === 0) {
      const seedApps = [
        {
          userId,
          title: 'Frontend Engineer',
          company: 'Linear',
          location: 'Remote',
          url: 'https://example.com/app/1',
          status: 'applied' as const,
          searchQuery: 'frontend engineer remote',
          appliedAt: new Date(),
        },
        {
          userId,
          title: 'Software Developer',
          company: 'Figma',
          location: 'San Francisco, CA',
          url: 'https://example.com/app/2',
          status: 'interview' as const,
          searchQuery: 'software developer',
          appliedAt: new Date(),
        },
        {
          userId,
          title: 'React Specialist',
          company: 'Airbnb',
          location: 'Remote',
          url: 'https://example.com/app/3',
          status: 'saved' as const,
          searchQuery: 'react developer',
        },
      ]
      await Application.insertMany(seedApps)
      applications = await Application.find({ userId }).sort({ createdAt: -1 }).lean()
    }

    return res.status(200).json({ applications })
  } catch (error) {
    console.error('Applications error', error)
    return res.status(500).json({ error: 'Unable to fetch applications' })
  }
}

export const getRecentSearches = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let searches = await RecentSearch.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    if (searches.length === 0) {
      const seedSearches = [
        { userId, query: 'frontend engineer remote', location: 'Remote', resultsCount: 142 },
        { userId, query: 'react developer', location: 'San Francisco', resultsCount: 89 },
        { userId, query: 'full stack typescript', location: 'New York', resultsCount: 67 },
        { userId, query: 'senior software engineer', location: 'Remote', resultsCount: 203 },
      ]
      await RecentSearch.insertMany(seedSearches)
      searches = await RecentSearch.find({ userId }).sort({ createdAt: -1 }).limit(10).lean()
    }

    return res.status(200).json({ searches })
  } catch (error) {
    console.error('Recent searches error', error)
    return res.status(500).json({ error: 'Unable to fetch recent searches' })
  }
}

export const createRecentSearch = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { query, location, resultsCount } = req.body
    const search = await RecentSearch.create({
      userId,
      query,
      location,
      resultsCount: resultsCount ?? 0,
    })

    return res.status(201).json({ search })
  } catch (error) {
    console.error('Create search error', error)
    return res.status(500).json({ error: 'Unable to create search' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ profile: user.profile })
  } catch (error) {
    console.error('Profile error', error)
    return res.status(500).json({ error: 'Unable to fetch profile' })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: { profile: req.body } },
      { new: true }
    ).lean()

    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ profile: user.profile })
  } catch (error) {
    console.error('Update profile error', error)
    return res.status(500).json({ error: 'Unable to update profile' })
  }
}

export const getResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ resume: user.resume })
  } catch (error) {
    console.error('Resume error', error)
    return res.status(500).json({ error: 'Unable to fetch resume' })
  }
}

export const generateResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    const profile = user.profile
    const template = req.body.template ?? user.resume?.template ?? 'modern'

    const latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\begin{document}
\\begin{center}
{\\LARGE \\textbf{${profile.fullName || 'Your Name'}}} \\\\
${profile.headline || 'Professional Title'} \\\\
${profile.location || ''} \\textbar\\ ${profile.phone || ''} \\textbar\\ ${user.email}
\\end{center}
\\section*{Summary}
${profile.summary || 'Add your professional summary.'}
\\section*{Skills}
${(profile.skills ?? []).join(', ') || 'Add your skills.'}
\\section*{Experience}
${(profile.experience ?? []).map((exp) => `\\textbf{${exp.role}} — ${exp.company} (${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''})\\\\${exp.description}`).join('\n\n') || 'Add your experience.'}
\\section*{Education}
${(profile.education ?? []).map((edu) => `\\textbf{${edu.degree} in ${edu.field}} — ${edu.institution} (${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''})`).join('\n\n') || 'Add your education.'}
\\end{document}`

    const updated = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          resume: {
            latex,
            template,
            lastGeneratedAt: new Date(),
          },
        },
      },
      { new: true }
    ).lean()

    return res.status(200).json({
      resume: updated?.resume,
      message: 'Resume generated successfully',
    })
  } catch (error) {
    console.error('Generate resume error', error)
    return res.status(500).json({ error: 'Unable to generate resume' })
  }
}

export const getPreparations = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let preparations = await Preparation.find({ userId }).sort({ createdAt: -1 }).lean()

    if (preparations.length === 0) {
      const questions = [
        { question: 'Tell me about yourself and your background.', category: 'Behavioral', difficulty: 'easy' as const, answered: true },
        { question: 'Describe a challenging project you worked on recently.', category: 'Technical', difficulty: 'medium' as const, answered: false },
        { question: 'How do you handle state management in large React applications?', category: 'Technical', difficulty: 'hard' as const, answered: false },
        { question: 'Why do you want to work at this company?', category: 'Behavioral', difficulty: 'medium' as const, answered: false },
        { question: 'Explain the difference between SSR and CSR in Next.js.', category: 'Technical', difficulty: 'medium' as const, answered: false },
      ]
      await Preparation.create({
        userId,
        title: 'Frontend Engineer Interview',
        role: 'Frontend Engineer',
        questions,
        completedCount: 1,
        totalCount: questions.length,
      })
      preparations = await Preparation.find({ userId }).sort({ createdAt: -1 }).lean()
    }

    return res.status(200).json({ preparations })
  } catch (error) {
    console.error('Preparations error', error)
    return res.status(500).json({ error: 'Unable to fetch preparations' })
  }
}

export const createPreparation = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { role, title } = req.body
    const aiQuestions = [
      { question: `What experience do you have as a ${role}?`, category: 'Behavioral', difficulty: 'easy' as const, answered: false },
      { question: `Describe your approach to solving complex problems as a ${role}.`, category: 'Technical', difficulty: 'medium' as const, answered: false },
      { question: `How would you design a scalable system for a ${role} role?`, category: 'System Design', difficulty: 'hard' as const, answered: false },
      { question: 'Tell me about a time you disagreed with a team member.', category: 'Behavioral', difficulty: 'medium' as const, answered: false },
      { question: 'Where do you see yourself in 3 years?', category: 'Behavioral', difficulty: 'easy' as const, answered: false },
    ]

    const preparation = await Preparation.create({
      userId,
      title: title ?? `${role} Interview Prep`,
      role,
      questions: aiQuestions,
      completedCount: 0,
      totalCount: aiQuestions.length,
    })

    return res.status(201).json({ preparation })
  } catch (error) {
    console.error('Create preparation error', error)
    return res.status(500).json({ error: 'Unable to create preparation' })
  }
}

export const answerPreparationQuestion = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { preparationId, questionId, answer } = req.body
    const preparation = await Preparation.findOne({ _id: preparationId, userId })

    if (!preparation) return res.status(404).json({ error: 'Preparation not found' })

    const question = preparation.questions.find(
      (q) => String(q._id) === String(questionId)
    )
    if (!question) return res.status(404).json({ error: 'Question not found' })

    if (!question.answered) {
      preparation.completedCount += 1
    }
    question.answered = true
    question.userAnswer = answer
    await preparation.save()

    return res.status(200).json({ preparation })
  } catch (error) {
    console.error('Answer question error', error)
    return res.status(500).json({ error: 'Unable to save answer' })
  }
}

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ settings: user.settings })
  } catch (error) {
    console.error('Settings error', error)
    return res.status(500).json({ error: 'Unable to fetch settings' })
  }
}

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: { settings: req.body } },
      { new: true }
    ).lean()

    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ settings: user.settings })
  } catch (error) {
    console.error('Update settings error', error)
    return res.status(500).json({ error: 'Unable to update settings' })
  }
}

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    if (notifications.length === 0) {
      const seed = [
        { userId, title: 'New job matches', message: '12 new frontend roles match your profile.', type: 'job' as const, read: false },
        { userId, title: 'Application update', message: 'Your application to Figma moved to interview stage.', type: 'application' as const, read: false },
        { userId, title: 'Weekly digest ready', message: 'Your job market summary for this week is available.', type: 'system' as const, read: true },
        { userId, title: 'Credits renewed', message: 'Your monthly credits have been refreshed.', type: 'billing' as const, read: true },
      ]
      await Notification.insertMany(seed)
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean()
    }

    return res.status(200).json({ notifications })
  } catch (error) {
    console.error('Notifications error', error)
    return res.status(500).json({ error: 'Unable to fetch notifications' })
  }
}

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { read: true } },
      { new: true }
    ).lean()

    if (!notification) return res.status(404).json({ error: 'Notification not found' })

    return res.status(200).json({ notification })
  } catch (error) {
    console.error('Mark notification error', error)
    return res.status(500).json({ error: 'Unable to update notification' })
  }
}

export const getBilling = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({
      billing: {
        plan: 'Survivor',
        credits: user.credits,
        totalCredits: user.Tcredits,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        invoices: [
          { id: 'inv_001', date: '2026-04-01', amount: 0, status: 'paid', description: 'Free tier' },
          { id: 'inv_002', date: '2026-03-01', amount: 0, status: 'paid', description: 'Free tier' },
        ],
      },
    })
  } catch (error) {
    console.error('Billing error', error)
    return res.status(500).json({ error: 'Unable to fetch billing' })
  }
}

export const getAccount = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findOne({ id: userId }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({
      account: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        totalCredits: user.Tcredits,
        createdAt: user.createdAt,
        memberSince: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Account error', error)
    return res.status(500).json({ error: 'Unable to fetch account' })
  }
}
