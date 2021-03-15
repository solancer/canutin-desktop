import { css } from 'styled-components';
import { plainWhite, grey10 } from 'app/constants/colors';

export const container = css`
  background-color: ${plainWhite};
  border-bottom: 1px solid ${grey10};
  grid-area: title-bar;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 32px;

  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

export const icon = css`
  align-self: center;
  border-left: 1px solid ${grey10};
  margin-left: auto;
  height: 16px;
  padding: 16px;
`;
