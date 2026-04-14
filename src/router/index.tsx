import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoverScreen } from '../components/cover/CoverScreen';
import { MCQEmergencyTypeScreen } from '../components/mcq/MCQEmergencyTypeScreen';
import { MCQHouseholdScreen } from '../components/mcq/MCQHouseholdScreen';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { OrderConfirmationScreen } from '../components/confirmation/OrderConfirmationScreen';
import { ForkScreen } from '../components/fork/ForkScreen';
import { ReviewOrderScreen } from '../components/review/ReviewOrderScreen';
import { FillYourKitScreen } from '../components/fill/FillYourKitScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard, confirmationGuard, mcqHouseholdGuard, forkGuard, reviewGuard, fillGuard } from './guards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CoverScreen />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/build',
        element: <MCQEmergencyTypeScreen />,
      },
      {
        path: '/build/household',
        element: <MCQHouseholdScreen />,
        loader: mcqHouseholdGuard,
      },
      {
        path: '/choose',
        element: <ForkScreen />,
        loader: forkGuard,
      },
      {
        path: '/review',
        element: <ReviewOrderScreen />,
        loader: reviewGuard,
      },
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
        path: '/confirmation',
        element: <OrderConfirmationScreen />,
        loader: confirmationGuard,
      },
      {
        path: '/fill',
        element: <FillYourKitScreen />,
        loader: fillGuard,
      },
      {
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
