import { type FC } from 'react';
import { Outlet } from 'react-router-dom';

interface AppShellProps {}

export const AppShell: FC<AppShellProps> = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 px-4 py-3">
        <h1 className="text-lg font-semibold">Emergency Prep Kit Builder</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
