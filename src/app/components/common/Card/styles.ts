import { css } from 'styled-components';

import {
  whitePlain,
  grey80,
  shadowPlate,
  borderGrey,
  greenPlain,
  goldPlain,
  purplePlain,
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
    appearance === CardAppearanceEnum.SUMMARY
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
          background-color: ${greenPlain};
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
      : css`
          background-color: ${whitePlain};
        `};
`;

export const label = css`
  ${sansSerifBold}
  color: ${grey80};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const value = css`
  ${monospaceRegular}
  font-size: 14px;
  color: ${grey80};
`;
