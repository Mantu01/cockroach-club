import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';
import RecentSearch from '../models/recent-search.model.js';
import Preparation from '../models/preparation.model.js';
import Notification from '../models/notification.model.js';
import Analytics from '../models/analytics.model.js';
import Resume from '../models/resume.model.js';
import { generateResumeLatex, generateInterviewQuestions, editResumeLatex as aiEditResumeLatex } from '../helpers/gemini.helper.js';
import axios from 'axios';
import crypto from 'crypto';

const getUserId = (req: Request): string | null => {
  const auth = getAuth(req)
  return auth.userId ?? null
}

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const [preparations, searches, totalJobs] = await Promise.all([
      Preparation.find({ userId }).lean(),
      RecentSearch.countDocuments({ userId }),
      Job.countDocuments(),
    ])

    const [totalApplications, appliedCount, savedCount, rejectedCount, interviewCount, offerCount] = await Promise.all([
      Application.countDocuments({ userId }),
      Application.countDocuments({ userId, status: 'applied' }),
      Application.countDocuments({ userId, status: 'saved' }),
      Application.countDocuments({ userId, status: 'rejected' }),
      Application.countDocuments({ userId, status: 'interview' }),
      Application.countDocuments({ userId, status: 'offer' }),
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

    const jobIds = activity.map((a) => a.jobId).filter(Boolean) as string[];
    const jobsMap: Record<string, any> = {};
    if (jobIds.length > 0) {
      const jobsDocs = await Job.find({ _id: { $in: jobIds } }).lean();
      jobsDocs.forEach((j: any) => {
        jobsMap[String(j._id)] = j;
      });
    }
    const activityWithJobs = activity.map((a) => ({ ...a, job: a.jobId ? jobsMap[String(a.jobId)] ?? null : null }))

    const chartDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - i))
      const start = new Date(date)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      return {
        label: date.toISOString().split('T')[0],
        start,
        end,
      }
    })

    const searchCounts = await Promise.all(
      chartDays.map((day) =>
        RecentSearch.countDocuments({
          userId,
          createdAt: { $gte: day.start, $lte: day.end },
        })
      )
    )

    const applicationCounts = await Promise.all(
      chartDays.map((day) =>
        Application.countDocuments({
          userId,
          createdAt: { $gte: day.start, $lte: day.end },
        })
      )
    )

    const chartData = chartDays.map((day, index) => ({
      date: day.label,
      searches: searchCounts[index],
      applications: applicationCounts[index],
    }))

    const predictions = [
      {
        label: 'Interview readiness',
        value: prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 42,
        trend: 'up' as const,
      },
      {
        label: 'Application success rate',
        value: totalApplications > 0 ? Math.min(78, 20 + totalApplications * 3) : 24,
        trend: 'up' as const,
      },
      {
        label: 'Market match score',
        value: totalJobs > 0 ? Math.min(90, 50 + totalJobs * 2) : 67,
        trend: totalJobs > 0 ? 'up' : 'stable' as const,
      },
      {
        label: 'Resume ATS score',
        value: userId ? 81 : 78,
        trend: 'up' as const,
      },
    ]

    return res.status(200).json({
      stats: {
        jobsSearched: searches,
        totalApplications,
        preparationsDone: prepCompleted,
        totalJobsScraped: totalJobs,
        prepProgress: prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 0,
        byStatus: {
          applied: appliedCount,
          saved: savedCount,
          rejected: rejectedCount,
          interview: interviewCount,
          offer: offerCount,
        },
      },
      activity: activityWithJobs,
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
    const jobs = await Job.find().sort({ scrapedAt: -1 }).limit(50).lean()
    return res.status(200).json({ jobs })
  } catch (error) {
    console.error('Jobs error', error)
    return res.status(500).json({ error: 'Unable to fetch jobs' })
  }
}

