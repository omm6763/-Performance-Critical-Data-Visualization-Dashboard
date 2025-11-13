import { DataProvider } from "@/components/providers/DataProvider";
import DashboardClient from "@/components/DashboardClient";
import { Suspense } from "react";

export default function DashboardPage() {

  
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DataProvider>
        <DashboardClient />
      </DataProvider>
    </Suspense>
  );
}