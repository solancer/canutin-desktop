import { css } from 'styled-components';

import { grey10, grey20, redPlain } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const container = css<{ error: boolean }>`
  border-radius: 4px;
  border: 2px solid ${grey10};
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ error }) =>
    error &&
    css`
      color: ${redPlain};
      border-color: ${redPlain};
    `}
`;

export const label = css<{ title?: string }>`
  ${monospaceRegular}
  font-size: 13px;
  border-bottom: 1px dashed transparent;

  ${({ title }) =>
    title &&
    css`
      cursor: help;
      border-bottom-color: ${grey20};
    `}
`;
