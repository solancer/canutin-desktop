import React from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';

import { AccountAssetBalance } from '@app/components/BalanceSheet/BalancesByGroup';

import {
  container,
  balanceTypeCardContainer,
  balanceTypeTitle,
  balanceTypeAmount,
  balanceItemContainer,
  balanceItemAmount,
  balanceName,
  balanceType,
} from './styles';

const Container = styled.div`
  ${container}
`;
const BalanceTypeCardContainer = styled.div`
  ${balanceTypeCardContainer}
`;
const BalanceItemContainer = styled.div`
  ${balanceItemContainer}
`;
const BalanceTypeTitle = styled.div`
  ${balanceTypeTitle}
`;
const BalanceTypeAmount = styled(NumberFormat)`
  ${balanceTypeAmount}
`;
const BalaceItemAmount = styled(NumberFormat)`
  ${balanceItemAmount}
`;
const BalanceName = styled.div`
  ${balanceName}
`;
const BalanceType = styled.div`
  ${balanceType}
`;

interface BalancesByTypeCardProps {
  assetTypeName: string;
  balanceData: AccountAssetBalance[];
}

interface BalanceItemProps {
  balance: AccountAssetBalance;
}

const BalanceTypeCard = ({ assetTypeName, balanceData }: BalancesByTypeCardProps) => {
  const balanceAmount = balanceData.reduce((acc, balance) => acc + balance.amount, 0);

  return (
    <BalanceTypeCardContainer>
      <BalanceTypeTitle>{assetTypeName}</BalanceTypeTitle>
      <BalanceTypeAmount
        thousandSeparator={true}
        displayType={'text'}
        prefix={'$'}
        value={balanceAmount}
      />
    </BalanceTypeCardContainer>
  );
};

const BalanceItem = ({ balance }: BalanceItemProps) => (
  <BalanceItemContainer>
    <div>
      <BalanceName>{balance.name}</BalanceName>
      <BalanceType>{balance.type}</BalanceType>
    </div>
    <BalaceItemAmount
      thousandSeparator={true}
      displayType={'text'}
      prefix={'$'}
      value={balance.amount}
    />
  </BalanceItemContainer>
);

const BalancesByTypeCard = ({ assetTypeName, balanceData }: BalancesByTypeCardProps) => (
  <Container>
    <BalanceTypeCard balanceData={balanceData} assetTypeName={assetTypeName} />
    {balanceData.map((balance, key) => (
      <BalanceItem balance={balance} key={key} />
    ))}
  </Container>
);

export default BalancesByTypeCard;
