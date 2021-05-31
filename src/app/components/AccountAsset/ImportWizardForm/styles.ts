import { css } from 'styled-components';
import { bluePlain, grey20, grey30, grey7, whitePlain } from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

export const formFooter = css`
  align-items: center;
  background-color: ${grey7};
  display: flex;
  justify-content: flex-end;
  height: 56px;
`;

export const formSubmitButton = css<{ disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${bluePlain};
  border: none;
  border-radius: 4px;
  color: ${whitePlain};
  cursor: pointer;
  height: 40px;
  margin-right: 8px;
  padding: 12px 32px;

  &:focus {
    outline: none;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;
