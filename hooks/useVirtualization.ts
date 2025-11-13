import { useState, RefObject } from 'react';

const ITEM_HEIGHT = 30; // Fixed height for each row
const OVERSCAN = 5; // Render a few extra items above/below viewport

export function useVirtualization(
  containerRef: RefObject<HTMLDivElement>,
  itemCount: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const containerHeight = containerRef.current?.clientHeight || 0;

  // Calculate visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN
  );

  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      style: {
        position: 'absolute' as const,
        top: `${i * ITEM_HEIGHT}px`,
        left: 0,
        right: 0,
        height: `${ITEM_HEIGHT}px`,
      },
    });
  }

  return {
    handleScroll,
    virtualItems,
    totalHeight: itemCount * ITEM_HEIGHT,
  };
}