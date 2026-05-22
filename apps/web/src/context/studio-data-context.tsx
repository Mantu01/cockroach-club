'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { setAuthToken, studioApi } from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import {
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
} from '@/store/slices/studio-slice';

type FetchKey =
  | 'dashboard'
  | 'jobs'
  | 'exploreJobs'
  | 'applications'
  | 'recentSearches'
  | 'profile'
  | 'resumes'
  | 'preparations'
  | 'settings'
  | 'notifications'
  | 'billing'
  | 'account';

interface StudioDataContextValue {
  fetchDashboard: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  fetchExploreJobs: (params?: any) => Promise<void>;
  shareJob: (id: string) => Promise<any>;
  getJobByShareId: (shareId: string) => Promise<any>;
  fetchApplications: () => Promise<void>;
  fetchRecentSearches: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchResumes: () => Promise<void>;
  fetchResumeById: (id: string) => Promise<any>;
  createResume: (data: {
    title?: string;
    template?: string;
    useProfileData: boolean;
    profileData?: unknown;
    jobId?: string;
    jobTitle?: string;
    company?: string;
    whyCreated?: string;
  }) => Promise<any>;
  updateResume: (id: string, data: { title: string; latex: string }) => Promise<any>;
  deleteResume: (id: string) => Promise<any>;
  compileResume: (latex: string) => Promise<Blob>;
  editResumeWithAI: (latex: string, prompt: string) => Promise<string>;
  fetchPreparations: () => Promise<void>;
  fetchPreparationById: (id: string) => Promise<any>;
  fetchSettings: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchBilling: () => Promise<void>;
  fetchAccount: () => Promise<void>;
  updateProfile: (data: unknown) => Promise<void>;
  updateSettings: (data: unknown) => Promise<void>;
  generateResume: (template?: string) => Promise<unknown>;
  createPreparation: (
    roleOrData: string | {
      role: string;
      title?: string;
      jobId?: string;
      jobTitle?: string;
      company?: string;
      skills?: string[];
      experience?: string;
    },
    title?: string
  ) => Promise<any>;
  answerQuestion: (preparationId: string, questionId: string, answer: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  ensureAuth: () => Promise<boolean>;
}

const StudioDataContext = createContext<StudioDataContextValue | null>(null);

export function StudioDataProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { getToken, isSignedIn } = useClerkAuth();
  const tokenRef = useRef<string | null>(null);

  const ensureAuth = useCallback(async () => {
    if (!isSignedIn) return false;
    const token = await getToken();
    if (!token) return false;
    if (token !== tokenRef.current) {
      tokenRef.current = token;
      setAuthToken(token);
    }
    return true;
  }, [getToken, isSignedIn]);

  const withFetch = useCallback(
    async (key: FetchKey, fetcher: () => Promise<void>) => {
      dispatch(setLoading({ key, value: true }));
      dispatch(setError({ key, value: null }));
      try {
        const authed = await ensureAuth();
        if (!authed) {
          dispatch(setError({ key, value: 'Not authenticated' }));
          return;
        }
        await fetcher();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Request failed';
        dispatch(setError({ key, value: message }));
      } finally {
        dispatch(setLoading({ key, value: false }));
      }
    },
    [dispatch, ensureAuth]
  );

  const fetchDashboard = useCallback(
    () =>
      withFetch('dashboard', async () => {
        const { data } = await studioApi.getDashboard();
        dispatch(setDashboard(data));
      }),
    [dispatch, withFetch]
  );

  const fetchJobs = useCallback(
    () =>
      withFetch('jobs', async () => {
        const { data } = await studioApi.getJobs();
        dispatch(setJobs(data.jobs));
      }),
    [dispatch, withFetch]
  );

  const fetchExploreJobs = useCallback(
    (params?: any) =>
      withFetch('exploreJobs', async () => {
        const { data } = await studioApi.getExploreJobs(params);
        dispatch(setExploreJobs({ jobs: data.jobs, total: data.total }));
      }),
    [dispatch, withFetch]
  );

