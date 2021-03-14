import { css } from 'styled-components';
import { plainWhite, blueLight, grey50, grey80, black01 } from 'app/constants/colors';
import { sansSerifExtraBold, sansSerifRegular } from 'app/constants/fonts';

export const container = css`
  background-color: ${plainWhite};
  border-radius: 4px;
  box-shadow: 0 4px 15px 0 ${black01};
  margin-right: 10px;
  width: 510px;
  
  &:hover {
    cursor: pointer;
  }

  -webkit-user-select: none;
`;

export const header = css`
  align-items: center;
  background-color: ${blueLight};
  display: flex;
  justify-content: flex-start;
  height: 64px;
  padding-left: 16px;
`;

export const body = css`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 96px;
  padding-left: 16px;
`;

export const title = css`
  ${sansSerifExtraBold};
  color: ${grey80};
  font-size: 17px;
  margin-bottom: 12px;
`;

export const subTitle = css`
  ${sansSerifRegular};
  color: ${grey50};
  font-size: 12px;
`;
