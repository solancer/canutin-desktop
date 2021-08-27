import { css } from 'styled-components';

import { borderGrey } from '@app/constants/colors';

export const container = css`
  width: 0;
  height: 100%;
  border: none;
  border-left: 1px solid ${borderGrey};
  margin-left: 4px;
  margin-right: 4px;
`;
