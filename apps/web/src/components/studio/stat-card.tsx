'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UI_SIZES } from '@/lib/constants/theme'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'stable'
  hint?: string
}

export function StatCard({ label, value, change, trend, hint }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <Card className="border border-border/40 bg-muted/5">
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-4 py-3">
        <span className={UI_SIZES.sectionLabel}>{label}</span>
        {change && trend && (
          <Badge variant="outline" className={`${UI_SIZES.badge} gap-1`}>
            <TrendIcon className="size-3" />
            {change}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className={`${UI_SIZES.cardValue} tracking-tight`} style={{ fontFamily: "'Syne', sans-serif" }}>
          {value}
        </p>
        {hint && <p className={`mt-1 ${UI_SIZES.pageSubtitle}`}>{hint}</p>}
      </CardContent>
    </Card>
  )
}
