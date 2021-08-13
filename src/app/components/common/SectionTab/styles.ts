import { css } from 'styled-components';
import { bluePlain, borderGrey, grey60, grey90 } from '@app/constants/colors';

export const container = css`
  border-top: 1px solid ${borderGrey};
  box-sizing: border-box;
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  grid-column-gap: 32px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px 64px 0;
  width: 100%;
`;

export const section = css<{ isSelected: boolean }>`
  cursor: pointer;
  font-size: 12px;
  color: ${grey60};
  padding-bottom: 20px;

  ${({ isSelected }) => isSelected && css`
    color: ${grey90};
    border-bottom: 1px solid ${bluePlain};
  `}
`;
