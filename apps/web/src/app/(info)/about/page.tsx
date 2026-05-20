import PageShell from '@/components/layout/page-shell';

export default function AboutPage() {
  return (
    <PageShell
      title="About Cockroach Club"
      description="Learn how the platform brings Clerk authentication, database registration, and a resilient front-end experience together."
    >
      <div className="space-y-6 rounded-3xl border border-border/30 bg-muted/50 p-8 text-muted-foreground">
        <p>
          Cockroach Club is designed to help you stay visible and verified. We connect Clerk user
          registration with a persistent database record so your account and credits remain
          synchronized.
        </p>
        <p>
          This site uses a clean, consistent interface with pages for login, signup, policy, and
          profile management — all styled to match the landing experience.
        </p>
      </div>
    </PageShell>
  );
}
