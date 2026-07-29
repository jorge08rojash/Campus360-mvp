'use client';

import type { ReactNode } from 'react';
import { useAppShell } from './AppShellContext';
import BottomTabBar from './BottomTabBar';
import BottomSheetDetail from './BottomSheetDetail';
import NotifPanel from './NotifPanel';
import WrappedModal from './WrappedModal';
import StoryFlow from './StoryFlow';
import Confetti from './Confetti';

export default function AppChrome({ children }: { children: ReactNode }) {
  const { tema, confettiOn } = useAppShell();

  return (
    <div className="c360 relative mx-auto flex h-dvh max-w-[560px] flex-col overflow-hidden" data-theme={tema}>
      <div className="relative min-h-0 flex-1">{children}</div>
      <BottomTabBar />
      <BottomSheetDetail />
      <NotifPanel />
      <WrappedModal />
      <StoryFlow />
      <Confetti activo={confettiOn} />
    </div>
  );
}
