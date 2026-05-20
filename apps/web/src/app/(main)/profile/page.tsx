'use client'

import { useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import PageShell from '@/components/layout/page-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DbUser {
  id: string
  email: string
  credits: number
  Tcredits: number
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { getToken } = useClerkAuth()
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loadingDb, setLoadingDb] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userStatus = user ? (user as any).status : 'Unknown'

  useEffect(() => {
    if (!isLoaded || !user?.id) return

    const fetchProfile = async () => {
      setLoadingDb(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Unable to get Clerk session token')
        }

        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || 'Unable to load database record')
        }

        const data = await response.json()
        setDbUser(data.user ?? null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoadingDb(false)
      }
    }

    fetchProfile()
  }, [isLoaded, user, getToken])

  return (
    <PageShell
      title="Profile"
      description="Your Clerk account details are synced with the database so you can inspect both sources in one place."
    >
      {!isLoaded ? (
        <div className="text-muted-foreground">Loading profile…</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border border-border/30 bg-background/90">
            <CardHeader className="px-6 py-6">
              <CardTitle className="text-xl font-semibold">Clerk Account</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Name:</span>{' '}
                  {user?.fullName ?? 'Not set'}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email:</span>{' '}
                  {user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? 'Not set'}
                </p>
                <p>
                  <span className="font-medium text-foreground">ID:</span> {user?.id ?? 'Not set'}
                </p>
                <p>
                  <span className="font-medium text-foreground">Status:</span> {userStatus}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-background/90">
            <CardHeader className="px-6 py-6">
              <CardTitle className="text-xl font-semibold">Database Record</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loadingDb ? (
                <p className="text-muted-foreground">Fetching synced record…</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : dbUser ? (
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Email:</span> {dbUser.email}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Credits:</span> {dbUser.credits}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Total Credits:</span> {dbUser.Tcredits}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Created:</span>{' '}
                    {new Date(dbUser.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No database record found for this Clerk user.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </PageShell>
  )
}
