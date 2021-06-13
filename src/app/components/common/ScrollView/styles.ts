import { css } from 'styled-components';

import { sansSerifBold, sansSerifRegular } from '@appConstants/fonts';
import { grey10, grey3, grey40 } from '@appConstants/colors';

const componentConstraints = css`
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
`;

export const container = css`
  grid-area: body;
  display: grid;
  grid-template-rows: max-content auto;
  overflow-y: auto;
`;

export const header = css`
  background-color: ${grey3};
  border-bottom: 1px solid ${grey10};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 152px;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
`;

export const title = css`
  ${componentConstraints};
  ${sansSerifBold};
  font-size: 24px;
  padding-left: 64px;
  padding-right: 64px;
`;

export const subTitle = css`
  ${componentConstraints};
  ${sansSerifRegular};
  color: ${grey40};
  font-size: 11px;
  padding-left: 64px;
  padding-right: 64px;
`;

export const main = css`
  ${componentConstraints};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px;
`;

export const back = css`
  cursor: pointer;
  margin-left: 22.5px;
  margin-bottom: auto;
`;

export const information = css`
  display: flex;
  justify-content: space-between;
`;

export const rightInformation = css`
  margin-right: 119px;
`;
