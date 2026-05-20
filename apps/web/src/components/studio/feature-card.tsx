'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { UI_SIZES } from '@/lib/constants/theme';

interface FeatureCardProps {
  label: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  accent: string;
}

export function FeatureCard({ label, title, desc, href, cta, accent }: FeatureCardProps) {
  return (
    <Card className="border border-border/40 bg-muted/5 hover:bg-muted/10 transition-colors duration-300 group">
      <CardContent className="flex flex-col gap-3 p-5">
        <Badge variant="outline" className={`w-fit ${UI_SIZES.badge}`}>
          {label}
        </Badge>
        <h3
          className="text-base font-black leading-tight tracking-tight whitespace-pre-line"
          style={{ fontFamily: "'Syne', sans-serif", color: accent }}
        >
          {title}
        </h3>
        <p className={`${UI_SIZES.pageSubtitle} flex-1`}>{desc}</p>
        <Button
          variant="ghost"
          size="sm"
          className="w-fit px-0 text-[10px] tracking-widest uppercase font-bold group-hover:translate-x-1 transition-transform duration-200"
          style={{ fontFamily: "'Syne', sans-serif" }}
          asChild
        >
          <Link href={href}>
            {cta} <ArrowRight size={12} className="ml-1 inline" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
