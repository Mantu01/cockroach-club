import {
  LayoutDashboard,
  Briefcase,
  FileStack,
  FileText,
  GraduationCap,
  Mail,
  Mic,
  Brain,
  Radar,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
  User,
} from 'lucide-react';
import { ROUTES } from './app';

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface UpcomingFeature {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  { title: 'Dashboard', url: ROUTES.dashboard, icon: LayoutDashboard },
  {title:"Profile", url:ROUTES.profile,icon:User},
  { title: 'Jobs', url: ROUTES.jobs, icon: Briefcase },
  { title: 'Applications', url: ROUTES.applications, icon: FileStack },
  { title: 'Resume', url: ROUTES.resume, icon: FileText },
  { title: 'Preparations', url: ROUTES.preparations, icon: GraduationCap },
];

export const UPCOMING_FEATURES: UpcomingFeature[] = [
  { name: 'Cold Mailing', description: 'Automated outreach to hiring managers', icon: Mail },
  { name: 'Voice Interview', description: 'AI-powered mock voice interviews', icon: Mic },
  { name: 'Salary Intel', description: 'Real-time compensation benchmarks', icon: Target },
  { name: 'Network Radar', description: 'Find warm intros at target companies', icon: Radar },
  { name: 'AI Cover Letters', description: 'Tailored letters per application', icon: Sparkles },
  { name: 'Referral Engine', description: 'Connect with employees for referrals', icon: Users },
  { name: 'Career Coach', description: 'Personalized growth recommendations', icon: Brain },
];

export const STUDIO_FEATURES = [
  {
    label: 'Quick Create',
    title: 'Launch\nanything fast.',
    desc: 'Start a job search, generate a resume, or begin interview prep in one click.',
    href: ROUTES.studio,
    cta: 'Open Studio',
    accent: '#b5451b',
  },
  {
    label: 'Dashboard',
    title: 'Track your\nsurvival stats.',
    desc: 'Monitor searches, applications, prep progress, and AI predictions.',
    href: ROUTES.dashboard,
    cta: 'View Dashboard',
    accent: '#c4922a',
  },
  {
    label: 'Job Radar',
    title: 'Find the cracks\nin the market.',
    desc: 'Browse scraped openings from across the internet.',
    href: ROUTES.jobs,
    cta: 'Browse Jobs',
    accent: '#4a7c59',
  },
  {
    label: 'Applications',
    title: 'Every search\nlogged.',
    desc: 'Track jobs discovered through your searches and application status.',
    href: ROUTES.applications,
    cta: 'View Applications',
    accent: '#1a6b8a',
  },
  {
    label: 'Profile',
    title: 'Professional\ndata hub.',
    desc: 'Manage the information used across all your job applications.',
    href: ROUTES.profile,
    cta: 'Edit Profile',
    accent: '#b5451b',
  },
  {
    label: 'Resume Forge',
    title: 'LaTeX to PDF\nin seconds.',
    desc: 'Generate ATS-optimized resumes from your profile data.',
    href: ROUTES.resume,
    cta: 'Build Resume',
    accent: '#c4922a',
  },
  {
    label: 'Interview Prep',
    title: "Answers they\nwon't expect.",
    desc: 'Practice with AI-generated questions tailored to your target role.',
    href: ROUTES.preparations,
    cta: 'Start Prep',
    accent: '#4a7c59',
  },
  {
    label: 'Settings',
    title: 'Fine-tune\nyour experience.',
    desc: 'Theme, notifications, privacy, and account preferences.',
    href: ROUTES.settings,
    cta: 'Open Settings',
    accent: '#1a6b8a',
  },
];

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.studio]: 'Studio',
  [ROUTES.dashboard]: 'Dashboard',
  [ROUTES.jobs]: 'Jobs',
  [ROUTES.applications]: 'Applications',
  [ROUTES.profile]: 'Profile',
  [ROUTES.resume]: 'Resume',
  [ROUTES.preparations]: 'Preparations',
  [ROUTES.settings]: 'Settings',
  [ROUTES.account]: 'Account',
  [ROUTES.billing]: 'Billing',
  [ROUTES.notifications]: 'Notifications',
  [ROUTES.quick]: 'Search',
  [ROUTES.contact]: 'Contact Us',
};

