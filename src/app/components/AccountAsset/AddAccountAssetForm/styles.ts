import { css } from 'styled-components';
import {
  bluePlain,
  borderGrey,
  grey10,
  grey20,
  grey30,
  grey7,
  grey70,
  grey90,
  whitePlain,
} from '@appConstants/colors';
import { sansSerifBold, sansSerifRegular } from '@appConstants/fonts';

export const formContainer = css`
  border: 1px solid ${borderGrey};
  border-radius: 4px;
  display: grid;
  grid-row-gap: 8px;
  padding-top: 10px;
`;

export const form = css`
  align-items: center;
  display: grid;
  grid-row-gap: 8px;
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

export const balanceContainer = css`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;

export const balanceSubContainer = css`
  align-items: center;
  display: flex;
`;

export const customInputLabel = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
  text-align: end;
`;

export const customInputContainer = css<{ disabled: boolean }>`
  align-items: center;

  input {
    background-color: ${({ disabled }) => (disabled ? grey10 : whitePlain)};
    border: 2px solid ${borderGrey};
    border-radius: 5px;
    padding: 10px;

    &:focus {
      outline: none;
    }
  }
`;

export const checkboxContainer = css`
  align-items: center;
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  margin-left: 12px;
  padding: 8px;
`;

export const checkbox = css`
  background-color: ${whitePlain};

  &:focus {
    outline: none;
  }
`;

export const checkboxLabel = css`
  ${sansSerifRegular};
  font-size: 13px;
  color: ${grey90};
`;

export const hrDivider = css`
  border: 0.1px solid ${grey10};
`;
