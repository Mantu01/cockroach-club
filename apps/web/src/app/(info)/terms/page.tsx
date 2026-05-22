import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full bg-background px-6 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#c4922a]">
              Durable Boundaries
            </span>
            <h1
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-5xl lg:text-7xl font-black leading-none tracking-tighter"
            >
              TERMS & CONDITIONS
            </h1>
          </div>
          
          <div className="h-px bg-border/30 w-full" />

          <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed text-sm">
            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">1. THE DOCTRINE OF RESILIENCE</h2>
              <p>
                By accessing Cockroach Club, you agree to survive. Our tools, templates, and interview prep guides are designed to empower applicants. You acknowledge that gatekeepers will attempt to squash your progress, and you agree to scuttle around them.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">2. CREDITS & COMPILATION</h2>
              <p>
                LaTeX compilation and AI generations utilize external services. Free credits are distributed under the Survivor Tier and are renewed periodically. Abuse of compilation pipelines or attempts to bypass request limits will lead to membership termination.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">3. NO WARRANTY</h2>
              <p>
                We do not guarantee employment, nor do we guarantee that resume compilers will accept every custom LaTeX tweak you input. The system is provided as-is — resilient, unpolished, and ready for you to adapt.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
