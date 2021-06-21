import React from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';

import { AccountAssetBalance } from '@components/BalanceSheet/BalanceList';

import {
  container,
  balanceContainer,
  balanceTitleContainer,
  title,
  titleAmount,
  amount,
  balanceInformation,
  balanceName,
  balanceType,
} from './styles';

const Container = styled.div`
  ${container}
`;

const BalanceContainer = styled.div<{ isGrey: boolean }>`
  ${balanceContainer}
`;

const BalanceTitleContainer = styled.div`
  ${balanceTitleContainer}
`;

const Title = styled.div`
  ${title}
`;

const TitleAmount = styled(NumberFormat)`
  ${titleAmount}
`;

const Amount = styled(NumberFormat)`
  ${amount}
`;

const BalanceInformation = styled.div`
  ${balanceInformation}
`;

const BalanceName = styled.div`
  ${balanceName}
`;

const BalanceType = styled.div`
  ${balanceType}
`;

interface BalanceCardProps {
  assetTypeName: string;
  balanceData: AccountAssetBalance[];
}

interface BalanceItemProps {
  balance: AccountAssetBalance;
  isGrey: boolean;
}

const BalanceTitle = ({ assetTypeName, balanceData }: BalanceCardProps) => {
  const balanceAmount = balanceData.reduce((acc, balance) => acc + balance.amount, 0);

  return (
    <BalanceTitleContainer>
      <Title>{assetTypeName}</Title>
      <TitleAmount
        thousandSeparator={true}
        displayType={'text'}
        prefix={'$'}
        value={balanceAmount}
      />
    </BalanceTitleContainer>
  );
};

const BalanceItem = ({ balance, isGrey }: BalanceItemProps) => (
  <BalanceContainer isGrey={isGrey}>
    <BalanceInformation>
      <BalanceName>{balance.name}</BalanceName>
      <BalanceType>{balance.type}</BalanceType>
    </BalanceInformation>
    <Amount thousandSeparator={true} displayType={'text'} prefix={'$'} value={balance.amount} />
  </BalanceContainer>
);

const BalanceCard = ({ assetTypeName, balanceData }: BalanceCardProps) => (
  <Container>
    <BalanceTitle balanceData={balanceData} assetTypeName={assetTypeName} />
    {balanceData.map((balance, key) => (
      <BalanceItem balance={balance} isGrey={!Boolean(key % 2)} key={key} />
    ))}
  </Container>
);

export default BalanceCard;
