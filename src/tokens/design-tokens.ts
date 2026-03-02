export const colors = {
  brand: {
    primary: '#1F4D35',
    primaryHover: '#163828',
    primaryLight: '#E8F5EE',
    accent: '#22C55E',
  },
  neutral: {
    white: '#FFFFFF',
    50: '#F8F9FA',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    700: '#374151',
    900: '#111827',
  },
  status: {
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },
} as const;

export const motion = {
  duration: {
    instant: '0ms',
    fast: '130ms',
    default: '150ms',
    moderate: '200ms',
    standard: '220ms',
    screen: '240ms',
    reward: '360ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
