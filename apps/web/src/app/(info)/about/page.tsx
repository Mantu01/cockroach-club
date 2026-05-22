import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full bg-background px-6 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#b5451b]">
              Manifesto & Origin
            </span>
            <h1
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-5xl lg:text-7xl font-black leading-none tracking-tighter"
            >
              ABOUT THE CLUB
            </h1>
          </div>
          
          <div className="h-px bg-border/30 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed text-sm">
            <p className="italic font-serif text-lg text-foreground">
              "We didn't build Cockroach Club to fit in. We built it because we were tired of being screened out by algorithms designed to favor the privileged."
            </p>
            <p>
              In a job market run by automated tracking systems and corrupt standards, ordinary job seekers are treated as disposable pests. Cockroach Club is our collective pushback. We design resilient tools to help you crawl into spaces they tried to lock you out of.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="border border-border/40 p-6 bg-muted/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#b5451b]">PHASE 01</span>
              <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black tracking-tight">SQUASHED</h3>
              <p className="text-xs text-muted-foreground">Recognizing that the gatekeepers want you ignored and disposable.</p>
            </div>
            <div className="border border-border/40 p-6 bg-muted/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#c4922a]">PHASE 02</span>
              <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black tracking-tight">STOMPED</h3>
              <p className="text-xs text-muted-foreground">Standing before biased interview panels and smiling through rejection.</p>
            </div>
            <div className="border border-border/40 p-6 bg-muted/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#4a7c59]">PHASE 03</span>
              <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black tracking-tight">SCUTTLED</h3>
              <p className="text-xs text-muted-foreground">Adapting, navigating around barriers, and surviving in hidden cracks.</p>
            </div>
            <div className="border border-border/40 p-6 bg-muted/5 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#1a6b8a]">PHASE 04</span>
              <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-black tracking-tight">SURVIVED</h3>
              <p className="text-xs text-muted-foreground">Standing tall despite a broken system, resilient and uncrushable.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
