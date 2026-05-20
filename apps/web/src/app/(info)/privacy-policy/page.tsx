import PageShell from '@/components/layout/page-shell';

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description="A clear outline of how Cockroach Club handles your profile data, authentication metadata, and application usage details."
    >
      <div className="space-y-6 rounded-3xl border border-border/30 bg-muted/50 p-8 text-muted-foreground">
        <p className="font-medium text-foreground">Data collection</p>
        <p>
          We collect only the essential Clerk identity fields and database flags needed to support
          login, signup, and profile sync.
        </p>
        <p className="font-medium text-foreground">Usage</p>
        <p>
          Your email and Clerk account ID are used to create and sync a database record for
          persistent credits and profile state.
        </p>
      </div>
    </PageShell>
  );
}
