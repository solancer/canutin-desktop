import React from 'react';
import styled from 'styled-components';

import {
  BalanceGroupEnum,
  balanceGroupLabels,
  balanceGroupApperances,
} from '@enums/balanceGroup.enum';
import { AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';
import BalancesByTypeCard from '@components/BalanceSheet/BalanceByTypeCard';
import EmptyCard from '@components/common/EmptyCard';
import Card from '@components/common/Card';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface BalanceGroupListProps {
  type: BalanceGroupEnum;
  balanceData?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
  dataTestId?: string;
}

const getTotal = (balance: AccountAssetBalance[]) =>
  balance.reduce((acc, currentBalance) => acc + currentBalance.amount, 0);

const sortBalanceDataByTotalAmount = (balanceData: { [x: string]: AccountAssetBalance[] }) =>
  Object.entries(balanceData).sort(
    (balanceB, balanceA) => getTotal(balanceA[1]) - getTotal(balanceB[1])
  );

const BalanceGroupList = ({ type, balanceData, dataTestId }: BalanceGroupListProps) => {
  const totalAmount = balanceData
    ? Object.keys(balanceData).reduce((acc, assetTypeKey) => {
        const totalBalance = balanceData[assetTypeKey].reduce((acc, assetTypeBalance) => {
          return acc + assetTypeBalance.amount;
        }, 0);

        return acc + totalBalance;
      }, 0)
    : 0;

  return (
    <Container data-testid={dataTestId}>
      <Card
        label={balanceGroupLabels[type]}
        appearance={balanceGroupApperances[type]}
        value={Math.round(totalAmount)}
        isCurrency={true}
      />
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
