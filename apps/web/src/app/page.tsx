'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronDown, Zap, Shield, Target, Flame } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const stages = [
  {
    id: '01',
    word: 'SQUASHED',
    sub: 'The Welcome Phase',
    description:
      "Congratulations. Your resume got auto-rejected in 0.3 seconds by a bot with no soul. You weren't even wrong for the role — you were just formatted incorrectly. The system doesn't hate you. It just doesn't see you.",
    image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b3?w=600&q=80',
    align: 'left',
    icon: Shield,
    accent: '#b5451b',
  },
  {
    id: '02',
    word: 'STOMPED',
    sub: 'The Growth Arc',
    description:
      'You rewrote your resume three times. You tailored cover letters to companies that ghosted you. You were overqualified, underqualified, and somehow both at once. This is called experience.',
    image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=600&q=80',
    align: 'right',
    icon: Zap,
    accent: '#c4922a',
  },
  {
    id: '03',
    word: 'SCUTTLED',
    sub: 'The Strategy',
    description:
      "Move sideways. Move diagonally. Move into roles nobody noticed. Cockroaches don't wait for doors — they find cracks. Your next opportunity isn't on the front page of any job board.",
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    align: 'left',
    icon: Target,
    accent: '#4a7c59',
  },
  {
    id: '04',
    word: 'SURVIVED',
    sub: 'The Destination',
    description:
      "Not hired. Not celebrated. Just still here — which, given everything, is genuinely impressive. You outlasted every rejection, every silence, every 'we've decided to move forward with other candidates.'",
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    align: 'right',
    icon: Flame,
    accent: '#1a6b8a',
  },
];

