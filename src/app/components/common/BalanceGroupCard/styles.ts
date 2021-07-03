import { css } from 'styled-components';

import {
  bluePlain,
  goldPlain,
  greenPlain,
  grey80,
  redPlain,
  whitePlain,
  shadowPlate,
} from '@app/constants/colors';

import { BalanceGroupCardTypeEnum } from './constants';
import { sansSerifBold, monospaceRegular } from '@app/constants/fonts';

export const container = css<{ balanceType: BalanceGroupCardTypeEnum }>`
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${shadowPlate};
  border-radius: 4px;
  color: ${whitePlain};
  padding: 16px;

  ${({ balanceType }) => getBalanceTypeBackground[balanceType]}
`;

export const title = css`
  ${sansSerifBold};
  font-size: 13px;
`;

export const amount = css`
  ${monospaceRegular}
  align-items: center;
  display: flex;
  font-size: 14px;
  letter-spacing: -0.02em;
  justify-content: flex-end;
`;

// Balance backgrounds
export const debtBackground = css`
  background-color: ${redPlain};
`;

export const cashBackground = css`
  background-color: ${greenPlain};
`;

export const investmentsBackground = css`
  background-color: ${bluePlain};
`;

export const otherAssetsBackground = css`
  background-color: ${goldPlain};
`;

export const netWorthBackground = css`
  background-color: ${grey80};
`;

const getBalanceTypeBackground = {
  [BalanceGroupCardTypeEnum.CASH]: cashBackground,
  [BalanceGroupCardTypeEnum.DEBT]: debtBackground,
  [BalanceGroupCardTypeEnum.INVESTMENTS]: investmentsBackground,
  [BalanceGroupCardTypeEnum.OTHER_ASSETS]: otherAssetsBackground,
  [BalanceGroupCardTypeEnum.NET_WORTH]: netWorthBackground,
};