export const getExploreJobs = async (req: Request, res: Response) => {
  try {
    const { q, location, company, tag, remote, page = '1', limit = '20' } = req.query as Record<string, string>
    const p = Math.max(1, parseInt(page, 10) || 1)
    const l = Math.min(100, parseInt(limit, 10) || 20)

    const filter: Record<string, any> = {}
    if (q) {
      const rx = new RegExp(q, 'i')
      filter.$or = [{ title: rx }, { company: rx }, { shortDescription: rx }, { description: rx }]
    }
    if (location) filter.location = new RegExp(location, 'i')
    if (company) filter.company = new RegExp(company, 'i')
    if (tag) filter.tags = { $in: [tag] }
    if (remote) filter.remote = remote === 'true'

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ scrapedAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      Job.countDocuments(filter),
    ])

    return res.status(200).json({ jobs, total, page: p, limit: l })
  } catch (error) {
    console.error('Explore jobs error', error)
    return res.status(500).json({ error: 'Unable to fetch explore jobs' })
  }
}

export const shareJob = async (req: Request, res: Response) => {
  try {
    const jobId = String(req.params.id)
    const job = await Job.findById(jobId).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const shareId = job.shareId ?? crypto.randomBytes(8).toString('hex')
    await Job.findByIdAndUpdate(jobId, { $set: { shareId } })

    const userId = getUserId(req)
    void Analytics.create({ userId: userId ?? undefined, type: 'job.share', action: 'share', jobId, meta: { shareId, title: job.title } })

    const base = process.env.FRONTEND_URL ?? 'http://localhost:3000'
    const shareUrl = `${base}/studio/explore?share=${shareId}`
    return res.status(200).json({ shareId, shareUrl })
  } catch (error) {
    console.error('Share job error', error)
    return res.status(500).json({ error: 'Unable to share job' })
  }
}

export const getJobByShareId = async (req: Request, res: Response) => {
  try {
    const shareId = req.params.shareId ?? String(req.query.share ?? '')
    if (!shareId) return res.status(400).json({ error: 'Missing share id' })

    const job = await Job.findOne({ shareId }).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const userId = getUserId(req)
    void Analytics.create({ userId: userId ?? undefined, type: 'job.view', action: 'share_view', jobId: String(job._id), meta: { shareId, title: job.title } })

    return res.status(200).json({ job })
  } catch (error) {
    console.error('Get job by share error', error)
    return res.status(500).json({ error: 'Unable to fetch job' })
  }
}

export const getJobById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const job = await Job.findById(req.params.id).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const application = await Application.findOne({ userId, jobId: String(job._id) }).lean().catch(() => null)

    void Analytics.create({ userId, type: 'job.view', action: 'view', jobId: String(job._id), meta: { title: job.title } });

    return res.status(200).json({ job, application })
  } catch (error) {
    console.error('Job detail error', error)
    return res.status(500).json({ error: 'Unable to fetch job details' })
  }
}

export const updateJobAction = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const jobId = String(req.params.id)
    const { action } = req.body as { action?: string }
    const job = await Job.findById(jobId).lean()

    if (!job) return res.status(404).json({ error: 'Job not found' })

    let status = 'saved'
    if (action === 'apply') status = 'applied'
    if (action === 'review') status = 'saved'
    if (action === 'discard') status = 'rejected'

    const application = await Application.findOneAndUpdate(
      { userId, jobId },
      {
        $set: {
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          status,
          searchQuery: job.title,
          appliedAt: status === 'applied' ? new Date() : undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean()

    void Analytics.create({ userId, type: 'application', action: status, jobId, meta: { title: job.title, company: job.company } });

    return res.status(200).json({ application, job })
  } catch (error) {
    console.error('Job action error', error)
    return res.status(500).json({ error: 'Unable to update job action' })
  }
}

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    let applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

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

    void Analytics.create({ userId, type: 'search', action: 'create', meta: { query, location, resultsCount } })

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

    void Analytics.create({ userId, type: 'profile', action: 'update' })

    return res.status(200).json({ profile: user.profile })
  } catch (error) {
    console.error('Update profile error', error)
    return res.status(500).json({ error: 'Unable to update profile' })
  }
}

export const getResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ resume: user.resume });
  } catch (error) {
    console.error('Resume error', error);
    return res.status(500).json({ error: 'Unable to fetch resume' });
  }
};

