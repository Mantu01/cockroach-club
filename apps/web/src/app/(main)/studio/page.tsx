'use client';

import { FeatureCard } from '@/components/studio/feature-card';
import { StudioPageHeader } from '@/components/studio/studio-page-header';
import { STUDIO_FEATURES } from '@/lib/constants/navigation';
import { Badge } from '@/components/ui/badge';
import { UI_SIZES } from '@/lib/constants/theme';

export default function StudioPage() {
  return (
    <div className="flex flex-1 flex-col">
      <StudioPageHeader
        title="Studio"
        description="All survival tools in one place. Pick a feature and start crawling toward your next opportunity."
      />
      <div className="flex items-center gap-2 px-4 py-3 lg:px-6">
        <div className="size-1.5 rounded-full bg-foreground animate-pulse" />
        <span className={UI_SIZES.sectionLabel}>Cockroach Mode — Active</span>
        <Badge variant="outline" className={`ml-auto ${UI_SIZES.badge}`}>
          {STUDIO_FEATURES.length} Features
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
        {STUDIO_FEATURES.map((feature) => (
          <FeatureCard key={feature.label} {...feature} />
        ))}
      </div>
    </div>
  );
}
