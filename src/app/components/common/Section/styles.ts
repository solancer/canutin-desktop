import { css } from 'styled-components';
import { sansSerifBold } from 'app/constants/fonts';
import { grey10, grey3 } from 'app/constants/colors';

const componentConstraints = css`
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
`

export const container = css`
  grid-area: body;
  display: grid;
  grid-template-rows: max-content auto;
  overflow-y: auto;
`;

export const header = css`
  display: flex;
  align-items: flex-end;
  background-color: ${grey3};
  border-bottom: 1px solid ${grey10};
  height: 152px;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
`;

export const title = css`
  ${componentConstraints};
  ${sansSerifBold};
  padding-left: 64px;
  padding-right: 64px;
  font-size: 24px;
`;

export const body = css`
  ${componentConstraints};
  display: flex;
  align-items: center;
  padding: 64px;
`;