  const shareJob = useCallback(
    async (id: string) => {
      await ensureAuth();
      const { data } = await studioApi.shareJob(id);
      return data;
    },
    [ensureAuth]
  );

  const getJobByShareId = useCallback(
    async (shareId: string) => {
      const { data } = await studioApi.getJobByShareId(shareId);
      return data.job;
    },
    []
  );

  const fetchApplications = useCallback(
    () =>
      withFetch('applications', async () => {
        const { data } = await studioApi.getApplications();
        dispatch(setApplications(data.applications));
      }),
    [dispatch, withFetch]
  );

  const fetchRecentSearches = useCallback(
    () =>
      withFetch('recentSearches', async () => {
        const { data } = await studioApi.getRecentSearches();
        dispatch(setRecentSearches(data.searches));
      }),
    [dispatch, withFetch]
  );

  const fetchProfile = useCallback(
    () =>
      withFetch('profile', async () => {
        const { data } = await studioApi.getProfile();
        dispatch(setProfile(data.profile));
      }),
    [dispatch, withFetch]
  );

  const fetchResumes = useCallback(
    () =>
      withFetch('resumes', async () => {
        const { data } = await studioApi.getResumes();
        dispatch(setResumes(data.resumes));
      }),
    [dispatch, withFetch]
  );

  const fetchResumeById = useCallback(
    async (id: string) => {
      await ensureAuth();
      const { data } = await studioApi.getResumeById(id);
      return data.resume;
    },
    [ensureAuth]
  );

  const createResume = useCallback(
    async (resumeData: {
      title?: string;
      template?: string;
      useProfileData: boolean;
      profileData?: unknown;
      jobId?: string;
      jobTitle?: string;
      company?: string;
      whyCreated?: string;
    }) => {
      await ensureAuth();
      const { data } = await studioApi.createResume(resumeData);
      await fetchResumes();
      return data.resume;
    },
    [ensureAuth, fetchResumes]
  );

  const updateResume = useCallback(
    async (id: string, resumeData: { title: string; latex: string }) => {
      await ensureAuth();
      const { data } = await studioApi.updateResume(id, resumeData);
      await fetchResumes();
      return data.resume;
    },
    [ensureAuth, fetchResumes]
  );

  const deleteResume = useCallback(
    async (id: string) => {
      await ensureAuth();
      const { data } = await studioApi.deleteResume(id);
      await fetchResumes();
      return data;
    },
    [ensureAuth, fetchResumes]
  );

  const compileResume = useCallback(
    async (latex: string) => {
      await ensureAuth();
      const { data } = await studioApi.compileResume(latex);
      return data;
    },
    [ensureAuth]
  );

  const editResumeWithAI = useCallback(
    async (latex: string, prompt: string) => {
      await ensureAuth();
      const { data } = await studioApi.editResumeWithAI(latex, prompt);
      return data.latex as string;
    },
    [ensureAuth]
  );

  const fetchPreparations = useCallback(
    () =>
      withFetch('preparations', async () => {
        const { data } = await studioApi.getPreparations();
        dispatch(setPreparations(data.preparations));
      }),
    [dispatch, withFetch]
  );

  const fetchPreparationById = useCallback(
    async (id: string) => {
      await ensureAuth();
      const { data } = await studioApi.getPreparationById(id);
      return data.preparation;
    },
    [ensureAuth]
  );

  const fetchSettings = useCallback(
    () =>
      withFetch('settings', async () => {
        const { data } = await studioApi.getSettings();
        dispatch(setSettings(data.settings));
      }),
    [dispatch, withFetch]
  );

  const fetchNotifications = useCallback(
    () =>
      withFetch('notifications', async () => {
        const { data } = await studioApi.getNotifications();
        dispatch(setNotifications(data.notifications));
      }),
    [dispatch, withFetch]
  );

