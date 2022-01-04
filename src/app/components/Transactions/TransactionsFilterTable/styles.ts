import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import {
  greenPlain,
  grey3,
  grey10,
  grey30,
  grey80,
  grey90,
  shadowPlate,
  bluePlain,
} from '@app/constants/colors';

export const container = css`
  background-color: ${grey3};
  border-radius: 4px;
  box-shadow: ${shadowPlate};
  display: flex;
  flex-direction: column;
`;

export const filterContainer = css`
  display: grid;
  grid-gap: 8px;
  padding: 16px;
`;

export const amountCell = css<{ value: number; excludeFromTotals: boolean }>`
  ${monospaceRegular}

  color: ${grey90};
  font-size: 11px;
  letter-spacing: 0.05em;

  ${({ value }) =>
    value > 0 &&
    css`
      color: ${greenPlain};
    `}

  ${({ excludeFromTotals }) =>
    excludeFromTotals &&
    css`
      color: ${grey30};
      border-bottom: 1px dashed ${grey10};
      cursor: help;
    `}
`;

export const dateCell = css`
  ${monospaceRegular};
  color: ${grey80};
  font-size: 11px;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const cellField = css`
  color: ${grey80};
  font-size: 12px;
`;

export const linkCellField = css`
  color: ${grey80};
  font-size: 12px;
  text-decoration: none;

  &:hover {
    color: ${bluePlain};
  }
`;
