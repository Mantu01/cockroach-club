export const APP_NAME = 'Cockroach Club';
export const APP_TAGLINE = 'Cockroach Mode — Active';

const normalizeApiUrl = (url?: string) => {
  const baseUrl = url?.trim() || 'http://localhost:4000/api/v1';
  const normalized = baseUrl.replace(/\/+$/, '')
  if (normalized.endsWith('/api/v1')) return normalized;
  return `${normalized}/api/v1`;
};

export const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);

export const ROUTES = {
  home: '/',
  dashboard: '/studio/dashboard',
  quick:'/studio/new',
  studio: '/studio',
  jobs: '/studio/jobs',
  explore: '/studio/explore',
  applications: '/studio/applications',
  profile: '/studio/profile',
  resume: '/studio/resume',
  preparations: '/studio/preparations',
  settings: '/user/settings',
  account: '/user/account',
  billing: '/user/billing',
  notifications: '/user/notifications',
  contact: '/user/contact-us',
  login: '/login',
  signup: '/signup',
} as const;

