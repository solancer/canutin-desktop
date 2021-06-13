import React, { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';

import TheBigPicture from '@pages/TheBigPicture';
import BalanceSheet from '@pages/BalanceSheet';
import Budget from '@pages/Budget';
import Transactions from '@pages/Transactions';
import Trends from '@pages/Trends';
import AddAccountOrAsset from '@pages/AddAccountOrAsset';
import AddAccountAssetByHand from '@pages/AddAccountAssetByHand';
import AddAccountAssetByWizard from '@pages/AddAccountAssetByWizard';
import Settings from '@pages/Settings';

export const routesPaths = {
  index: '/index.html',
  bigpicture: '/bigpicture',
  balance: '/balance',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
  settings: '/settings',
  account: '/account',
  addAccountOrAsset: '/account/addAccountOrAsset',
  addAccountOrAssetByHand: '/account/addAccountOrAsset/byHand',
  addAccountOrAssetByWizard: '/account/addAccountOrAsset/byWizard',
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
];
