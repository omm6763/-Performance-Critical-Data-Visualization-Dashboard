import { NextResponse } from 'next/server';
import { generateDataBatch, generateInitialDataset } from '../../../lib/dataGenerator';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode') || 'initial';
  const since = Number(url.searchParams.get('since') || '0');
  const count = Number(url.searchParams.get('count') || '100');

  if (mode === 'initial') {
    const initial = generateInitialDataset(Date.now(), 10000, 10);
    return NextResponse.json({ type: 'initial', data: initial });
  }

  // incremental: if since is 0, start from now
  const startTs = since > 0 ? since + 10 : Date.now();
  const batch = generateDataBatch(startTs, count, 10);
  return NextResponse.json({ type: 'update', data: batch });
}