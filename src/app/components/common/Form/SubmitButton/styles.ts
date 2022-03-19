import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey30, bluePlain, whitePlain } from '@appConstants/colors';

export const container = css<{ disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${bluePlain};
  color: ${whitePlain};
  border: none;

  &:focus {
    outline-color: ${bluePlain};
  }

  &:hover {
    filter: saturate(1.5);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;
