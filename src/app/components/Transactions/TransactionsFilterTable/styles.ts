import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import {
  greenPlain,
  grey10,
  grey30,
  grey80,
  grey90,
  underline,
  underlineHover,
  blackPlain,
  bluePlain,
  blackOpacity15,
  grey3,
  shadowPlate,
  borderGrey,
  grey50,
  whitePlain,
} from '@app/constants/colors';

export const container = css`
  background-color: ${grey3};
  border-radius: 8px;
  box-shadow: ${shadowPlate};
  display: flex;
  flex-direction: column;
`;

export const amountCell = css<{ value: number; excludeFromTotals: boolean }>`
  ${monospaceRegular}

  color: ${grey90};
  font-size: 12px;
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
  font-size: 10px;
`;

export const descriptionCell = css`
  ${underline};

  color: ${grey80};
  font-size: 12px;

  :hover {
    ${underlineHover}

    color: ${blackPlain};
    cursor: pointer;
  }
`;

export const linkCell = css`
  color: ${grey80};
  cursor: pointer;
  font-size: 12px;

  :hover {
    color: ${bluePlain};
    border-bottom: 1px solid ${blackOpacity15};
  }
`;

export const headerContainer = css`
  align-items: center;
  background-color: ${whitePlain};
  height: 47px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0 12px;
`;

export const headerItemContainer = css<{ isSorted: boolean }>`
  align-items: center;
  color: ${grey50};
  font-size: 12px;
  display: flex;

  &:last-of-type {
    justify-content: flex-end;
  }

  ${({ isSorted }) =>
    isSorted &&
    css`
      color: ${grey80};
    `}
`;

export const tableContainer = css`
  border-top: 1px solid ${borderGrey};
  border-radius: 8px;
  background-color: ${whitePlain};
  height: 48vh;
`;

export const tableSortIcon = css`
  color: ${grey80};
  font-size: 8px;
  padding-left: 4px;
`;

export const rowContainer = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  padding: 0 12px;
`;

export const renderRowCustom = css`
  border-top: 1px solid ${borderGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const rowItem = css`
  align-items: center;
  background-color: ${whitePlain};
  justify-content: center;

  &:last-of-type {
    text-align: right;
  }
`;

export const autoSizer = css`
  *::-webkit-scrollbar {
    width: 0;
    left: -100px;
  }
`;
