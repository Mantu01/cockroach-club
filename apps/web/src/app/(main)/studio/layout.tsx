'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import StoreProvider from '@/providers/store-provider';
import { StudioDataProvider, useStudioData } from '@/context/studio-data-context';

function StudioInitializer({ children }: { children: ReactNode }) {
  const { fetchRecentSearches } = useStudioData();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchRecentSearches();
  }, [fetchRecentSearches]);

  return <>{children}</>;
}

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <StudioDataProvider>
        <TooltipProvider>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 60)',
                '--header-height': 'calc(var(--spacing) * 11)',
              } as React.CSSProperties
            }
          >
            <StudioInitializer>
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                {children}
              </SidebarInset>
            </StudioInitializer>
          </SidebarProvider>
        </TooltipProvider>
      </StudioDataProvider>
    </StoreProvider>
  );
}
