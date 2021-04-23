import { css } from 'styled-components';
import { grey40, grey70 } from '@appConstants/colors';
import { sansSerifRegular, sansSerifBold } from '@appConstants/fonts';

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-top: 12px;
  padding-right: 20px;
  text-align: end;
`;

export const optionalTag = css`
  ${sansSerifRegular}
  color: ${grey40};
  font-size: 12px;
`;
