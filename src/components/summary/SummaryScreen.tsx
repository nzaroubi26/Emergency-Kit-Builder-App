import { type FC } from 'react';

interface SummaryScreenProps {}

export const SummaryScreen: FC<SummaryScreenProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Kit Summary</h1>
      <p className="mt-2 text-neutral-600">Review your emergency prep kit.</p>
    </div>
  );
};
