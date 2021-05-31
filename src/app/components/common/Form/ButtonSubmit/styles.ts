import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey30, bluePlain, whitePlain } from '@appConstants/colors';

export const container = css<{ disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${bluePlain};
  border: none;
  border-radius: 4px;
  color: ${whitePlain};
  cursor: pointer;
  height: 40px;
  margin-right: 10px;
  padding: 12px 32px;
  transition: transform 100ms;

  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;
