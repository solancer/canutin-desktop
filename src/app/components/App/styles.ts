import { css } from 'styled-components';

export const container = css<{ hasSidebar: boolean }>`
  display: grid;
  grid-template-rows: 48px auto 48px;
  grid-template-areas:
    'title-bar'
    'body'
    'status-bar';
  height: 100vh;
  overflow-y: hidden;

  ${({ hasSidebar }) =>
    hasSidebar &&
    css`
      grid-template-columns: max-content auto;
      grid-template-areas:
        'title-bar title-bar'
        'side-bar body'
        'side-bar status-bar';
    `}
`;
