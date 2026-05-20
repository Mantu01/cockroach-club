'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface StudioLoaderProps {
  rows?: number
}

export function StudioLoader({ rows = 4 }: StudioLoaderProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 lg:px-6">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}
