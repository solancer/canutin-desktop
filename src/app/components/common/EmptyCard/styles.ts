import { css } from 'styled-components';

import { borderGrey, grey50 } from '@app/constants/colors';

export const container = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${borderGrey};
  border-radius: 4px;
  color: ${grey50};
  font-size: 12px;
  padding: 48px 32px;
  text-align: center;
`;
