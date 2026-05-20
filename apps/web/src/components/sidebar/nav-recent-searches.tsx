'use client'

import Link from 'next/link'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { SearchIcon } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/lib/constants/app'

export function NavRecentSearches() {
  const searches = useAppSelector((s) => s.studio.recentSearches)
  const loading = useAppSelector((s) => s.studio.loading.recentSearches)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[10px] tracking-widest uppercase">
        Recent Searches
      </SidebarGroupLabel>
      <SidebarMenu>
        {loading && searches.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <SearchIcon className="size-4" />
              <span className="text-xs text-muted-foreground">Loading…</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : searches.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <SearchIcon className="size-4" />
              <span className="text-xs text-muted-foreground">No searches yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          searches.map((search) => (
            <SidebarMenuItem key={search._id}>
              <SidebarMenuButton asChild tooltip={search.query}>
                <Link href={`${ROUTES.jobs}?q=${encodeURIComponent(search.query)}`}>
                  <SearchIcon className="size-4" />
                  <span className="truncate text-xs">{search.query}</span>
                  <Badge variant="outline" className="ml-auto text-[9px] px-1 py-0">
                    {search.resultsCount}
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
