import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey40, grey70, redPlain, whitePlain } from '@appConstants/colors';

export const container = css<{ danger: boolean }>`
  ${sansSerifBold};
  cursor: pointer;
  padding: 8px 16px;
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

  ${({ danger }) => danger && css`
    background-color: ${redPlain};
    color: ${whitePlain};
  `}
`;
