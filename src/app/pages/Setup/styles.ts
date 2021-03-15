import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const body = css`
  background-color: ${grey5};
  display: grid;
  grid-gap: 16px;
  width: 100%;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  ${monospaceRegular};
`;

export const boxContainer = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`;
