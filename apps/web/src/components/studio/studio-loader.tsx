'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StudioLoader({ rows = 4 }) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header Skeleton */}
      <div className="px-4 py-6 lg:px-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Grid - 4 cards */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4 lg:grid-cols-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border/40 bg-muted/5">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart and Predictions Row */}
      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-3 lg:px-6">
        {/* Chart Card */}
        <Card className="border border-border/40 bg-muted/5 lg:col-span-2">
          <CardHeader className="px-4 py-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <Skeleton className="h-45 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Predictions Card */}
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div className="px-4 py-4 lg:px-6">
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <div className="space-y-2">
              {/* Table Header */}
              <div className="flex px-4 py-2">
                <Skeleton className="h-3 w-20 mr-4" />
                <Skeleton className="h-3 w-24 mr-4" />
                <Skeleton className="h-3 w-16 mr-4" />
                <Skeleton className="h-3 w-24" />
              </div>
              
              {/* Table Rows */}
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center px-4 py-3 border-t border-border/20">
                  <Skeleton className="h-4 w-32 mr-4" />
                  <Skeleton className="h-4 w-28 mr-4" />
                  <Skeleton className="h-5 w-16 mr-4 rounded" />
                  <Skeleton className="h-3 w-36" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}