const stats = [
  { value: '97%', label: 'of resumes never reach a human' },
  { value: '3.2s', label: 'average ATS scan time' },
  { value: '400+', label: 'rejections before a cockroach breaks through' },
  { value: '1', label: 'crack is all you need' },
];

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function StageCard({ stage, index }: { stage: (typeof stages)[0]; index: number }) {
  const { ref, visible } = useIntersectionObserver();
  const isLeft = stage.align === 'left';
  const Icon = stage.icon;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[420px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.8s ease ${index * 0.12}s, transform 0.8s ease ${index * 0.12}s`,
      }}
    >
      {isLeft ? (
        <>
          <div className="flex flex-col justify-center px-10 py-12 lg:px-16 border-r border-border/30">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                {stage.id}
              </span>
              <div className="h-px flex-1 bg-border/40" />
              <Badge
                variant="outline"
                className="text-[10px] tracking-widest uppercase font-medium px-2 py-0.5"
              >
                {stage.sub}
              </Badge>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] font-black leading-none tracking-tighter mb-5"
              style={{ fontFamily: "'Syne', sans-serif", color: stage.accent }}
            >
              {stage.word}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              {stage.description}
            </p>
            <div className="flex items-center gap-2 mt-6">
              <Icon size={14} style={{ color: stage.accent }} />
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: stage.accent }}
              >
                Phase {stage.id}
              </span>
            </div>
          </div>
          <div className="overflow-hidden bg-muted/5">
            <div className="w-full h-full min-h-[320px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src={stage.image}
                alt={stage.word}
                width={600}
                height={420}
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="overflow-hidden bg-muted/5 order-2 lg:order-1">
            <div className="w-full h-full min-h-[320px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src={stage.image}
                alt={stage.word}
                width={600}
                height={420}
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center px-10 py-12 lg:px-16 border-l border-border/30 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                {stage.id}
              </span>
              <div className="h-px flex-1 bg-border/40" />
              <Badge
                variant="outline"
                className="text-[10px] tracking-widest uppercase font-medium px-2 py-0.5"
              >
                {stage.sub}
              </Badge>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] font-black leading-none tracking-tighter mb-5"
              style={{ fontFamily: "'Syne', sans-serif", color: stage.accent }}
            >
              {stage.word}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              {stage.description}
            </p>
            <div className="flex items-center gap-2 mt-6">
              <Icon size={14} style={{ color: stage.accent }} />
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: stage.accent }}
              >
                Phase {stage.id}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden" style={{ fontFamily: "'DM Serif Display', serif" }}>
      <section className="w-full min-h-[92vh] flex flex-col justify-between border-b border-border/30 px-6 lg:px-16 pt-16 pb-10">
        <div
          ref={heroRef}
          className="flex flex-col"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
              Cockroach Mode — Active
            </span>
          </div>

          <h1
            className="text-[clamp(3.5rem,11vw,10rem)] font-black leading-[0.88] tracking-tighter max-w-6xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="block">The Career</span>
            <span
              className="block italic"
              style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
            >
              that refused
            </span>
            <span className="block">to die.</span>
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-12">
            <p
              className="text-base text-muted-foreground leading-relaxed max-w-md"
              style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}
            >
              Built for those the system already counted out. We help you write the resume no bot
              dares ignore, prep the answers no interviewer expects, and crawl into opportunities
              that were never meant for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="text-sm tracking-widest uppercase font-bold px-8"
                style={{ fontFamily: "'Syne', sans-serif" }}
                asChild
              >
                <Link href="/studio">
                  Begin Surviving <ArrowRight size={14} className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm tracking-widest uppercase font-bold px-8"
                style={{ fontFamily: "'Syne', sans-serif" }}
                asChild
              >
                <Link href="/resume">Build Resume</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-12 text-muted-foreground/50 self-start">
          <ChevronDown size={16} className="animate-bounce" />
          <span className="text-xs font-mono tracking-widest uppercase">The Four Phases</span>
        </div>
      </section>

      <section className="w-full">
        <div className="px-6 lg:px-16 py-10 flex items-center justify-between border-b border-border/30">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground">
            The Cockroach Lifecycle
          </span>
          <Separator className="flex-1 mx-8" />
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground">
            04 Stages
          </span>
        </div>
        <div className="divide-y divide-border/30">
          {stages.map((stage, i) => (
            <StageCard key={stage.id} stage={stage} index={i} />
          ))}
        </div>
      </section>

      <section className="w-full border-t border-b border-border/30 px-6 lg:px-16 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-border/30">
          {stats.map((stat, i) => (
            <div key={i} className="px-6 lg:px-10 py-4 flex flex-col gap-1">
              <span
                className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground leading-snug max-w-[160px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              label: 'ATS Armor',
              title: "Resumes that\ndon't get eaten.",
              desc: 'Craft documents engineered to slip past automated filters — structured, keyword-dense, and ruthlessly formatted.',
              href: '/resume',
              cta: 'Forge Resume',
            },
            {
              label: 'Interview Intel',
              title: "Answers they\nwon't expect.",
              desc: 'Tailor-built responses for every role. Not generic. Not scripted. Precisely calibrated to make you sound indispensable.',
              href: '/interview',
              cta: 'Prep Now',
            },
            {
              label: 'Job Radar',
              title: 'Find the cracks\nin the market.',
              desc: 'Surface roles that match your actual profile — not the wishlist version. Get in where others stop looking.',
              href: '/jobs',
              cta: 'Hunt Openings',
            },
          ].map((card, i) => (
            <Card
              key={i}
              className="border border-border/40 bg-muted/5 hover:bg-muted/10 transition-colors duration-300 group cursor-pointer"
            >
              <CardContent className="p-8 flex flex-col h-full gap-5">
                <Badge variant="outline" className="w-fit text-[10px] tracking-widest uppercase">
                  {card.label}
                </Badge>
                <h3
                  className="text-2xl font-black leading-tight tracking-tight whitespace-pre-line"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                <Button
                  variant="ghost"
                  className="w-fit px-0 text-xs tracking-widest uppercase font-bold group-hover:translate-x-1 transition-transform duration-200"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  asChild
                >
                  <Link href={card.href}>
                    {card.cta} <ArrowRight size={12} className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full border-t border-border/30 px-6 lg:px-16 py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-xl">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground">
            The manifesto
          </span>
          <blockquote
            className="text-[clamp(1.4rem,3vw,2.2rem)] leading-snug italic font-normal"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            "Cockroaches don't survive because they're the strongest. They survive because they
            adapt faster than anything designed to kill them."
          </blockquote>
          <span className="text-xs text-muted-foreground font-mono">
            — The Cockroach Mode Doctrine
          </span>
        </div>
        <Button
          size="lg"
          className="shrink-0 text-sm tracking-widest uppercase font-black px-10 py-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
          asChild
        >
          <Link href="/studio">
            Start Surviving <ArrowRight size={14} className="ml-2" />
          </Link>
        </Button>
      </section>
      </main>
      <Footer />
    </div>
  );
}
