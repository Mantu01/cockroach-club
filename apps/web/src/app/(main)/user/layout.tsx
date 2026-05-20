'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  CircleUserRound,
  CreditCard,
  Bell,
  Settings2,
  Mail,
  Flame,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/app';
import StoreProvider from '@/providers/store-provider';
import { StudioDataProvider } from '@/context/studio-data-context';

function UserLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const avatar = user?.imageUrl ?? '';
  const name = user?.fullName ?? user?.username ?? 'User';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { label: 'Account', href: ROUTES.account, icon: CircleUserRound },
    { label: 'Billing', href: ROUTES.billing, icon: CreditCard },
    { label: 'Notifications', href: ROUTES.notifications, icon: Bell },
    { label: 'Settings', href: ROUTES.settings, icon: Settings2 },
    { label: 'Contact Us', href: ROUTES.contact, icon: Mail },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1 flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        <aside className="w-full md:w-64 flex flex-col gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Link href={ROUTES.dashboard} className="flex items-center gap-2">
              <Flame className="size-4 text-[#b5451b]" />
              <span
                className="text-sm font-black tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Cockroach Club
              </span>
            </Link>
          </div>
          <Separator className="border-border/30" />
          <Button variant="ghost" size="sm" className="h-7 text-[10px] w-fit" asChild>
            <Link href={ROUTES.studio}>
              <ArrowLeft className="size-3 mr-1" />
              Back to Studio
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="justify-start h-8 text-xs font-medium"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="size-3.5 mr-2" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          <Separator className="border-border/30 mt-auto hidden md:block" />
          <div className="items-center gap-2 px-2 py-2 text-left hidden md:flex">
            <Avatar className="h-7 w-7 rounded-lg">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-lg text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-xs font-medium">{name}</span>
              <span className="truncate text-[10px] text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress ?? ''}
              </span>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <StudioDataProvider>
        <UserLayoutContent>{children}</UserLayoutContent>
      </StudioDataProvider>
    </StoreProvider>
  );
}
