import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey30, grey40, grey80, bluePlain, whitePlain } from '@appConstants/colors';

const scaleOnClick = css`
  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const defaultContainer = css<{ disabled: boolean }>`
  ${scaleOnClick};
  ${sansSerifBold};
  background-color: ${bluePlain};
  border: none;
  border-radius: 4px;
  color: ${whitePlain};
  cursor: pointer;
  height: 40px;
  padding: 0 32px;
  transition: transform 100ms;

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;

export const secondaryContainer = css<{ disabled: boolean }>`
  ${scaleOnClick};
  border: 1px solid ${grey20};
  border-radius: 4px;
  background-color: transparent;
  letter-spacing: normal;
  line-height: 12px;
  color: ${grey80};
  font-size: 11px;
  height: 28px;
  padding: 0 16px;

  &:hover {
    border-color: ${grey40};
  }
`;
