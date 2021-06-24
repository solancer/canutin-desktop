import { css } from 'styled-components';

import { sansSerifRegular, monospaceRegular } from '@appConstants/fonts';
import { bluePlain, blueLight } from '@appConstants/colors';

export const container = css<{ loadingPercentage: number }>`
  position: absolute;
  left: 0;
  align-items: center;
  background-color: ${blueLight};
  border-right: 3px solid ${bluePlain};
  display: flex;
  justify-content: space-between;
  height: 100%;
  min-width: ${({ loadingPercentage }) => `${loadingPercentage}%`};
  padding: 0 16px;
  transition: min-width 250ms;
  box-sizing: border-box;
`;

export const message = css`
  ${sansSerifRegular};
  color: ${bluePlain};
  font-size: 11px;
  margin-right: 10px;
`;

export const percentage = css`
  ${monospaceRegular};
  color: ${bluePlain};
  font-size: 11px;
`;
