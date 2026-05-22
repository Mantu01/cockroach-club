'use client';

import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bug } from 'lucide-react';
import { ROUTES } from '@/lib/constants/app';

export default function Header() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const name = user?.fullName ?? user?.username ?? 'User';
  const avatar = user?.imageUrl ?? '';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <Bug className="size-5 text-[#b5451b]" />
          <span
            className="text-base font-black tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Cockroach Club
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/about" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/terms" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/privacy-policy" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold px-4" asChild>
                <Link href={ROUTES.dashboard}>Studio</Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4" onClick={handleLogout}>
                Log Out
              </Button>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="rounded-lg text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold px-4" asChild>
                <Link href={ROUTES.login}>Log In</Link>
              </Button>
              <Button size="sm" className="h-8 text-[10px] tracking-widest uppercase font-bold px-4" asChild>
                <Link href={ROUTES.signup}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
