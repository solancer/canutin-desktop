import React from 'react';
import styled from 'styled-components';

import { BalanceGroupCardTypeEnum } from '@app/components/common/BalanceGroupCard/constants';
import { AccountAssetBalance } from '@app/components/BalanceSheet/BalancesByGroup';
import BalancesByTypeCard from '@app/components/BalanceSheet/BalanceByTypeCard';
import EmptyCard from '@app/components/common/EmptyCard';
import BalanceGroupCard from '@app/components/common/BalanceGroupCard';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface BalanceGroupListProps {
  type: BalanceGroupCardTypeEnum;
  balanceData?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
}

const getTotal = (balance: AccountAssetBalance[]) =>
  balance.reduce((acc, currentBalance) => acc + currentBalance.amount, 0);

const sortBalanceDataByTotalAmount = (balanceData: { [x: string]: AccountAssetBalance[] }) =>
  Object.entries(balanceData).sort(
    (balanceB, balanceA) => getTotal(balanceA[1]) - getTotal(balanceB[1])
  );

const BalanceGroupList = ({ type, balanceData }: BalanceGroupListProps) => {
  const totalAmount = balanceData
    ? Object.keys(balanceData).reduce((acc, assetTypeKey) => {
        const totalBalance = balanceData[assetTypeKey].reduce((acc, assetTypeBalance) => {
          return acc + assetTypeBalance.amount;
        }, 0);

        return acc + totalBalance;
      }, 0)
    : 0;

  return (
    <Container>
      <BalanceGroupCard type={type} amount={Math.round(totalAmount)} />
      {!balanceData ||
        (Object.keys(balanceData).length === 0 && (
          <EmptyCard message="No balances are available in this group." />
        ))}
      {balanceData &&
        sortBalanceDataByTotalAmount(balanceData).map(assetTypeName => (
          <BalancesByTypeCard
            key={assetTypeName[0]}
            assetTypeName={assetTypeName[0]}
            balanceData={assetTypeName[1]}
          />
        ))}
    </Container>
  );
};

export default BalanceGroupList;
