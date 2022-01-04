import { css } from 'styled-components';

import { StatusEnum } from '@app/constants/misc';

import {
  whitePlain,
  shadowPlate,
  grey10,
  grey3,
  greenPlain,
  yellowLight,
  blueLight,
  bluePlain,
  yellowPlain,
  greenLight,
  redPlain,
  redLight,
  grey40,
} from '@app/constants/colors';
import { monospaceRegular, sansSerifBold } from '@app/constants/fonts';

export const container = css`
  background-color: ${whitePlain};
  border-radius: 5px;
  box-shadow: ${shadowPlate};
  display: grid;
  grid-template-columns: repeat(10, 1fr);
`;

export const header = css`
  ${sansSerifBold}
  align-items: center;
  display: flex;
  grid-column-end: span 2;
  padding: 16px;
  font-size: 13px;
  box-sizing: border-box;
`;

export const progressContainer = css`
  grid-column-end: span 6;
  border-left: 1px solid ${grey10};
  border-right: 1px solid ${grey10};
  background-color: ${grey3};
  height: 100%;
  align-items: center;
  display: flex;
`;

export const progress = css<{ status?: StatusEnum; percentage: number }>`
  width: ${({ percentage }) => `${percentage > 100 ? 100 : percentage}%`};

  position: relative;
  display: flex;
  align-items: center;
  font-size: 11px;
  padding: 16px 0;
  height: 100%;
  box-sizing: border-box;
  justify-content: flex-end;

  ::after {
    content: '';
    position: absolute;
    display: block;
    height: 100%;
    width: 3px;
    z-index: 2;

    ${({ status }) => {
      switch (status) {
        case StatusEnum.POSITIVE:
          return `background-color: ${greenPlain}`;
        case StatusEnum.WARNING:
          return `background-color: ${yellowPlain}`;
        case StatusEnum.NEGATIVE:
          return `background-color: ${redPlain}`;
        case StatusEnum.NEUTRAL:
          return `background-color: ${bluePlain}`;
        default:
          return `background-color: ${grey10}`;
      }
    }}
  }

  p {
    ${({ status }) => {
      switch (status) {
        case StatusEnum.POSITIVE:
          return `color: ${greenPlain}`;
        case StatusEnum.WARNING:
          return `color: ${yellowPlain}`;
        case StatusEnum.NEGATIVE:
          return `color: ${redPlain}`;
        case StatusEnum.NEUTRAL:
          return `color: ${bluePlain}`;
        default:
          return `color: ${grey40}`;
      }
    }}
  }

  ${({ status }) => {
    switch (status) {
      case StatusEnum.POSITIVE:
        return `background-color: ${greenLight}`;
      case StatusEnum.WARNING:
        return `background-color: ${yellowLight}`;
      case StatusEnum.NEGATIVE:
        return `background-color: ${redLight}`;
      case StatusEnum.NEUTRAL:
        return `background-color: ${blueLight}`;
      default:
        return `background-color: ${grey3}`;
    }
  }}
`;

export const progressTooltip = css`
  ${monospaceRegular}
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  z-index: 3;
  border-radius: 3px;
  padding: 2px;
  white-space: nowrap;
`;

export const balanceContainer = css`
  ${monospaceRegular}
  grid-column-end: span 2;
  text-align: right;
  font-size: 14px;
  padding: 16px;
`;
