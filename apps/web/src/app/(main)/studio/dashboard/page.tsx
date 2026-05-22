'use client';

import { useEffect, useRef } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatCard } from '@/components/studio/stat-card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react';

const chartConfig = {
  searches: { label: 'Searches', color: '#b5451b' },
  applications: { label: 'Applications', color: '#4a7c59' },
} satisfies ChartConfig;

export default function DashboardPage() {
  const { fetchDashboard } = useStudioData();
  const dashboard = useAppSelector((s) => s.studio.dashboard);
  const loading = useAppSelector((s) => s.studio.loading.dashboard);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) return <StudioLoader rows={6} />;

  const stats = dashboard?.stats;
  const predictions = dashboard?.predictions ?? [];
  const activity = dashboard?.activity ?? [];
  const chartData = dashboard?.chartData ?? [];

  const TrendIcon = (trend: string) =>
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Dashboard"
        description="Your survival metrics — searches, applications, prep progress, and AI predictions."
      />
      <div className="grid grid-cols-2 gap-3 px-4 py-4 lg:grid-cols-4 lg:px-6">
        <StatCard
          label="Scraped Jobs"
          value={stats?.totalJobsScraped ?? 0}
          trend="up"
          change="Live"
          hint="Available in database"
        />
        <StatCard
          label="Applied"
          value={stats?.byStatus?.applied ?? 0}
          trend="up"
          change="Active"
          hint="Tracked applications"
        />
        <StatCard
          label="Under Review"
          value={stats?.byStatus?.saved ?? 0}
          trend="stable"
          change="Saved"
          hint="Marked for review"
        />
        <StatCard
          label="Rejected"
          value={stats?.byStatus?.rejected ?? 0}
          trend="down"
          change="Archived"
          hint="Discarded opportunities"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-3 lg:px-6">
        <Card className="border border-border/40 bg-muted/5 lg:col-span-2">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Activity — Last 7 Days</span>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ChartContainer config={chartConfig} className="aspect-auto h-45 w-full">
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                  className="text-[10px]"
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="searches"
                  type="natural"
                  fill="var(--color-searches)"
                  fillOpacity={0.2}
                  stroke="var(--color-searches)"
                  stackId="a"
                />
                <Area
                  dataKey="applications"
                  type="natural"
                  fill="var(--color-applications)"
                  fillOpacity={0.2}
                  stroke="var(--color-applications)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>AI Predictions</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            {predictions.map((pred) => {
              const Icon = TrendIcon(pred.trend);
              return (
                <div
                  key={pred.label}
                  className="flex items-center justify-between gap-2 border-b border-border/20 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-xs text-muted-foreground">{pred.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-black tabular-nums"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {pred.value}%
                    </span>
                    <Icon className="size-3 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 py-4 lg:px-6">
        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Recent Activity</span>
            <Badge variant="outline" className={UI_SIZES.badge}>
              {activity.length} items
            </Badge>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">Role</TableHead>
                  <TableHead className="text-[10px]">Company</TableHead>
                  <TableHead className="text-[10px]">Status</TableHead>
                  <TableHead className="text-[10px] hidden sm:table-cell">Query</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-xs font-medium">{item.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      {item.searchQuery}
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
