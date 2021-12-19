import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import periodCurrentBackground from '@assets/icons/ChartCurrentBackground.svg';
import {
  greenLight,
  greenPlain,
  grey50,
  grey10,
  grey30,
  grey3,
  redLight,
  redPlain,
  whitePlain,
} from '@app/constants/colors';

export const period = css`
  display: flex;
  flex-direction: column;
  border-left: 1px ${props => (props.theme.isStartOfYear ? `dashed ${grey30}` : `solid ${grey10}`)};
  border-bottom: 1px solid ${grey10};

  ${props =>
    props.theme.isActive &&
    css`
      position: relative;
      background-color: ${grey3};
      border-bottom-color: transparent;
    `}

  ${props =>
    props.theme.label === '1' &&
    css`
      border-left: 1px dashed ${grey30};
    `}

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }
`;

export const periodBalance = css<{ proportion: string }>`
  display: grid;
  width: 100%;
  height: 50vh;
  min-height: 256px;
  max-height: 320px;
  padding-top: 8px;
  box-sizing: border-box;
  grid-template-rows: ${props => props.proportion};
`;

export const periodBar = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 28px;
`;

export const periodBalanceLabel = css`
  ${monospaceRegular};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 28px;
  font-size: 12px;
  text-align: center;
  color: ${props =>
    props.theme.balance > 0 ? greenPlain : props.theme.balance < 0 ? redPlain : grey50};
  margin: ${props => (props.theme.balance >= 0 ? 'auto 0 0 0' : '0 0 auto 0')};
  opacity: ${props => (props.theme.isActive ? 1 : props.theme.isBalanceLabelVisible ? 1 : 0)};
`;

export const bar = css<{ height: number }>`
  height: ${props => props.height}%;
`;

export const barPositive = css`
  ${props => {
    let background = css`
      background-color: ${greenLight};
    `;

    if (props.theme.isCurrentPeriod) {
      background = css`
        background-color: ${whitePlain};
        background-image: url('${periodCurrentBackground}');
        background-size: 40px;
      `;
    } else if (props.theme.isActive) {
      background = css`
        background-color: ${greenPlain};
      `;
    }
    return background;
  }}

  ${props =>
    props.theme.balance > 0 &&
    css`
      border-top: 3px solid ${greenPlain};

      &:first-child {
        margin-top: auto;
      }
    `}
`;

export const barNegative = css`
  border-bottom: 3px solid ${redPlain};

  ${props => {
    let background = css`
      color: ${redPlain};
      background-color: ${redLight};
    `;

    if (props.theme.isCurrentPeriod) {
      background = css`
        background-color: ${whitePlain};
        background-image: url('${periodCurrentBackground}');
        background-size: 40px;
      `;
    } else if (props.theme.isActive) {
      background = css`
        background-color: ${redPlain};
      `;
    }
    return background;
  }}
`;

// CSS HACK: we need an empty element to occupy the space allocated by <PeriodBalance/>'s grid-template-rows.
export const periodBarPlaceholder = css`
  min-height: 28px;
`;

export const periodLabel = css`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  font-size: ${props => (props.theme.periodLength > 12 ? '8px' : '11px')};
  line-height: 1em;
  padding: ${props => (props.theme.periodLength > 12 ? '12px 2px 8px' : '12px 3px 8px')};
  box-sizing: border-box;
  text-align: center;
  color: ${grey30};
`;

export const periodDivider = css`
  height: 1px;
  border: none;
  padding: 0;
  margin: 0;
  background-color: ${grey10};
`;