export const generateResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = user.profile;
    const template = req.body.template ?? user.resume?.template ?? 'modern';

    const latex = await generateResumeLatex(profile, null, template);

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
    ).lean();

    void Analytics.create({ userId, type: 'resume', action: 'generate', meta: { template } });

    return res.status(200).json({
      resume: updated?.resume,
      message: 'Resume generated successfully',
    });
  } catch (error: any) {
    console.error('Generate resume error', error);
    return res.status(500).json({ error: error.message || 'Unable to generate resume' });
  }
};

export const getResumes = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error('Get resumes error', error);
    return res.status(500).json({ error: 'Unable to fetch resumes' });
  }
};

export const getResumeById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const resume = await Resume.findOne({ _id: req.params.id, userId }).lean();
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    return res.status(200).json({ resume });
  } catch (error) {
    console.error('Get resume by id error', error);
    return res.status(500).json({ error: 'Unable to fetch resume' });
  }
};

export const createResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title, template, useProfileData, profileData, jobId, jobTitle, company, whyCreated } = req.body;
    let finalProfileData = profileData;

    if (useProfileData) {
      const user = await User.findOne({ id: userId }).lean();
      if (user && user.profile) {
        finalProfileData = user.profile;
      }
    }

    if (!finalProfileData) {
      return res.status(400).json({ error: 'Profile data is required to generate a resume' });
    }

    let jobDetails = null;
    if (jobId) {
      jobDetails = await Job.findById(jobId).lean();
    } else if (jobTitle && company) {
      jobDetails = { title: jobTitle, company };
    }

    const latex = await generateResumeLatex(finalProfileData, jobDetails, template || 'modern');
    const atsScore = Math.floor(Math.random() * 21) + 75;

    const resume = await Resume.create({
      userId,
      title: title || (jobDetails ? `Resume - ${jobDetails.title}` : 'My Resume'),
      latex,
      template: template || 'modern',
      atsScore,
      jobId: jobId || undefined,
      jobTitle: jobDetails ? jobDetails.title : (jobTitle || undefined),
      company: jobDetails ? jobDetails.company : (company || undefined),
      whyCreated: whyCreated || undefined,
    });

    void Analytics.create({ userId, type: 'resume', action: 'create', meta: { template, jobId } });

    return res.status(201).json({ resume });
  } catch (error: any) {
    console.error('Create resume error', error);
    return res.status(500).json({ error: error.message || 'Unable to create resume' });
  }
};

export const updateResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title, latex } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { title, latex } },
      { new: true }
    ).lean();

    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    return res.status(200).json({ resume });
  } catch (error) {
    console.error('Update resume error', error);
    return res.status(500).json({ error: 'Unable to update resume' });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId }).lean();
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error', error);
    return res.status(500).json({ error: 'Unable to delete resume' });
  }
};

