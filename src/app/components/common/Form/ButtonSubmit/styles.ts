import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey30, bluePlain, whitePlain, grey80 } from '@appConstants/colors';

export const defaultContainer = css<{ disabled: boolean }>`
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

export const secondaryContainer = css<{ disabled: boolean }>`
  border: 1px solid ${grey20};
  border-radius: 4px;
  background-color: transparent;
  letter-spacing: normal;
  line-height: 12px;
  color: ${grey80};
  font-size: 11px;
  height: 28px;
  padding: 8px 16px;
`;
