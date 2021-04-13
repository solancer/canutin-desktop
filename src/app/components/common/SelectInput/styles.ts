import { css } from 'styled-components';
import { borderGrey, grey40, grey70, whitePlain } from '@appConstants/colors';
import { sansSerifBold, sansSerifRegular } from '@appConstants/fonts';

export const container = css`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
`;

export const label = css<{optional: boolean}>`
  ${sansSerifBold};
  display: ${({ optional }) => (optional && 'flex')};
  justify-content: ${({ optional }) => (optional && 'flex-end')};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
  text-align: end;
`;

export const optional = css`
  color: ${grey40};
  font-weight: 400;
  padding-left: .25rem;
  text-align: center;
  ${sansSerifRegular}
`;

export const valuesContainer = css`
  background-color: ${whitePlain};
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding-right: 15px;

  select {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;

    &:focus {
      outline: none;
    }
  }
`;
