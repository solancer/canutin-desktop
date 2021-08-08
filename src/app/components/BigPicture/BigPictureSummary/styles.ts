import { css } from 'styled-components';

export const container = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;

  > :first-child {
    grid-area: 1 / 1 / 3 / 2;
  }
`;
