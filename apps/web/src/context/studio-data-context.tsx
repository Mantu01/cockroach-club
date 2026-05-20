'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef } from 'react'
import { useAuth as useClerkAuth } from '@clerk/nextjs'
import { setAuthToken, studioApi } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import {
  setLoading,
  setError,
  setDashboard,
  setJobs,
  setApplications,
  setRecentSearches,
  setProfile,
  setPreparations,
  setSettings,
  setNotifications,
  setBilling,
  setAccount,
  updateNotification,
} from '@/store/slices/studio-slice'

type FetchKey =
  | 'dashboard'
  | 'jobs'
  | 'applications'
  | 'recentSearches'
  | 'profile'
  | 'preparations'
  | 'settings'
  | 'notifications'
  | 'billing'
  | 'account'

interface StudioDataContextValue {
  fetchDashboard: () => Promise<void>
  fetchJobs: () => Promise<void>
  fetchApplications: () => Promise<void>
  fetchRecentSearches: () => Promise<void>
  fetchProfile: () => Promise<void>
  fetchPreparations: () => Promise<void>
  fetchSettings: () => Promise<void>
  fetchNotifications: () => Promise<void>
  fetchBilling: () => Promise<void>
  fetchAccount: () => Promise<void>
  updateProfile: (data: unknown) => Promise<void>
  updateSettings: (data: unknown) => Promise<void>
  generateResume: (template?: string) => Promise<unknown>
  createPreparation: (role: string, title?: string) => Promise<void>
  answerQuestion: (preparationId: string, questionId: string, answer: string) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  ensureAuth: () => Promise<boolean>
}

const StudioDataContext = createContext<StudioDataContextValue | null>(null)

export function StudioDataProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { getToken, isSignedIn } = useClerkAuth()
  const tokenRef = useRef<string | null>(null)

  const ensureAuth = useCallback(async () => {
    if (!isSignedIn) return false
    const token = await getToken()
    if (!token) return false
    if (token !== tokenRef.current) {
      tokenRef.current = token
      setAuthToken(token)
    }
    return true
  }, [getToken, isSignedIn])

  const withFetch = useCallback(
    async (key: FetchKey, fetcher: () => Promise<void>) => {
      dispatch(setLoading({ key, value: true }))
      dispatch(setError({ key, value: null }))
      try {
        const authed = await ensureAuth()
        if (!authed) {
          dispatch(setError({ key, value: 'Not authenticated' }))
          return
        }
        await fetcher()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Request failed'
        dispatch(setError({ key, value: message }))
      } finally {
        dispatch(setLoading({ key, value: false }))
      }
    },
    [dispatch, ensureAuth]
  )

  const fetchDashboard = useCallback(
    () =>
      withFetch('dashboard', async () => {
        const { data } = await studioApi.getDashboard()
        dispatch(setDashboard(data))
      }),
    [dispatch, withFetch]
  )

  const fetchJobs = useCallback(
    () =>
      withFetch('jobs', async () => {
        const { data } = await studioApi.getJobs()
        dispatch(setJobs(data.jobs))
      }),
    [dispatch, withFetch]
  )

  const fetchApplications = useCallback(
    () =>
      withFetch('applications', async () => {
        const { data } = await studioApi.getApplications()
        dispatch(setApplications(data.applications))
      }),
    [dispatch, withFetch]
  )

  const fetchRecentSearches = useCallback(
    () =>
      withFetch('recentSearches', async () => {
        const { data } = await studioApi.getRecentSearches()
        dispatch(setRecentSearches(data.searches))
      }),
    [dispatch, withFetch]
  )

  const fetchProfile = useCallback(
    () =>
      withFetch('profile', async () => {
        const { data } = await studioApi.getProfile()
        dispatch(setProfile(data.profile))
      }),
    [dispatch, withFetch]
  )

  const fetchPreparations = useCallback(
    () =>
      withFetch('preparations', async () => {
        const { data } = await studioApi.getPreparations()
        dispatch(setPreparations(data.preparations))
      }),
    [dispatch, withFetch]
  )

  const fetchSettings = useCallback(
    () =>
      withFetch('settings', async () => {
        const { data } = await studioApi.getSettings()
        dispatch(setSettings(data.settings))
      }),
    [dispatch, withFetch]
  )

  const fetchNotifications = useCallback(
    () =>
      withFetch('notifications', async () => {
        const { data } = await studioApi.getNotifications()
        dispatch(setNotifications(data.notifications))
      }),
    [dispatch, withFetch]
  )

  const fetchBilling = useCallback(
    () =>
      withFetch('billing', async () => {
        const { data } = await studioApi.getBilling()
        dispatch(setBilling(data.billing))
      }),
    [dispatch, withFetch]
  )

  const fetchAccount = useCallback(
    () =>
      withFetch('account', async () => {
        const { data } = await studioApi.getAccount()
        dispatch(setAccount(data.account))
      }),
    [dispatch, withFetch]
  )

  const updateProfile = useCallback(
    async (profileData: unknown) => {
      await ensureAuth()
      const { data } = await studioApi.updateProfile(profileData)
      dispatch(setProfile(data.profile))
    },
    [dispatch, ensureAuth]
  )

  const updateSettingsData = useCallback(
    async (settingsData: unknown) => {
      await ensureAuth()
      const { data } = await studioApi.updateSettings(settingsData)
      dispatch(setSettings(data.settings))
    },
    [dispatch, ensureAuth]
  )

  const generateResume = useCallback(
    async (template?: string) => {
      await ensureAuth()
      return studioApi.generateResume(template)
    },
    [ensureAuth]
  )

  const createPreparation = useCallback(
    async (role: string, title?: string) => {
      await ensureAuth()
      await studioApi.createPreparation({ role, title })
      await fetchPreparations()
    },
    [ensureAuth, fetchPreparations]
  )

  const answerQuestion = useCallback(
    async (preparationId: string, questionId: string, answer: string) => {
      await ensureAuth()
      await studioApi.answerQuestion({ preparationId, questionId, answer })
      const { data: allData } = await studioApi.getPreparations()
      dispatch(setPreparations(allData.preparations))
    },
    [dispatch, ensureAuth]
  )

  const markNotificationRead = useCallback(
    async (id: string) => {
      await ensureAuth()
      const { data } = await studioApi.markNotificationRead(id)
      dispatch(updateNotification(data.notification))
    },
    [dispatch, ensureAuth]
  )

  const value = useMemo(
    () => ({
      fetchDashboard,
      fetchJobs,
      fetchApplications,
      fetchRecentSearches,
      fetchProfile,
      fetchPreparations,
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
      fetchApplications,
      fetchRecentSearches,
      fetchProfile,
      fetchPreparations,
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
  )

  return (
    <StudioDataContext.Provider value={value}>{children}</StudioDataContext.Provider>
  )
}

export function useStudioData() {
  const context = useContext(StudioDataContext)
  if (!context) throw new Error('useStudioData must be used within StudioDataProvider')
  return context
}
