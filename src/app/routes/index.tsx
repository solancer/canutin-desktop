import React, { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';

import TheBigPicture from '@pages/TheBigPicture';
import BalanceSheet from '@pages/BalanceSheet';
import Budget from '@pages/Budget';
import Transactions from '@pages/Transactions';
import AddTransactions from '@app/pages/AddTransaction';
import Trends from '@pages/Trends';
import AddOrUpdateData from '@app/pages/AddOrUpdateData';
import AddAccountAssetByHand from '@pages/AddAccountAssetByHand';
import AddAccountAssetByWizard from '@pages/AddAccountAssetByWizard';
import Setup from '@pages/Setup';
import Settings from '@pages/Settings';
import EditTransaction from '@app/pages/EditTransaction';
import AccountOverview from '@app/pages/AccountOverview';
import AssetOverview from '@app/pages/AssetOverview';
import EditBudget from '@app/pages/EditBudget';

export const rootRoutesPaths = {
  bigpicture: '/bigpicture',
  balance: '/balance',
  account: '/account',
  asset: '/asset',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
  settings: '/settings',
  addOrUpdateData: '/addOrUpdateData',
};

export const routesPaths = {
  index: '/index.html',
  ...rootRoutesPaths,
  addOrUpdateDataByHand: '/addOrUpdateData/byHand',
  addOrUpdateDataByWizard: '/addOrUpdateData/byWizard',
  accountOverview: '/account/:accountName',
  assetOverview: '/asset/:assetName',
  addTransaction: '/transactions/addTransaction',
  editTransaction: '/transactions/:transactionDescription',
  canutinSetup: '/canutinSetup',
  editBudget: '/budget/edit',
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
    path: routesPaths.editBudget,
    exact: true,
    component: <EditBudget />,
    breadcrumb: 'Edit budget',
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
    component: <Redirect to={routesPaths.balance} />,
    breadcrumb: 'Account',
  },
  {
    path: routesPaths.asset,
    exact: true,
    component: <Redirect to={routesPaths.balance} />,
    breadcrumb: 'Asset',
  },
  {
    path: routesPaths.addOrUpdateData,
    exact: true,
    component: <AddOrUpdateData />,
    breadcrumb: 'Add or update data',
  },
  {
    path: routesPaths.addOrUpdateDataByHand,
    exact: true,
    component: <AddAccountAssetByHand />,
    breadcrumb: 'By hand',
  },
  {
    path: routesPaths.addOrUpdateDataByWizard,
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
  {
    path: routesPaths.accountOverview,
    exact: true,
    component: <AccountOverview />,
  },
  {
    path: routesPaths.assetOverview,
    exact: true,
    component: <AssetOverview />,
  },
];
