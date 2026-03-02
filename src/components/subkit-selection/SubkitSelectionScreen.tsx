import { type FC } from 'react';

interface SubkitSelectionScreenProps {}

export const SubkitSelectionScreen: FC<SubkitSelectionScreenProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Select Your Subkits</h1>
      <p className="mt-2 text-neutral-600">Choose the subkits for your emergency prep kit.</p>
    </div>
  );
};
