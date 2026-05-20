'use client';

import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  Settings2Icon,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/app';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const name = user?.fullName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const avatar = user?.imageUrl ?? '';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push(ROUTES.login);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-7 w-7 rounded-lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="rounded-lg text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-xs font-medium">{name}</span>
                <span className="truncate text-[10px] text-muted-foreground">{email}</span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-52 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left">
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="rounded-lg text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-xs font-medium">{name}</span>
                  <span className="truncate text-[10px] text-muted-foreground">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="text-xs">
                <Link href={ROUTES.account}>
                  <CircleUserRoundIcon className="size-3.5" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href={ROUTES.billing}>
                  <CreditCardIcon className="size-3.5" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href={ROUTES.notifications}>
                  <BellIcon className="size-3.5" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href={ROUTES.settings}>
                  <Settings2Icon className="size-3.5" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-xs text-destructive">
              <LogOutIcon className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
