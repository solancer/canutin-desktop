import { css } from 'styled-components';

import { sansSerifRegular } from '@appConstants/fonts';
import { bluePlain, blueLight } from '@appConstants/colors';

export const container = css<{ loadingPercentage: number }>`
  align-items: center;
  background-color: ${blueLight};
  border-right: 3px solid ${bluePlain};
  display: flex;
  justify-content: space-between;
  height: 100%;
  min-width: ${({ loadingPercentage }) => `${loadingPercentage}%`};
  padding: 0 16px;
`;

export const message = css`
  ${sansSerifRegular};
  color: ${bluePlain};
  font-size: 11px;
  margin-right: 10px;
`;

export const percentage = css`
  ${sansSerifRegular};
  color: ${bluePlain};
  font-size: 11px;
`;
