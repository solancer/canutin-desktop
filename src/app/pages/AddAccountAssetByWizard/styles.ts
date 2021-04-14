import { css } from 'styled-components';
import { grey40, grey5 } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';

export const container = css`
  background-color: ${grey5};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 64px;
  padding-right: 64px;
  width: 100%;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 15px;
  ${monospaceRegular};
`;
