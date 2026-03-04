import { type FC, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { MobileInterstitial } from './MobileInterstitial';
import { useIsMobile } from '../../hooks/useResponsive';
import { initAnnouncer } from '../../utils/announce';
import { injectGA4Script } from '../../utils/analytics';

interface AppShellProps {}

export const AppShell: FC<AppShellProps> = () => {
  const isMobile = useIsMobile();
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGA4Script();
  }, []);

  useEffect(() => {
    if (politeRef.current && assertiveRef.current) {
      initAnnouncer(politeRef.current, assertiveRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {isMobile ? <MobileInterstitial /> : <Outlet />}
      </main>
      <div
        ref={politeRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        ref={assertiveRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};
