'use client'

import { UI_SIZES } from '@/lib/constants/theme'

interface StudioPageHeaderProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function StudioPageHeader({ title, description, action }: StudioPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/30 px-4 py-4 lg:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h2
          className={UI_SIZES.pageTitle}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h2>
        <p className={UI_SIZES.pageSubtitle}>{description}</p>
      </div>
      {action && <div className="mt-2 lg:mt-0">{action}</div>}
    </div>
  )
}
