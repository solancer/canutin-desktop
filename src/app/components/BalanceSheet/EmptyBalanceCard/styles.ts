import { css } from 'styled-components';

import { borderGrey, grey50 } from '@app/constants/colors';

export const container = css`
  align-items: center;
  background-color: ${borderGrey};
  border-radius: 4px;
  color: ${grey50};
  font-size: 14px;
  display: flex;
  justify-content: center;
  height: 30px;
  padding: 48px 32px;
  text-align: center;
`;
