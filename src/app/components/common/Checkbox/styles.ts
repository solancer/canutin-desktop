import { css } from 'styled-components';
import { borderGrey, grey90, whitePlain } from '@appConstants/colors';
import { sansSerifRegular } from '@appConstants/fonts';

export const container = css`
  align-items: center;
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  padding: 10px;

  input {
    background-color: ${whitePlain};

    &:focus {
      outline: none;
    }
  }
`;

export const subContainer = css`
  align-items: center;
  display: flex;
  grid-column-start: 2;
`;

export const label = css`
  ${sansSerifRegular};
  font-size: 13px;
  color: ${grey90};
`;
