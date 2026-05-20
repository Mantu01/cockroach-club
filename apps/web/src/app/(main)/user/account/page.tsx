'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StudioLoader } from '@/components/studio/studio-loader'
import StoreProvider from '@/providers/store-provider'
import { StudioDataProvider, useStudioData } from '@/context/studio-data-context'
import { useAppSelector } from '@/store/hooks'
import { UI_SIZES } from '@/lib/constants/theme'
import { ROUTES } from '@/lib/constants/app'
import { ArrowLeft } from 'lucide-react'

function AccountContent() {
  const { user } = useUser()
  const { fetchAccount } = useStudioData()
  const account = useAppSelector((s) => s.studio.account)
  const loading = useAppSelector((s) => s.studio.loading.account)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    void fetchAccount()
  }, [fetchAccount])

  if (loading && !account) return <StudioLoader rows={4} />

  return (
    <div className="min-h-[calc(100vh-220px)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] w-fit" asChild>
          <Link href={ROUTES.settings}>
            <ArrowLeft className="size-3 mr-1" />
            Back to Settings
          </Link>
        </Button>

        <div className="flex flex-col gap-1">
          <h1 className={UI_SIZES.pageTitle} style={{ fontFamily: "'Syne', sans-serif" }}>Account</h1>
          <p className={UI_SIZES.pageSubtitle}>Your account details and membership information.</p>
        </div>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Clerk Identity</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4 pb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{user?.fullName ?? 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.primaryEmailAddress?.emailAddress ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-[10px]">{user?.id ?? '—'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Membership</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4 pb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits</span>
              <Badge variant="outline" className="text-[10px]">{account?.credits ?? 0} / {account?.totalCredits ?? 0}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{account?.memberSince ? new Date(account.memberSince).toLocaleDateString() : '—'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <StoreProvider>
      <StudioDataProvider>
        <AccountContent />
      </StudioDataProvider>
    </StoreProvider>
  )
}
