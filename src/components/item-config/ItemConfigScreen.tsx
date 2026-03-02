import { type FC } from 'react';

interface ItemConfigScreenProps {}

export const ItemConfigScreen: FC<ItemConfigScreenProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Configure Items</h1>
      <p className="mt-2 text-neutral-600">Configure the items in your selected subkit.</p>
    </div>
  );
};
