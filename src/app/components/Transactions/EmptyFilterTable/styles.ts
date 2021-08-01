import { css } from 'styled-components';

import { grey5, grey50 } from '@app/constants/colors';

export const container = css`
  align-items: center;
  background-color: ${grey5};
  display: flex;
  justify-content: center;
  height: 10rem;
`;

export const message = css`
  font-size: 12px;
  color: ${grey50};
`;
