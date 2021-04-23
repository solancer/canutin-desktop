import { css } from 'styled-components';
import {
  bluePlain,
  borderGrey,
  grey20,
  grey30,
  grey7,
  whitePlain,
} from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

export const formContainer = css`
  border: 1px solid ${borderGrey};
  border-radius: 4px;
  display: grid;
  grid-row-gap: 8px;
  padding-top: 10px;
`;

export const formFooter = css`
  align-items: center;
  background-color: ${grey7};
  display: flex;
  justify-content: flex-end;
  height: 55px;
  margin-top: 8px;
`;

export const formSubmitButton = css<{ disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${({ disabled }) => (disabled ? grey20 : bluePlain)};
  border: none;
  border-radius: 3px;
  color: ${({ disabled }) => (disabled ? grey30 : whitePlain)};
  cursor: pointer;
  height: 40px;
  margin-right: 10px;
  padding: 12px 28px;

  &:focus {
    outline: none;
  }
`;
