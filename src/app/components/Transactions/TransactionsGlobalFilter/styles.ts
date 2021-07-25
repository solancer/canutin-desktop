import { css } from 'styled-components';

import { borderGrey, grey30, whitePlain } from '@app/constants/colors';

export const globalInput = css`
  background: ${whitePlain};
  border: 2px solid ${borderGrey};
  border-radius: 4px;
  margin: 20px 16px 0;
  padding: 12px 14px;

  ::placeholder {
    color: ${grey30};
  }
`;