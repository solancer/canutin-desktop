import { css } from 'styled-components';

import { grey3, shadowPlate } from '@app/constants/colors';

export const container = css<{ periodsLength: number }>`
  background-color: ${grey3};
  box-shadow: ${shadowPlate};
  border-radius: 0 0 5px 5px;
  list-style: none;
  display: grid;
  margin: 0;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  grid-column-start: ${({ periodsLength }) => css`span ${periodsLength}`};
  padding: 16px;
`;
