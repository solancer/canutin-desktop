import { css } from 'styled-components';
import { sansSerifBold } from 'app/constants/fonts';
import { grey10, grey3 } from 'app/constants/colors';

export const container = css`
  height: 100%;
`;

export const header = css`
  align-items: flex-end;
  background-color: ${grey3};
  border-bottom: 1px solid ${grey10};
  justify-content: flex-start;
  display: flex;
  height: 150px;
`;

export const title = css`
  ${sansSerifBold};
  font-size: 24px;
  margin-left: 130px;
  margin-right: 130px;
  padding-bottom: 25px;
`;

export const body = css`
  height: 100%;
`;
