import { type FC } from 'react';

interface MobileInterstitialProps {}

export const MobileInterstitial: FC<MobileInterstitialProps> = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-[var(--radius-lg)] bg-[var(--color-brand-primary-light)] p-8">
        <h2 className="text-xl font-bold text-[var(--color-neutral-900)]">
          Desktop Experience Required
        </h2>
        <p className="mt-3 text-[var(--color-neutral-700)]">
          The Emergency Prep Kit Builder is optimized for desktop and tablet screens.
          Please visit this page on a device with a screen width of at least 768px for
          the best experience.
        </p>
      </div>
    </div>
  );
};
