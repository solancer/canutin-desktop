import { css } from 'styled-components';

import {
  bluePlain,
  goldPlain,
  greenPlain,
  grey80,
  redPlain,
  shadowPlate,
  whitePlain,
} from '@app/constants/colors';

import { SummaryChipTypeEnum } from './constants';
import { monospaceRegular } from '@app/constants/fonts';

// Balance Backgrounds
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
  [SummaryChipTypeEnum.CASH]: cashBackground,
  [SummaryChipTypeEnum.DEBT]: debtBackground,
  [SummaryChipTypeEnum.INVESTMENTS]: investmentsBackground,
  [SummaryChipTypeEnum.OTHER_ASSETS]: otherAssetsBackground,
  [SummaryChipTypeEnum.NET_WORTH]: netWorthBackground,
};

export const container = css<{ balanceType: SummaryChipTypeEnum }>`
  align-items: center;
  box-shadow: ${shadowPlate};
  border-radius: 4px;
  color: ${whitePlain};
  display: flex;
  justify-content: space-between;
  letter-spacing: -0.02em;
  height: 14px;
  padding: 16px;

  ${({ balanceType }) => getBalanceTypeBackground[balanceType]}
`;

export const title = css`
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
