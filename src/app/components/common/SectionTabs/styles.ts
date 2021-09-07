import { css } from 'styled-components';
import { bluePlain, borderGrey, grey20, grey60, grey90 } from '@app/constants/colors';

export const container = css`
  border-top: 1px solid ${borderGrey};
  height: 56px;
`;

export const nav = css`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  grid-column-gap: 32px;
  box-sizing: border-box;
  max-width: 1200px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 64px;
`;

export const section = css<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  color: ${grey60};
  height: 100%;

  &:hover {
    color: ${grey90};
    box-shadow: 0 1px 0 ${grey20};
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      color: ${grey90};
      box-shadow: 0 1px 0 ${bluePlain};

      &:hover {
        box-shadow: 0 1px 0 ${bluePlain};
      }
    `}
`;
