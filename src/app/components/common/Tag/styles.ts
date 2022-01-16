import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import { grey7, grey50 } from '@app/constants/colors';

export const container = css<{ title?: string }>`
  ${monospaceRegular};
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: -0.025em;
  color: ${grey50};
  background-color: ${grey7};
  padding: 4px 8px;
  border-radius: 4px;

  ${({ title }) =>
    title &&
    css`
      cursor: help;
    `}
`;
