import { type FC } from 'react';
import { Link } from 'react-router-dom';

interface CoverScreenProps {}

export const CoverScreen: FC<CoverScreenProps> = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-brand-primary)' }}
    >
      <main className="flex max-w-[640px] flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-white md:text-4xl">
          Be Ready Before the Storm.
        </h1>
        <p
          className="mt-4 max-w-[480px] text-base text-white"
          style={{ opacity: 0.9 }}
        >
          Protect your home with confidence. Build a pro-grade emergency kit
          tailored to your family's needs.
        </p>
        <Link
          to="/builder"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-full px-8 py-4 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'var(--color-neutral-white)',
            color: 'var(--color-brand-primary)',
          }}
        >
          Build My Kit →
        </Link>
      </main>
    </div>
  );
};
