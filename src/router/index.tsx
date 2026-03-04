import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoverScreen } from '../components/cover/CoverScreen';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from './guards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CoverScreen />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/builder',
        element: <SubkitSelectionScreen />,
      },
      {
        path: '/configure/custom',
        element: <CustomSubkitScreen />,
        loader: customConfigGuard,
      },
      {
        path: '/configure/:subkitId',
        element: <ItemConfigScreen />,
        loader: subkitConfigGuard,
      },
      {
        path: '/summary',
        element: <SummaryScreen />,
        loader: summaryGuard,
      },
      {
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
