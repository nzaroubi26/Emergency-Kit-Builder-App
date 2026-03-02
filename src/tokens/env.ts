export const ENV = {
  purchaseUrl: import.meta.env['VITE_PURCHASE_URL'] as string ?? '#',
} as const;
