import { type FC } from 'react';

interface CustomSubkitScreenProps {}

export const CustomSubkitScreen: FC<CustomSubkitScreenProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Custom Subkit</h1>
      <p className="mt-2 text-neutral-600">Add custom items to your kit.</p>
    </div>
  );
};
