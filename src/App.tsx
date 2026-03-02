import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

interface AppProps {}

export const App: FC<AppProps> = () => {
  return <RouterProvider router={router} />;
};
