import { css } from 'styled-components';

import { grey5 } from '@appConstants/colors';

export const container = css`
  background-color: ${grey5};
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
