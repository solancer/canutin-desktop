import { css } from 'styled-components';

import { grey30, grey40 } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const currentPeriodDate = css`
  ${monospaceRegular};
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  line-height: 1em;
  letter-spacing: 0.1em;
`;

export const bugetThisMonthContainer = css`
  display: grid;
  grid-gap: 64px;
  position: relative;
  height: max-content;
`;

export const bugetThisMonthTime = css`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 100%;
  height: calc(100% + 16px);
  box-sizing: border-box;
  pointer-events: none;
  z-index: 1;
  top: 0px;
`;

export const bugetThisMonthLabel = css`
  ${monospaceRegular};
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  text-align: right;
  box-sizing: border-box;
  padding-top: 0;
  padding-right: 8px;
  position: relative;
  grid-column-start: 3;
  grid-column-end: span 6;
  border-right: 1px dashed ${grey30};
  transform: translateX(-1px);
`;
