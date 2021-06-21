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

export const sectionTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  line-height: 1em;
  ${monospaceRegular};
`;
