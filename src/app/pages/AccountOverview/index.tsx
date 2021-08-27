import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Account, Transaction } from '@database/entities';
import { getAccountInformationLabel } from '@app/utils/account.utils';
import { getSelectedTransactions } from '@app/utils/balance.utils';
import useGlobalFilterTable from '@app/hooks/useGlobalFilterTable';

import ScrollView from '@components/common/ScrollView';
import AccountOverviewHeader from '@components/Account/AccountOverviewHeader';
import AccountOverviewInformation from '@components/Account/AccountOverviewInformation';
import AccountOverviewEdit from '@components/Account/AccountOverviewEdit';

const AccountOverview = () => {
  const {
    state: { balance: account },
  } = useLocation<{ balance: Account }>();
  const { selectedFilterOption, setSelectedFilterOption } = useGlobalFilterTable();
  const editAccount = useMemo(() => <AccountOverviewEdit temporalAccount={account} />, []);

  const [accountOverviewSections, setAccountOverviewSections] = useState([
    {
      label: 'Overview',
      component: (
        <AccountOverviewInformation
          transactions={getSelectedTransactions(
            account.transactions as Transaction[],
            selectedFilterOption.value.dateFrom,
            selectedFilterOption.value.dateTo
          )}
          account={account}
        />
      ),
    },
    {
      label: 'Edit',
      component: editAccount,
    },
  ]);

  useEffect(() => {
    setAccountOverviewSections([
      {
        label: 'Overview',
        component: (
          <AccountOverviewInformation
            transactions={getSelectedTransactions(
              account.transactions as Transaction[],
              selectedFilterOption.value.dateFrom,
              selectedFilterOption.value.dateTo
            )}
            account={account}
          />
        ),
      },
      {
        label: 'Edit',
        component: editAccount,
      },
    ]);
  }, [selectedFilterOption.label]);

  return (
    <>
      <ScrollView
        title={account.name}
        subTitle={getAccountInformationLabel(account)}
        headerNav={
          <AccountOverviewHeader filterOption={selectedFilterOption} setFilterOption={setSelectedFilterOption} />
        }
        sections={accountOverviewSections}
      />
    </>
  );
};

export default AccountOverview;
