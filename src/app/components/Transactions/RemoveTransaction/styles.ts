import { css } from 'styled-components';

import { borderGrey, grey7, grey70, redPlain } from '@app/constants/colors';

export const container = css`
  align-items: center;
  background-color: ${grey7};
  border: 1px solid ${borderGrey};
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
`;
export const messageContainer = css`
  display: flex;
  flex-direction: column;
`;
export const message = css`
  color: ${grey70};
  font-size: 12px;
`;
export const messageDanger = css`
  color: ${redPlain};
  font-size: 12px;
`;
