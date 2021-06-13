import { css } from 'styled-components';

import { whitePlain, shadowPlate, bluePlain, grey50, grey7 } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const container = css<{ isActive: boolean }>`
  ${monospaceRegular}
  align-items: center;
  background-color: ${grey7};
  cursor: pointer;
  color: ${grey50};
  display: flex;
  font-size: 11px;
  letter-spacing: -0.025em;
  height: 16px;
  border-radius: 4px;
  padding: 6px 8px;
  justify-content: center;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${whitePlain};
      color: ${bluePlain};
      box-shadow: ${shadowPlate};
    `}
`;
