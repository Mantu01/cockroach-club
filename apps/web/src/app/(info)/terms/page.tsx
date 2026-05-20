import PageShell from '@/components/layout/page-shell';

export default function TermsPage() {
  return (
    <PageShell
      title="Terms & Conditions"
      description="Review the policies and obligations that govern your use of Cockroach Club."
    >
      <div className="space-y-6 rounded-3xl border border-border/30 bg-muted/50 p-8 text-muted-foreground">
        <p className="font-medium text-foreground">Acceptance of terms</p>
        <p>
          By using this site, you agree to the collection, storage, and processing of your
          information for authentication and user management.
        </p>
        <p className="font-medium text-foreground">Account responsibilities</p>
        <p>
          Your Clerk account must remain secure. You are responsible for keeping your credentials
          safe and reporting any unauthorized activity.
        </p>
      </div>
    </PageShell>
  );
}
