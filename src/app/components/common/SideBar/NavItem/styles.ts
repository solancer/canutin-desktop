import { css } from 'styled-components';
import { grey5, grey80, grey30, bluePlain } from '@appConstants/colors';

export interface NavItemProps {
  toggled: boolean | number;
}

export const container = css<NavItemProps & { active: boolean | number }>`
  color: ${({ active }) => (active ? bluePlain : grey80)};
  cursor: default;
  display: flex;
  font-size: 13px;
  grid-gap: ${({ toggled }) => (toggled ? '16px' : 'none')};
  grid-template-columns: max-content auto;
  padding: 16px 24px;
  text-decoration: none;
  stroke: ${({ active }) => (active ? bluePlain : grey30)};

  &:hover {
    background-color: ${grey5};
  }

  &:hover {
    background-color: ${grey5};
  }
`;

export const text = css<NavItemProps>`
  display: ${({ toggled }) => (toggled ? 'block' : 'none')};
  font-size: 13px;
  font-weight: 600;

  -webkit-user-select: none;
`;