  const fetchBilling = useCallback(
    () =>
      withFetch('billing', async () => {
        const { data } = await studioApi.getBilling();
        dispatch(setBilling(data.billing));
      }),
    [dispatch, withFetch]
  );

  const fetchAccount = useCallback(
    () =>
      withFetch('account', async () => {
        const { data } = await studioApi.getAccount();
        dispatch(setAccount(data.account));
      }),
    [dispatch, withFetch]
  );

  const updateProfile = useCallback(
    async (profileData: unknown) => {
      await ensureAuth();
      const { data } = await studioApi.updateProfile(profileData);
      dispatch(setProfile(data.profile));
    },
    [dispatch, ensureAuth]
  );

  const updateSettingsData = useCallback(
    async (settingsData: unknown) => {
      await ensureAuth();
      const { data } = await studioApi.updateSettings(settingsData);
      dispatch(setSettings(data.settings));
    },
    [dispatch, ensureAuth]
  );

  const generateResume = useCallback(
    async (template?: string) => {
      await ensureAuth();
      return studioApi.generateResume(template);
    },
    [ensureAuth]
  );

  const createPreparation = useCallback(
    async (
      roleOrData: string | {
        role: string;
        title?: string;
        jobId?: string;
        jobTitle?: string;
        company?: string;
        skills?: string[];
        experience?: string;
      },
      title?: string
    ) => {
      await ensureAuth();
      let payload;
      if (typeof roleOrData === 'string') {
        payload = { role: roleOrData, title };
      } else {
        payload = roleOrData;
      }
      const { data } = await studioApi.createPreparation(payload);
      await fetchPreparations();
      return data.preparation;
    },
    [ensureAuth, fetchPreparations]
  );

  const answerQuestion = useCallback(
    async (preparationId: string, questionId: string, answer: string) => {
      await ensureAuth();
      await studioApi.answerQuestion({ preparationId, questionId, answer });
      const { data: allData } = await studioApi.getPreparations();
      dispatch(setPreparations(allData.preparations));
    },
    [dispatch, ensureAuth]
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      await ensureAuth();
      const { data } = await studioApi.markNotificationRead(id);
      dispatch(updateNotification(data.notification));
    },
    [dispatch, ensureAuth]
  );

  const value = useMemo(
    () => ({
      fetchDashboard,
      fetchJobs,
      fetchExploreJobs,
      shareJob,
      getJobByShareId,
      fetchApplications,
      fetchRecentSearches,
      fetchProfile,
      fetchResumes,
      fetchResumeById,
      createResume,
      updateResume,
      deleteResume,
      compileResume,
      editResumeWithAI,
      fetchPreparations,
      fetchPreparationById,
      fetchSettings,
      fetchNotifications,
      fetchBilling,
      fetchAccount,
      updateProfile,
      updateSettings: updateSettingsData,
      generateResume,
      createPreparation,
      answerQuestion,
      markNotificationRead,
      ensureAuth,
    }),
    [
      fetchDashboard,
      fetchJobs,
      fetchExploreJobs,
      shareJob,
      getJobByShareId,
      fetchApplications,
      fetchRecentSearches,
      fetchProfile,
      fetchResumes,
      fetchResumeById,
      createResume,
      updateResume,
      deleteResume,
      compileResume,
      editResumeWithAI,
      fetchPreparations,
      fetchPreparationById,
      fetchSettings,
      fetchNotifications,
      fetchBilling,
      fetchAccount,
      updateProfile,
      updateSettingsData,
      generateResume,
      createPreparation,
      answerQuestion,
      markNotificationRead,
      ensureAuth,
    ]
  );

  return <StudioDataContext.Provider value={value}>{children}</StudioDataContext.Provider>;
}

export function useStudioData() {
  const context = useContext(StudioDataContext);
  if (!context) throw new Error('useStudioData must be used within StudioDataProvider');
  return context;
}
