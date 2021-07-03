import { css } from 'styled-components';

export const container = css`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;

  @media (min-width: 1440px) {
    grid-gap: 32px;
  }
`;
