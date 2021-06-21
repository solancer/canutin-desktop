import { css } from 'styled-components';

export const container = css`
  display: grid;
  grid-template-columns: max-content auto;
  grid-template-rows: 48px auto 48px;
  grid-template-areas:
    'title-bar title-bar'
    'side-bar body'
    'side-bar status-bar';
  height: 100vh;
  overflow-y: hidden;
`;
