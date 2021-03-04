import React, { ReactNode } from 'react';

import TheBigPicture from 'pages/TheBigPicture';
import BalanceSheet from 'pages/BalanceSheet';
import Budget from 'pages/Budget';
import Transactions from 'pages/Transactions';
import Trends from 'pages/Trends';

export const routesPaths = {
  index: '/',
  bigpicture: '/bigpicture',
  balance: '/balance',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
};

export interface RouteConfigProps {
  path: string | string[],
  component: ReactNode,
  exact?: boolean,
}

export const routeConfigs: RouteConfigProps[] = [
  {
    path: [routesPaths.index, routesPaths.bigpicture],
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
];