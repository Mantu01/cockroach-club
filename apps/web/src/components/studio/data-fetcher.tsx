'use client';

import { use } from 'react';

interface DataFetcherProps {
  fetchPromise: Promise<void>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function DataFetcher({ fetchPromise, children, fallback }: DataFetcherProps) {
  use(fetchPromise);
  return <>{children}</>;
}

export function ClientDataGate({
  promise,
  fallback,
  children,
}: {
  promise: Promise<void>;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DataFetcher fetchPromise={promise} fallback={fallback}>
      {children}
    </DataFetcher>
  );
}
