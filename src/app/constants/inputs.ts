import { sansSerifRegular } from '@appConstants/fonts';
import { whitePlain, borderGrey, grey30, grey80, bluePlain } from '@appConstants/colors';

export const inputFocusColor = `
  &:focus {
    outline-color: ${bluePlain};
  }
`;

export const inputShared = `
  ${inputFocusColor};
  background-color: ${whitePlain};
  border: 2px solid ${borderGrey};
  ${sansSerifRegular};
  font-size: 13px;
  color: ${grey80};
  width: 100%;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
`;

export const inlineInput = `
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 8px;
  align-items: center;
`;

export const placeholder = `
  &::placeholder {
    color: ${grey30};
  }
`;
