import type { ReactNode } from 'react';
import { AppShellProvider } from '@/components/mobile/AppShellContext';
import AppChrome from '@/components/mobile/AppChrome';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShellProvider>
      <AppChrome>{children}</AppChrome>
    </AppShellProvider>
  );
}
