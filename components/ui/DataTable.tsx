'use client';
import React from 'react';
import type { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

export function DataTable({ rows, rowHeight = 28, height = 300 }: { rows: DataPoint[]; rowHeight?: number; height?: number }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { start, end, offsetTop, visibleCount } = useVirtualization({
    containerRef,
    itemCount: rows.length,
    itemHeight: rowHeight,
    viewportHeight: height,
  });

  const visibleRows = rows.slice(start, end);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        overflow: 'auto',
        background: '#011827',
        borderRadius: 6,
        padding: 6,
      }}
    >
      <div style={{ height: rows.length * rowHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#dbeafe' }}>
            <thead style={{ position: 'sticky', top: 0 }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>timestamp</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>value</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>id</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.id} style={{ height: rowHeight }}>
                  <td style={{ padding: '4px 8px' }}>{new Date(r.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: '4px 8px' }}>{r.value.toFixed(2)}</td>
                  <td style={{ padding: '4px 8px', maxWidth: 280 }}>{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}