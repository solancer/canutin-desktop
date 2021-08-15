import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import NumberFormat from '@components/common/NumberFormat';

import { AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';

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
const BalanceItemAmount = styled(NumberFormat)`
  ${balanceItemAmount}
`;
const BalanceName = styled(Link)`
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
      <BalanceTypeAmount displayType={'text'} value={Math.round(balanceAmount)} />
    </BalanceTypeCardContainer>
  );
};

const BalanceItem = ({ balance }: BalanceItemProps) => {
  const redirectPathName = balance.type === "Asset" ? `/asset/${balance.name}` : `/account/${balance.name}`

  return (
    <BalanceItemContainer>
      <div>
        <BalanceName to={{ pathname: redirectPathName, state: { balance } }}>
          {balance.name}
        </BalanceName>
        <BalanceType>{balance.type}</BalanceType>
      </div>
      <BalanceItemAmount displayType={'text'} value={Math.round(balance.amount)} />
    </BalanceItemContainer>
  );
};

const BalancesByTypeCard = ({ assetTypeName, balanceData }: BalancesByTypeCardProps) => (
  <Container>
    <BalanceTypeCard balanceData={balanceData} assetTypeName={assetTypeName} />
    {balanceData.map((balance, key) => (
      <BalanceItem balance={balance} key={`${key}-${balance.name}`} />
    ))}
  </Container>
);

export default BalancesByTypeCard;
