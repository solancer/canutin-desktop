import { css } from 'styled-components';
import { monospaceRegular } from '@appConstants/fonts';
import { grey40 } from '@appConstants/colors';

export const container = css`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: max-content;
  grid-gap: 12px;
`;

export const header = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 32px;
  align-items: center;
  justify-content: space-between;
`;

export const title = css`
  ${monospaceRegular};
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  line-height: 1em;
  letter-spacing: 0.1em;
`;
