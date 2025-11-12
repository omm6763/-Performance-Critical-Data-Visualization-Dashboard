import React from 'react';
import '@/globals.css';

export const metadata = {
  title: 'Performance Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#071027', color: '#e6eef8', margin: 0 }}>
        <div style={{ padding: 12, maxWidth: 1400, margin: '0 auto' }}>{children}</div>
      </body>
    </html>
  );
}