'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/layout/theme-toggler';
import { StudioLoader } from '@/components/studio/studio-loader';
import { useStudioData } from '@/context/studio-data-context';
import { useAppSelector } from '@/store/hooks';
import { UI_SIZES } from '@/lib/constants/theme';
import { ROUTES } from '@/lib/constants/app';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import type { UserSettings } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex flex-col gap-0.5">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-[10px] text-muted-foreground">{description}</span>
      </div>
      <Button
        variant={checked ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-[10px] min-w-16"
        onClick={() => onChange(!checked)}
      >
        {checked ? 'On' : 'Off'}
      </Button>
    </div>
  );
}

function SettingsContent() {
  const { fetchSettings, updateSettings } = useStudioData();
  const settings = useAppSelector((s) => s.studio.settings);
  const loading = useAppSelector((s) => s.studio.loading.settings);
  const { setTheme } = useTheme();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchSettings();
  }, [fetchSettings]);

  const handleUpdate = async (partial: Partial<UserSettings>) => {
    if (!settings) return;
    try {
      const updated = { ...settings, ...partial };
      await updateSettings(updated);
      if (partial.theme) setTheme(partial.theme);
      toast.success('Settings updated');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  if (loading && !settings) return <StudioLoader rows={6} />;

  return (
    <div className="min-h-[calc(100vh-220px)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className={UI_SIZES.pageTitle} style={{ fontFamily: "'Syne', sans-serif" }}>
            Settings
          </h1>
          <p className={UI_SIZES.pageSubtitle}>
            Customize your experience, notifications, and privacy preferences.
          </p>
        </div>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Appearance</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs font-medium">Theme</Label>
                <span className="text-[10px] text-muted-foreground">
                  Switch between light, dark, and system
                </span>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <Button
                  key={t}
                  variant={settings?.theme === t ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-[10px] capitalize"
                  onClick={() => handleUpdate({ theme: t })}
                >
                  {t}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Notifications</span>
          </CardHeader>
          <CardContent className="flex flex-col px-4 pb-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive updates about your applications"
              checked={settings?.emailNotifications ?? true}
              onChange={(v) => handleUpdate({ emailNotifications: v })}
            />
            <Separator />
            <SettingToggle
              label="Job Alerts"
              description="Get notified when new matching jobs are found"
              checked={settings?.jobAlerts ?? true}
              onChange={(v) => handleUpdate({ jobAlerts: v })}
            />
            <Separator />
            <SettingToggle
              label="Weekly Digest"
              description="Summary of your job search activity"
              checked={settings?.weeklyDigest ?? false}
              onChange={(v) => handleUpdate({ weeklyDigest: v })}
            />
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Privacy & Automation</span>
          </CardHeader>
          <CardContent className="flex flex-col px-4 pb-4">
            <SettingToggle
              label="Profile Visibility"
              description="Allow recruiters to discover your profile"
              checked={settings?.profileVisibility ?? true}
              onChange={(v) => handleUpdate({ profileVisibility: v })}
            />
            <Separator />
            <SettingToggle
              label="Auto Apply"
              description="Automatically apply to high-match jobs"
              checked={settings?.autoApply ?? false}
              onChange={(v) => handleUpdate({ autoApply: v })}
            />
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-muted/5">
          <CardHeader className="px-4 py-3">
            <span className={UI_SIZES.sectionLabel}>Account Links</span>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 px-4 pb-4">
            <Button variant="outline" size="sm" className="h-7 text-[10px]" asChild>
              <Link href={ROUTES.account}>Account</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[10px]" asChild>
              <Link href={ROUTES.billing}>Billing</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[10px]" asChild>
              <Link href={ROUTES.notifications}>Notifications</Link>
            </Button>
            <Badge variant="outline" className={UI_SIZES.badge}>
              Survivor Plan
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}


