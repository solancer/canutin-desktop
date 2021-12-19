import React from 'react';
import styled from 'styled-components';

import BalanceGroupList from '@components/BalanceSheet/BalanceGroupList';

import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export type AccountAssetBalance = {
  name: string;
  type: string;
  amount: number;
};

export type BalanceData = {
  [value in BalanceGroupEnum]?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
};

export interface BalancesByGroupProps {
  balancesByGroupData: BalanceData;
}

const BalancesByGroup = ({ balancesByGroupData }: BalancesByGroupProps) => (
  <Container>
    <BalanceGroupList
      type={BalanceGroupEnum.CASH}
      balanceData={balancesByGroupData[BalanceGroupEnum.CASH]}
      dataTestId="balance-group-cash"
    />
    <BalanceGroupList
      type={BalanceGroupEnum.DEBT}
      balanceData={balancesByGroupData[BalanceGroupEnum.DEBT]}
      dataTestId="balance-group-debt"
    />
    <BalanceGroupList
      type={BalanceGroupEnum.INVESTMENTS}
      balanceData={balancesByGroupData[BalanceGroupEnum.INVESTMENTS]}
      dataTestId="balance-group-investments"
    />
    <BalanceGroupList
      type={BalanceGroupEnum.OTHER_ASSETS}
      balanceData={balancesByGroupData[BalanceGroupEnum.OTHER_ASSETS]}
      dataTestId="balance-group-other-assets"
    />
  </Container>
);

export default BalancesByGroup;
