import { css } from 'styled-components';

import { whitePlain, blueLight, grey50, grey80, blackOpacity10 } from '@appConstants/colors';
import { sansSerifBold, sansSerifRegular } from '@appConstants/fonts';

const componentPadding = css`
  padding: 20px;
`;

export const container = css`
  display: grid;
  grid-gap: 8px;
  border: none;
  text-align: left;
  padding: 0;
  background-color: ${whitePlain};
  border-radius: 4px;
  box-shadow: 0 4px 16px 0 ${blackOpacity10};
  transition: transform 100ms;
  width: 100%;

  &:hover {
    cursor: pointer;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1);
  }

  -webkit-user-select: none;
`;

export const header = css`
  align-items: center;
  background-color: ${blueLight};
  display: flex;
  justify-content: flex-start;
  ${componentPadding}
`;

export const body = css`
  ${componentPadding}
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const title = css`
  ${sansSerifBold};
  color: ${grey80};
  font-size: 16px;
  line-height: 1em;
  margin-bottom: 8px;
`;

export const subTitle = css`
  ${sansSerifRegular};
  color: ${grey50};
  font-size: 12px;
`;
