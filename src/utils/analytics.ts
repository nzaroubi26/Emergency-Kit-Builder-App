import { ENV } from '../tokens/env';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // silently swallow
  }
}

export const Analytics = {
  kitCompleted: (): void => {
    trackEvent('kit_completed');
  },

  subkitSelected: (subkitId: string, size: string): void => {
    trackEvent('subkit_selected', { subkit_id: subkitId, size });
  },

  itemIncluded: (subkitId: string, itemId: string): void => {
    trackEvent('item_included', { subkit_id: subkitId, item_id: itemId });
  },

  ctaClicked: (): void => {
    trackEvent('cta_clicked');
  },
} as const;

export function injectGA4Script(): void {
  try {
    const id = ENV.analyticsId;
    if (!id) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', id);
  } catch {
    // silently swallow
  }
}
