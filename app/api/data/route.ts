

import { NextResponse } from 'next/server';
import { generateDataPoint } from '@/lib/dataGenerator';

export const dynamic = 'force-dynamic'; // Ensure this runs dynamically

export async function GET() {
  // Generate a batch of 100 historical points
  const data = Array.from({ length: 100 }, () => generateDataPoint());
  
  return NextResponse.json(data);
}