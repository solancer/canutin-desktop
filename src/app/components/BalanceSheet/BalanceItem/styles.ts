import { css } from 'styled-components';

export const container = css``;

export const cardsContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 8px;

  > * + * {
    margin-top: 8px;
  }
`;
