import Link from 'next/link'
import { Button } from '@/components/ui/button'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background px-6 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-base font-semibold text-foreground">Cockroach Club</p>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground/90">
            A resilient experience built to keep your application strong, simple, and consistent from auth to profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {footerLinks.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-8 border-t border-border/20 pt-6 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Cockroach Club. Built for durable paths and clean auth.
      </div>
    </footer>
  )
}
