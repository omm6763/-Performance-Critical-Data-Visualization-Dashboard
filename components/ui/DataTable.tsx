'use client';

import { useRef } from 'react';
import { useData } from '../providers/DataProvider';
import { useVirtualization } from '@/hooks/useVirtualization';

export default function DataTable() {
  const { data } = useData();
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleScroll, virtualItems, totalHeight } = useVirtualization(
    containerRef,
    data.length
  );

  return (
    <div className="data-table-container" ref={containerRef} onScroll={handleScroll}>
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {virtualItems.map(item => {
          const point = data[item.index];
          return (
            <div key={item.index} className="data-table-row" style={item.style}>
              <span>{new Date(point.timestamp).toLocaleTimeString()}</span>
              <span>{point.value.toFixed(4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}