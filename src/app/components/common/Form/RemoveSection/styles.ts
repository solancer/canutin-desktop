import { css } from 'styled-components';

import { borderGrey, grey7, grey70, redPlain } from '@app/constants/colors';

export const container = css`
  align-items: center;
  background-color: ${grey7};
  border: 1px solid ${borderGrey};
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 16px;
  border-radius: 4px;
  filter: grayscale(1);

  &:hover {
    filter: grayscale(0);
  }
`;

export const messageContainer = css`
  display: flex;
  flex-direction: column;
`;

export const message = css`
  color: ${grey70};
`;

export const messageDanger = css`
  color: ${redPlain};
`;
