import { css } from 'styled-components';
import { borderGrey, grey10, grey40, grey70, whitePlain } from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

export const container = css<{ disabled: boolean }>`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;

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

export const labelWrapper = css`
  padding-right: 20px;
  text-align: end;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
`;

export const optionalSpan = css`
  color: ${grey40};
  font-size: 12px;
`;
