import { css } from 'styled-components';

import { whitePlain, shadowPlate, bluePlain, grey50, grey70, grey7 } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const segmentedControlContainer = css`
  display: grid;
  grid-gap: 4px;
  grid-auto-flow: column;
`;

export const segment = css<{ isActive: boolean }>`
  ${monospaceRegular}
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${grey7};
  cursor: pointer;
  color: ${grey50};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  border-radius: 4px;
  padding: 6px 8px;

  &:hover {
    color: ${grey70};
  }

  ${({ isActive }) =>
    isActive &&
    css`
      cursor: default;
      pointer-events: none;
      background-color: ${whitePlain};
      color: ${bluePlain};
      box-shadow: ${shadowPlate};
    `}
`;
