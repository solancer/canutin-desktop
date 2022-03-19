import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey30, grey40, grey70 } from '@appConstants/colors';

export const container = css<{ disabled: boolean }>`
  ${sansSerifBold};
  padding: 10px 16px;
  font-size: 12px;
  border-radius: 3px;
  color: ${grey70};
  border: 1px solid ${grey20};
  background-color: transparent;
  line-height: 1em;
  transition: transform 100ms;
  outline: none;

  &:active,
  &:focus,
  &:hover {
    border-color: ${grey40};
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      border: none;
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;
