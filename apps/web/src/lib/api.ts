import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants/app'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

apiClient.interceptors.request.use((config) => {
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

export const studioApi = {
  getDashboard: () => apiClient.get('/studio/dashboard'),
  getJobs: () => apiClient.get('/studio/jobs'),
  getApplications: () => apiClient.get('/studio/applications'),
  getRecentSearches: () => apiClient.get('/studio/searches/recent'),
  createSearch: (data: { query: string; location?: string; resultsCount?: number }) =>
    apiClient.post('/studio/searches', data),
  getProfile: () => apiClient.get('/studio/profile'),
  updateProfile: (data: unknown) => apiClient.put('/studio/profile', data),
  getResume: () => apiClient.get('/studio/resume'),
  generateResume: (template?: string) =>
    apiClient.post('/studio/resume/generate', { template }),
  getPreparations: () => apiClient.get('/studio/preparations'),
  createPreparation: (data: { role: string; title?: string }) =>
    apiClient.post('/studio/preparations', data),
  answerQuestion: (data: { preparationId: string; questionId: string; answer: string }) =>
    apiClient.post('/studio/preparations/answer', data),
  getSettings: () => apiClient.get('/studio/settings'),
  updateSettings: (data: unknown) => apiClient.put('/studio/settings', data),
  getNotifications: () => apiClient.get('/studio/notifications'),
  markNotificationRead: (id: string) => apiClient.patch(`/studio/notifications/${id}/read`),
  getBilling: () => apiClient.get('/studio/billing'),
  getAccount: () => apiClient.get('/studio/account'),
  getCurrentUser: () => apiClient.get('/users/me'),
}

export type DashboardStats = {
  jobsSearched: number
  totalApplications: number
  preparationsDone: number
  totalJobsScraped: number
  prepProgress: number
}

export type DashboardData = {
  stats: DashboardStats
  activity: ApplicationItem[]
  chartData: { date: string; searches: number; applications: number }[]
  predictions: { label: string; value: number; trend: 'up' | 'down' | 'stable' }[]
}

export type JobItem = {
  _id: string
  title: string
  company: string
  location: string
  source: string
  url: string
  salary?: string
  type: string
  tags: string[]
  scrapedAt: string
}

export type ApplicationItem = {
  _id: string
  title: string
  company: string
  location: string
  url: string
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer'
  searchQuery: string
  appliedAt?: string
  createdAt: string
}

export type RecentSearchItem = {
  _id: string
  query: string
  location?: string
  resultsCount: number
  createdAt: string
}

export type UserProfile = {
  fullName: string
  headline: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  summary: string
  skills: string[]
  experience: {
    company: string
    role: string
    startDate: string
    endDate?: string
    description: string
  }[]
  education: {
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
  }[]
}

export type PreparationItem = {
  _id: string
  title: string
  role: string
  questions: {
    _id: string
    question: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
    answered: boolean
    userAnswer?: string
  }[]
  completedCount: number
  totalCount: number
}

export type UserSettings = {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  jobAlerts: boolean
  weeklyDigest: boolean
  autoApply: boolean
  profileVisibility: boolean
}

export type NotificationItem = {
  _id: string
  title: string
  message: string
  type: 'job' | 'application' | 'system' | 'billing'
  read: boolean
  createdAt: string
}

export type BillingData = {
  plan: string
  credits: number
  totalCredits: number
  renewalDate: string
  invoices: {
    id: string
    date: string
    amount: number
    status: string
    description: string
  }[]
}

export type AccountData = {
  id: string
  email: string
  credits: number
  totalCredits: number
  createdAt: string
  memberSince: string
}
