export const ENV = {
  purchaseUrl: import.meta.env['VITE_PURCHASE_URL'] as string ?? '#',
  analyticsId: import.meta.env['VITE_ANALYTICS_ID'] as string | undefined,
} as const;
