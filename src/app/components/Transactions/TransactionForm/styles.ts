import { css } from 'styled-components';

export const toggableInputContainer = css`
  display: grid;
  grid-template-columns: minmax(96px, 1fr) 2fr;
  grid-gap: 8px;
`;

export const dateField = css`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
`;
