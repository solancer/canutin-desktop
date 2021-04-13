import { css } from 'styled-components';
import { borderGrey, grey80, grey70 } from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

export const container = css`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
  padding-top: 20px;
  text-align: end;
`;

export const valuesContainer = css`
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  display: grid;
  grid-row-gap: 8px;
  padding: 10px;
`;

export const inputGroup = css`
  align-items: center;
  display: flex;
  height: 20px;

  input {
    cursor: pointer;
    margin: 0 8px 0 0;
  }
`;

export const valueLabel = css`
  color: ${grey80};
  font-size: 13px;
`;
