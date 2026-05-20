'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { UPCOMING_FEATURES } from '@/lib/constants/navigation';

export function NavUpcoming() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[10px] tracking-widest uppercase">
        Upcoming
      </SidebarGroupLabel>
      <SidebarMenu>
        {UPCOMING_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <SidebarMenuItem key={feature.name}>
              <SidebarMenuButton tooltip={feature.description} disabled>
                <Icon className="size-4 opacity-50" />
                <span className="truncate text-xs text-muted-foreground">{feature.name}</span>
                <Badge variant="outline" className="ml-auto text-[9px] px-1 py-0 opacity-60">
                  Soon
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
