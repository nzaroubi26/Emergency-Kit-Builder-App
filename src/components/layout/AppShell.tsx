import { type FC, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { MobileInterstitial } from './MobileInterstitial';
import { CartSidebar } from '../cart/CartSidebar';
import { useIsMobile } from '../../hooks/useResponsive';
import { initAnnouncer } from '../../utils/announce';
import { injectGA4Script } from '../../utils/analytics';

export const AppShell: FC = () => {
  const isMobile = useIsMobile();
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isConfirmation = location.pathname === '/confirmation';

  const handleCartClose = () => {
    setCartOpen(false);
    cartButtonRef.current?.focus();
  };

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
      <AppHeader
        onCartToggle={() => setCartOpen((v) => !v)}
        cartOpen={cartOpen}
        cartButtonRef={cartButtonRef}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {isMobile ? <MobileInterstitial /> : <Outlet />}
      </main>
      {!isConfirmation && (
        <CartSidebar isOpen={cartOpen} onClose={handleCartClose} />
      )}
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
