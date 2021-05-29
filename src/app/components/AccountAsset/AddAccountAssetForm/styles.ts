import { css } from 'styled-components';
import { borderGrey, grey10, grey90, whitePlain } from '@appConstants/colors';
import { sansSerifRegular } from '@appConstants/fonts';
import { inputFocusColor } from '@appConstants/inputs';

export const toggableInputContainer = css`
  display: grid;
  grid-template-columns: minmax(96px, 1fr) 2fr;
  grid-gap: 8px;
`;

export const balanceSubContainer = css`
  align-items: center;
  display: flex;
`;

export const checkboxContainerLabel = css`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: max-content auto;
  align-items: center;
  border: 2px solid ${borderGrey};
  border-radius: 4px;
  padding: 12px 8px;
`;

export const checkbox = css`
  background-color: ${whitePlain};
  margin: 0;
  ${inputFocusColor};
`;

export const checkboxLabel = css`
  ${sansSerifRegular};
  font-size: 13px;
  color: ${grey90};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const hrDivider = css`
  border: 0.1px solid ${grey10};
`;
