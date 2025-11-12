import React from 'react';
import { generateInitialDataset } from '@/lib/dataGenerator';
import { DataProvider } from '@/components/providers/DataProvider';
import dynamic from 'next/dynamic';

// client components loaded dynamically to avoid SSR issues
const DashboardClient = dynamic(() => import('@/components/DashboardClient'), { ssr: false });

export default async function Page() {
  const initial = generateInitialDataset(Date.now(), 10000, 10);
  // pass initial to client DataProvider via prop
  return (
    <DataProvider initialData={initial}>
      <main>
        <h1 style={{ color: '#e6eef8' }}>Real-time Performance Dashboard</h1>
        {/* DashboardClient is a client-only composite that uses hooks */}
        <DashboardClient />
      </main>
    </DataProvider>
  );
}