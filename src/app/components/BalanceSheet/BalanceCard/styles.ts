import { css } from 'styled-components';

import { grey20, grey3, grey30, grey80, shadowPlate, whitePlain } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const container = css`
  background-color: ${whitePlain};
  box-shadow: ${shadowPlate};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

export const balanceTitleContainer = css`
  align-items: center;
  border-bottom: 1px dashed ${grey20};
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export const balanceContainer = css<{ isGrey: boolean }>`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 11px;

  ${({ isGrey }) =>
    isGrey &&
    css`
      background-color: ${grey3};
    `}
`;

export const title = css`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const titleAmount = css`
  ${monospaceRegular}
  display: flex;
  font-size: 14px;
  justify-content: flex-end;
  letter-spacing: -0.02em;
`;

export const amount = css`
  ${titleAmount}
  align-self: flex-start;
  font-size: 13px;
`;

export const balanceInformation = css`
  display: flex;
  flex-direction: column;
`;

export const balanceName = css`
  color: ${grey80};
  font-size: 12px;
  flex: 1;
`;

export const balanceType = css`
  color: ${grey30};
  font-size: 11px;
`;