export const compileResume = async (req: Request,res: Response): Promise<Response | void> => {
  try {
    const { latex } = req.body;

    if (!latex || typeof latex !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'LaTeX content is required',
      });
    }

    const TEX_API_URL =process.env.TEX_API_URL!;

    const TEX_API_KEY = process.env.TEX_API_KEY!;

    if (!TEX_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Missing TEX_API_KEY in environment variables',
      });
    }

    const response = await axios.post(
      TEX_API_URL,
      {
        content: latex,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': TEX_API_KEY,
        },

        responseType: 'arraybuffer',

        timeout: 120000,

        maxContentLength: Infinity,
        maxBodyLength: Infinity,

        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json({
        success: false,
        error: 'LaTeX compilation failed',
        details: Buffer.from(response.data).toString(),
      });
    }

    const pdfBuffer = Buffer.from(response.data);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'inline; filename="resume.pdf"',
      'Cache-Control': 'no-store',
    });

    return res.end(pdfBuffer);
  } catch (error: any) {
    console.error('Compile Resume Error:', error);

    if (axios.isAxiosError(error)) {
      return res.status(500).json({
        success: false,
        error: 'TexAPI request failed',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


export const editResumeLatex = async (req: Request, res: Response) => {
  try {
    const { latex, prompt } = req.body;

    if (!latex || !prompt || String(prompt).trim().length === 0) {
      return res.status(400).json({ error: 'Both latex and prompt are required for AI editing' });
    }

    const updatedLatex = await aiEditResumeLatex(String(latex), String(prompt));
    return res.status(200).json({ latex: updatedLatex });
  } catch (error: any) {
    console.error('AI resume edit error', error);
    return res.status(500).json({
      error: 'AI LaTeX edit failed',
      message: error?.message || 'Unknown error',
    });
  }
};

export const getPreparations = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let preparations = await Preparation.find({ userId }).sort({ createdAt: -1 }).lean();

    if (preparations.length === 0) {
      const questions = [
        { question: 'Tell me about yourself and your background.', category: 'Behavioral', difficulty: 'easy', answered: true },
        { question: 'Describe a challenging project you worked on recently.', category: 'Technical', difficulty: 'medium', answered: false },
        { question: 'How do you handle state management in large React applications.', category: 'Technical', difficulty: 'hard', answered: false },
        { question: 'Why do you want to work at this company.', category: 'Behavioral', difficulty: 'medium', answered: false },
        { question: 'Explain the difference between SSR and CSR in Next.js.', category: 'Technical', difficulty: 'medium', answered: false },
      ];
      await Preparation.create({
        userId,
        title: 'Frontend Engineer Interview',
        role: 'Frontend Engineer',
        questions,
        completedCount: 1,
        totalCount: questions.length,
      });
      preparations = await Preparation.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    const updatedPreparations = await Promise.all(
      preparations.map(async (prep) => {
        if (prep.jobId) {
          const app = await Application.findOne({ userId, jobId: prep.jobId }).lean();
          return {
            ...prep,
            jobStatus: app ? app.status : 'saved',
          };
        }
        return {
          ...prep,
          jobStatus: 'saved',
        };
      })
    );

    return res.status(200).json({ preparations: updatedPreparations });
  } catch (error) {
    console.error('Preparations error', error);
    return res.status(500).json({ error: 'Unable to fetch preparations' });
  }
};

export const createPreparation = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { role, title, jobId, jobTitle, company, skills, experience } = req.body;

    let finalRole = role || 'Software Engineer';
    let finalCompany = company;
    let finalJobTitle = jobTitle;

    if (jobId) {
      const job = await Job.findById(jobId).lean();
      if (job) {
        finalRole = job.title;
        finalCompany = job.company;
        finalJobTitle = job.title;
      }
    }

    const aiQuestions = await generateInterviewQuestions(
      finalRole,
      finalCompany,
      skills || [],
      experience || ''
    );

    const mappedQuestions = aiQuestions.map((q) => ({
      question: q.question,
      category: q.category || 'Technical',
      difficulty: q.difficulty || 'medium',
      answered: false,
    }));

    const preparation = await Preparation.create({
      userId,
      title: title || `${finalRole} Interview Prep`,
      role: finalRole,
      jobId: jobId || undefined,
      jobTitle: finalJobTitle || undefined,
      company: finalCompany || undefined,
      questions: mappedQuestions,
      completedCount: 0,
      totalCount: mappedQuestions.length,
    });

    void Analytics.create({ userId, type: 'preparation', action: 'create', meta: { role: finalRole, jobId } });

    return res.status(201).json({ preparation });
  } catch (error: any) {
    console.error('Create preparation error', error);
    return res.status(500).json({ error: error.message || 'Unable to create preparation' });
  }
};

export const getPreparationById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const preparation = await Preparation.findOne({ _id: req.params.id, userId }).lean();
    if (!preparation) return res.status(404).json({ error: 'Preparation not found' });

    let jobStatus = 'saved';
    if (preparation.jobId) {
      const app = await Application.findOne({ userId, jobId: preparation.jobId }).lean();
      if (app) {
        jobStatus = app.status;
      }
    }

    return res.status(200).json({
      preparation: {
        ...preparation,
        jobStatus,
      },
    });
  } catch (error) {
    console.error('Get preparation by id error', error);
    return res.status(500).json({ error: 'Unable to fetch preparation' });
  }
};

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

    void Analytics.create({ userId, type: 'preparation', action: 'answer', meta: { preparationId, questionId } })

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
