import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  DashboardData,
  JobItem,
  ApplicationItem,
  RecentSearchItem,
  UserProfile,
  PreparationItem,
  ResumeItem,
  UserSettings,
  NotificationItem,
  BillingData,
  AccountData,
} from '@/lib/api';

interface StudioState {
  dashboard: DashboardData | null;
  jobs: JobItem[];
  exploreJobs: JobItem[];
  exploreTotal: number;
  applications: ApplicationItem[];
  recentSearches: RecentSearchItem[];
  profile: UserProfile | null;
  resumes: ResumeItem[];
  preparations: PreparationItem[];
  settings: UserSettings | null;
  notifications: NotificationItem[];
  billing: BillingData | null;
  account: AccountData | null;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: StudioState = {
  dashboard: null,
  jobs: [],
  exploreJobs: [],
  exploreTotal: 0,
  applications: [],
  recentSearches: [],
  profile: null,
  resumes: [],
  preparations: [],
  settings: null,
  notifications: [],
  billing: null,
  account: null,
  loading: {},
  error: {},
};

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setError: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      state.error[action.payload.key] = action.payload.value;
    },
    setDashboard: (state, action: PayloadAction<DashboardData>) => {
      state.dashboard = action.payload;
    },
    setJobs: (state, action: PayloadAction<JobItem[]>) => {
      state.jobs = action.payload;
    },
    setExploreJobs: (state, action: PayloadAction<{ jobs: JobItem[]; total: number }>) => {
      state.exploreJobs = action.payload.jobs;
      state.exploreTotal = action.payload.total;
    },
    setApplications: (state, action: PayloadAction<ApplicationItem[]>) => {
      state.applications = action.payload;
    },
    setRecentSearches: (state, action: PayloadAction<RecentSearchItem[]>) => {
      state.recentSearches = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setResumes: (state, action: PayloadAction<ResumeItem[]>) => {
      state.resumes = action.payload;
    },
    setPreparations: (state, action: PayloadAction<PreparationItem[]>) => {
      state.preparations = action.payload;
    },
    setSettings: (state, action: PayloadAction<UserSettings>) => {
      state.settings = action.payload;
    },
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications = action.payload;
    },
    setBilling: (state, action: PayloadAction<BillingData>) => {
      state.billing = action.payload;
    },
    setAccount: (state, action: PayloadAction<AccountData>) => {
      state.account = action.payload;
    },
    updateNotification: (state, action: PayloadAction<NotificationItem>) => {
      const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
      if (idx !== -1) state.notifications[idx] = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setDashboard,
  setJobs,
  setExploreJobs,
  setApplications,
  setRecentSearches,
  setProfile,
  setResumes,
  setPreparations,
  setSettings,
  setNotifications,
  setBilling,
  setAccount,
  updateNotification,
} = studioSlice.actions;

export default studioSlice.reducer;
