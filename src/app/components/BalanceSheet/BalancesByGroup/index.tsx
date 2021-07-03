import React from 'react';
import styled from 'styled-components';

import BalanceGroupList from '@app/components/BalanceSheet/BalanceGroupList';
import { BalanceGroupCardTypeEnum } from '@app/components/common/BalanceGroupCard/constants';

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
      type={BalanceGroupCardTypeEnum.CASH}
      balanceData={balancesByGroupData[BalanceGroupEnum.CASH]}
    />
    <BalanceGroupList
      type={BalanceGroupCardTypeEnum.DEBT}
      balanceData={balancesByGroupData[BalanceGroupEnum.DEBT]}
    />
    <BalanceGroupList
      type={BalanceGroupCardTypeEnum.INVESTMENTS}
      balanceData={balancesByGroupData[BalanceGroupEnum.INVESTMENT]}
    />
    <BalanceGroupList
      type={BalanceGroupCardTypeEnum.OTHER_ASSETS}
      balanceData={balancesByGroupData[BalanceGroupEnum.OTHER_ASSETS]}
    />
  </Container>
);

export default BalancesByGroup;
