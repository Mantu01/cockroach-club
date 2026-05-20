'use client';

import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { CreditCard } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function BillingContent() {
  const { fetchBilling } = useStudioData();
  const billing = useAppSelector((s) => s.studio.billing);
  const loading = useAppSelector((s) => s.studio.loading.billing);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchBilling();
  }, [fetchBilling]);

  if (loading && !billing) return <StudioLoader rows={4} />;

  return (
    <div className="min-h-[calc(100vh-220px)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <h1 className={UI_SIZES.pageTitle} style={{ fontFamily: "'Syne', sans-serif" }}>
            Billing
          </h1>
          <p className={UI_SIZES.pageSubtitle}>Manage your plan, credits, and payment history.</p>
        </div>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Current Plan</span>
            <Badge variant="outline" className={UI_SIZES.badge}>
              <CreditCard className="size-3 mr-1" />
              {billing?.plan ?? 'Survivor'}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4 pb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits remaining</span>
              <span
                className="font-black tabular-nums"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {billing?.credits ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Renewal date</span>
              <span>
                {billing?.renewalDate ? new Date(billing.renewalDate).toLocaleDateString() : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Invoice History</span>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">Date</TableHead>
                  <TableHead className="text-[10px]">Description</TableHead>
                  <TableHead className="text-[10px]">Amount</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing?.invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs">
                      {new Date(inv.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {inv.description}
                    </TableCell>
                    <TableCell className="text-xs">${inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] capitalize">
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return <BillingContent />;
}
