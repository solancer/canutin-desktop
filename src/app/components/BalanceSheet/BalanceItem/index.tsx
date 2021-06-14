import React from 'react';
import styled from 'styled-components';

import { SummaryChipTypeEnum } from '@components/common/SummaryChip/constants';
import { AccountAssetBalance } from '@components/BalanceSheet/BalanceList';
import BalanceCard from '@components/BalanceSheet/BalanceCard';
import EmptyBalanceCard from '@components/BalanceSheet/EmptyBalanceCard';
import SummaryChip from '@app/components/common/SummaryChip';

import { container, cardsContainer } from './styles';

const Container = styled.div`
  ${container}
`;

const CardsContainer = styled.div`
  ${cardsContainer}
`;

interface BalanceItemProps {
  type: SummaryChipTypeEnum;
  balanceData?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
}

const BalanceItem = ({ type, balanceData }: BalanceItemProps) => {
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
      <SummaryChip type={type} amount={totalAmount} />
      <CardsContainer>
        {!balanceData && <EmptyBalanceCard />}
        {balanceData &&
          Object.keys(balanceData).map(assetTypeName => (
            <BalanceCard assetTypeName={assetTypeName} balanceData={balanceData[assetTypeName]} />
          ))}
      </CardsContainer>
    </Container>
  );
};

export default BalanceItem;
