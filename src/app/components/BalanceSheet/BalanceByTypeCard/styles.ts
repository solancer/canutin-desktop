import { css } from 'styled-components';

import {
  grey5,
  grey20,
  grey3,
  grey30,
  grey80,
  shadowPlate,
  whitePlain,
} from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

const borderRadius = '4px';

export const container = css`
  background-color: ${whitePlain};
  box-shadow: ${shadowPlate};
  border-radius: ${borderRadius};
  display: flex;
  flex-direction: column;
`;

export const balanceTypeCardContainer = css`
  align-items: center;
  border-bottom: 1px dashed ${grey20};
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export const balanceItemContainer = css`
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 8px;
  padding: 16px;
  border-bottom: 1px solid ${grey5};

  &:nth-child(even) {
    background-color: ${grey3};
  }

  &:last-of-type {
    border-bottom: none;
    border-radius: 0 0 ${borderRadius} ${borderRadius};
  }
`;

export const balanceTypeTitle = css`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-transform: capitalize;
`;

export const balanceTypeAmount = css`
  ${monospaceRegular}
  font-size: 14px;
  text-align: right;
  letter-spacing: -0.02em;
`;

export const balanceItemAmount = css`
  ${balanceTypeAmount}
  font-size: 12px;
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
