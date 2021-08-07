import React, { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';

import TheBigPicture from '@pages/TheBigPicture';
import BalanceSheet from '@pages/BalanceSheet';
import Budget from '@pages/Budget';
import Transactions from '@pages/Transactions';
import AddTransactions from '@app/pages/AddTransaction';
import Trends from '@pages/Trends';
import AddAccountOrAsset from '@pages/AddAccountOrAsset';
import AddAccountAssetByHand from '@pages/AddAccountAssetByHand';
import AddAccountAssetByWizard from '@pages/AddAccountAssetByWizard';
import Setup from '@pages/Setup';
import Settings from '@pages/Settings';
import EditTransaction from '@app/pages/EditTransaction';

export const rootRoutesPaths = {
  bigpicture: '/bigpicture',
  balance: '/balance',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
  settings: '/settings',
  account: '/account',
  addAccountOrAsset: '/account/addAccountOrAsset',
};

export const routesPaths = {
  index: '/index.html',
  ...rootRoutesPaths,
  addAccountOrAssetByHand: '/account/addAccountOrAsset/byHand',
  addAccountOrAssetByWizard: '/account/addAccountOrAsset/byWizard',
  addTransaction: '/transactions/addTransaction',
  editTransaction: '/transactions/:categoryName/:accountName/Edit',
  canutinSetup: '/canutinSetup',
};

export interface RouteConfigProps {
  path: string;
  component: ReactNode;
  breadcrumb?: React.ComponentType | React.ElementType | string | null;
  exact?: boolean;
  subRoutes?: RouteConfigProps[];
}

export const routesConfig: RouteConfigProps[] = [
  {
    path: routesPaths.index,
    component: <Redirect to={routesPaths.bigpicture} />,
  },
  {
    path: routesPaths.bigpicture,
    exact: true,
    component: <TheBigPicture />,
    breadcrumb: 'The big picture',
  },
  {
    path: routesPaths.balance,
    exact: true,
    component: <BalanceSheet />,
    breadcrumb: 'Balance Sheet',
  },
  {
    path: routesPaths.budget,
    exact: true,
    component: <Budget />,
    breadcrumb: 'Budget',
  },
  {
    path: routesPaths.transactions,
    exact: true,
    component: <Transactions />,
    breadcrumb: 'Transactions',
  },
  {
    path: routesPaths.addTransaction,
    exact: true,
    component: <AddTransactions />,
    breadcrumb: 'Add new',
  },
  {
    path: routesPaths.editTransaction,
    exact: true,
    component: <EditTransaction />,
    breadcrumb: 'Edit',
  },
  {
    path: routesPaths.trends,
    exact: true,
    component: <Trends />,
    breadcrumb: 'Trends',
  },
  {
    path: routesPaths.settings,
    exact: true,
    component: <Settings />,
    breadcrumb: 'Settings',
  },
  {
    path: routesPaths.account,
    exact: true,
    component: <Redirect to={routesPaths.addAccountOrAsset} />,
    breadcrumb: 'Account',
  },
  {
    path: routesPaths.addAccountOrAsset,
    exact: true,
    component: <AddAccountOrAsset />,
    breadcrumb: 'Add new',
  },
  {
    path: routesPaths.addAccountOrAssetByHand,
    exact: true,
    component: <AddAccountAssetByHand />,
    breadcrumb: 'By hand',
  },
  {
    path: routesPaths.addAccountOrAssetByWizard,
    exact: true,
    component: <AddAccountAssetByWizard />,
    breadcrumb: 'Import wizard',
  },
  {
    path: routesPaths.canutinSetup,
    exact: true,
    component: <Setup />,
    breadcrumb: 'Canutin Setup',
  },
];
