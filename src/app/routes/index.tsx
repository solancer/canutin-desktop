import React, { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';

import TheBigPicture from '@pages/TheBigPicture';
import BalanceSheet from '@pages/BalanceSheet';
import Budget from '@pages/Budget';
import Transactions from '@pages/Transactions';
import Trends from '@pages/Trends';
import AddAccountOrAsset from '@pages/AddAccountOrAsset';
import AddAccountAssetByHand from '@pages/AddAccountAssetByHand';

export const routesPaths = {
  index: '/index.html',
  bigpicture: '/bigpicture',
  balance: '/balance',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
  addAccountOrAsset: '/account/addAccountOrAsset',
  addAccountOrAssetByHand: '/account/addAccountOrAsset/byHand',
};

export interface RouteConfigProps {
  path: string | string[];
  component: ReactNode;
  exact?: boolean;
  subRoutes?: RouteConfigProps[];
}

export const routesConfig: RouteConfigProps[] = [
  {
    path: [routesPaths.index],
    exact: true,
    component: <Redirect to={routesPaths.bigpicture} />,
  },
  {
    path: [routesPaths.bigpicture],
    exact: true,
    component: <TheBigPicture />,
  },
  {
    path: [routesPaths.balance],
    exact: true,
    component: <BalanceSheet />,
  },
  {
    path: [routesPaths.budget],
    exact: true,
    component: <Budget />,
  },
  {
    path: [routesPaths.transactions],
    exact: true,
    component: <Transactions />,
  },
  {
    path: [routesPaths.trends],
    exact: true,
    component: <Trends />,
  },
  {
    path: [routesPaths.addAccountOrAsset],
    exact: true,
    component: <AddAccountOrAsset />,
  },
  {
    path: [routesPaths.addAccountOrAssetByHand],
    exact: true,
    component: <AddAccountAssetByHand />,
  },
];
