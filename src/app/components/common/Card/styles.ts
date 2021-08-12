import { css } from 'styled-components';

import {
  whitePlain,
  grey80,
  shadowPlate,
  borderGrey,
  greenPlain,
  goldPlain,
  purplePlain,
  redPlain,
} from '@appConstants/colors';
import { sansSerifBold, monospaceRegular } from '@appConstants/fonts';
import { CardAppearanceEnum } from '.';

export const container = css<{ appearance?: CardAppearanceEnum }>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 16px;
  justify-content: space-between;
  padding: 16px;
  box-shadow: ${shadowPlate};
  border-radius: 4px;

  ${({ appearance }) =>
    appearance === CardAppearanceEnum.SECONDARY
      ? css`
          background-color: transparent;
          box-shadow: none;
          border: 1px solid ${borderGrey};
        `
      : appearance === CardAppearanceEnum.CASH
      ? css`
          background-color: ${greenPlain};
          color: ${whitePlain};
        `
      : appearance === CardAppearanceEnum.DEBT
      ? css`
          background-color: ${redPlain};
          color: ${whitePlain};
        `
      : appearance === CardAppearanceEnum.INVESTMENTS
      ? css`
          background-color: ${purplePlain};
          color: ${whitePlain};
        `
      : appearance === CardAppearanceEnum.OTHER_ASSETS
      ? css`
          background-color: ${goldPlain};
          color: ${whitePlain};
        `
      : appearance === CardAppearanceEnum.NET_WORTH
      ? css`
          display: flex;
          flex-direction: column;
          background-color: ${grey80};
          justify-content: space-between;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          grid-gap: 8px;
          color: ${whitePlain};
        `
      : css`
          background-color: ${whitePlain};
        `};
`;

export const label = css<{ appearance?: CardAppearanceEnum }>`
  ${sansSerifBold}
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const value = css<{ appearance?: CardAppearanceEnum }>`
  ${monospaceRegular}
  font-size: 14px;

  ${({ appearance }) =>
    appearance === CardAppearanceEnum.NET_WORTH &&
    css`
      font-size: 28px;
    `}
`;
