import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const body = css`
  background-color: ${grey5};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
  padding-left: 130px;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-top: 180px;
  margin-bottom: 15px;
  ${monospaceRegular};
`;

export const boxContainer = css`
  display: flex;
`;