import { css } from 'styled-components';
import { grey3, grey5, grey10, grey30, grey80, bluePlain } from '@appConstants/colors';

export interface NavItemProps {
  toggled: boolean | number;
  disabled?: boolean;
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
  outline: none;

  &:focus {
    background-color: ${grey3};
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

  ${({ toggled }) =>
    toggled &&
    css`
      grid-gap: none;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${grey10};
      pointer-events: none;
    `};
`;

export const text = css<NavItemProps>`
  display: ${({ toggled }) => (toggled ? 'block' : 'none')};
  font-size: 13px;
  font-weight: 600;

  -webkit-user-select: none;
`;
