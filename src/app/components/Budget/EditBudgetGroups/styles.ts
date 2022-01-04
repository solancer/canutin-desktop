import { css } from 'styled-components';

export const buttonFieldContainer = css`
  display: grid;
  grid-template-columns: auto minmax(128px, max-content);
  grid-gap: 8px;
`;

export const buttonFieldset = css`
  display: grid;
  grid-template-columns: minmax(128px, max-content) auto;
  min-height: 40px;
  grid-gap: 8px;
`;

export const percentageFieldContainer = css`
  display: grid;
  grid-template-columns: auto minmax(64px, max-content);
  min-height: 40px;
  grid-gap: 8px;
`;
