import { css } from 'styled-components';

export const container = css`
  display: flex;

  > * + * {
    margin-left: 32px;
  }
`;
