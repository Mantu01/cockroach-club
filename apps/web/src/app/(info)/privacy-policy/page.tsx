import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full bg-background px-6 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#4a7c59]">
              Hidden Shelters
            </span>
            <h1
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-5xl lg:text-7xl font-black leading-none tracking-tighter"
            >
              PRIVACY POLICY
            </h1>
          </div>
          
          <div className="h-px bg-border/30 w-full" />

          <div className="flex flex-col gap-8 text-muted-foreground leading-relaxed text-sm">
            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">1. INFORMATION WE HIDE</h2>
              <p>
                We respect your autonomy. Profile details, experience logs, educational background, and custom LaTeX code compiled through our system are stored securely. We do not sell your data to the gatekeepers, corporate brokers, or algorithms.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">2. COMPILATION PRIVACY</h2>
              <p>
                When you compile your LaTeX resume, the text is transmitted to our backend and proxy service `latexonline.cc`. No personal markers are cached long-term on the compilation nodes. Only binary PDF streams are returned and piped to your client session.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold text-foreground">3. TRACKING INDEPENDENCE</h2>
              <p>
                We use minimal analytics to track usage metrics and platform health. We do not place invasive tracking scripts. Your search patterns remain your own.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
