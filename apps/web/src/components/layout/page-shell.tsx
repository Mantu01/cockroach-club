import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PageShellProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaText?: string;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  ctaHref,
  ctaText,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-5xl border border-border/30 bg-background/95 shadow-xl">
        <CardHeader className="space-y-4 px-8 py-10">
          <div className="max-w-3xl">
            <CardTitle className="text-3xl font-black tracking-tight text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="mt-3 text-base leading-relaxed text-muted-foreground/90">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 px-8 py-10">
          {children}
          {ctaHref && ctaText ? (
            <div className="flex justify-end">
              <Button asChild size="lg" className="px-6 py-4">
                <Link href={ctaHref}>
                  {ctaText} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
