import { css } from 'styled-components';
import { grey80 } from '@appConstants/colors';
import { inputShared, inlineInput, inputFocusColor } from '@appConstants/inputs';

export const radioGroupContainer = css`
  ${inputShared};
  display: grid;
  grid-gap: 8px;
`;

export const inputContainer = css`
  ${inlineInput};
`;

export const inputRadio = css`
  margin: 0;
  ${inputFocusColor};
`;

export const valueLabel = css`
  color: ${grey80};
  font-size: 13px;
`;
