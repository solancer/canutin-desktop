import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import {
  greenPlain,
  grey3,
  grey5,
  grey10,
  grey30,
  grey50,
  grey80,
  grey90,
  borderGrey,
  whitePlain,
  bluePlain,
  shadowPlate,
} from '@app/constants/colors';

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

export const tableHeaderRow = css`
  background-color: ${whitePlain};
`;

export const tableHeaderItem = css<{ alignRight?: boolean; isSorted: boolean }>`
  color: ${grey50};
  background-color: ${whitePlain};
  font-size: 12px;
  text-align: left;
  font-weight: 400;
  position: sticky;
  top: 0;
  padding: 12px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    background-color: ${borderGrey};
  }

  &:before {
    top: -1px;
    height: 1px;
  }

  &:after {
    bottom: -2px;
    height: 2px;
  }

  > div {
    align-items: center;
    display: flex;
  }

  &:hover {
    color: ${grey80};
  }

  &:first-of-type {
    padding-left: 12px;
  }

  ${({ alignRight }) =>
    alignRight &&
    css`
      &:last-of-type {
        > div {
          justify-content: flex-end;
        }
        padding-right: 12px;
      }
    `}

  ${({ isSorted }) =>
    isSorted &&
    css`
      color: ${grey80};
    `}
`;

export const tableOuterContainer = css`
  background-color: ${grey3};
  border-radius: 4px;
  box-shadow: ${shadowPlate};
  display: flex;
  flex-direction: column;
`;

export const tableInnerContainer = css`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-collapse: collapse;
  background-color: ${whitePlain};
`;

export const tableSortIcon = css`
  color: ${grey80};
  font-size: 8px;
  padding-left: 4px;
`;

export const row = css`
  &:nth-child(odd) {
    > td {
      background-color: ${grey3};
    }

    &:last-child {
      > td:first-child {
        border-bottom-left-radius: 4px;
      }

      > td:last-child {
        border-bottom-right-radius: 4px;
      }
    }
  }
`;

export const rowItem = css<{ alignRight?: boolean }>`
  align-items: center;
  justify-content: center;
  padding: 12px;

  &:first-of-type {
    padding-left: 12px;
  }

  ${({ alignRight }) =>
    alignRight &&
    css`
      &:last-of-type {
        text-align: right;
        padding-right: 12px;
      }
    `}
`;

export const tableEmptyRowCell = css`
  padding: 0;
`;

export const tableEmptyRowCard = css`
  border-top: 1px solid ${borderGrey};
  background-color: ${grey5};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;
