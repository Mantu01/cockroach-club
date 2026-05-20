'use client'

import Link from 'next/link'
import { NavMain } from '@/components/sidebar/nav-main'
import { NavRecentSearches } from '@/components/sidebar/nav-recent-searches'
import { NavUpcoming } from '@/components/sidebar/nav-upcoming'
import { NavUser } from '@/components/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Flame } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/lib/constants/app'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href={ROUTES.dashboard}>
                <Flame className="size-4 text-[#b5451b]" />
                <span
                  className="text-sm font-black tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {APP_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavUpcoming />
        <NavRecentSearches />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
