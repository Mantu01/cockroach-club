export const APP_NAME = 'Cockroach Club'
export const APP_TAGLINE = 'Cockroach Mode — Active'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export const ROUTES = {
  home: '/',
  dashboard: '/studio/dashboard',
  studio: '/studio',
  jobs: '/studio/jobs',
  applications: '/studio/applications',
  profile: '/studio/profile',
  resume: '/studio/resume',
  preparations: '/studio/preparations',
  settings: '/settings',
  account: '/account',
  billing: '/billing',
  notifications: '/notifications',
  login: '/login',
  signup: '/signup',
} as const
