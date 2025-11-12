'use client';
import React, { useMemo } from 'react';
import { useDataContext } from '../providers/DataProvider';

export function FilterPanel() {
  const { data, filters, setFilters } = useDataContext();
  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const d of data || []) s.add(d.category ?? 'unknown');
    return Array.from(s);
  }, [data]);

  const onToggle = (cat: string, checked: boolean) => {
    const next = checked ? [...filters.categories, cat] : filters.categories.filter((c) => c !== cat);
    setFilters({ categories: next });
  };

  return (
    <div style={{ padding: 8, background: '#021226', borderRadius: 6 }}>
      <div style={{ marginBottom: 6, color: '#cfe8ff' }}>Filter by category</div>
      {categories.map((c) => {
        const checked = filters.categories.length === 0 || filters.categories.includes(c);
        return (
          <label key={c} style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#dbeafe', marginBottom: 6 }}>
            <input type="checkbox" checked={checked} onChange={(e) => onToggle(c, e.target.checked)} />
            <span>{c}</span>
          </label>
        );
      })}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => setFilters({ categories: [] })}
          style={{ padding: '6px 10px', background: '#0b1220', color: '#dbeafe', borderRadius: 6 }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}