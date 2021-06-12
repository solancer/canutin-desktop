import { css } from 'styled-components';
import { grey5, grey80, grey30, bluePlain } from '@appConstants/colors';

export interface NavItemProps {
  toggled: boolean | number;
}

export const container = css<NavItemProps & { active: boolean | number }>`
  color: ${grey80};
  cursor: default;
  display: flex;
  font-size: 13px;
  grid-gap: 16px;
  grid-template-columns: max-content auto;
  padding: 16px 24px;
  text-decoration: none;
  stroke: ${grey30};

  &:hover {
    background-color: ${grey5};
  }

  &:hover {
    background-color: ${grey5};
  }

  ${({ active }) =>
    active &&
    css`
      color: ${bluePlain};
      stroke: ${bluePlain};

      svg path {
        stroke: ${bluePlain};
      }
    `}
  
  ${({ toggled }) => toggled && css`
      grid-gap: none;
  `}
`;

export const text = css<NavItemProps>`
  display: ${({ toggled }) => (toggled ? 'block' : 'none')};
  font-size: 13px;
  font-weight: 600;

  -webkit-user-select: none;
`;
