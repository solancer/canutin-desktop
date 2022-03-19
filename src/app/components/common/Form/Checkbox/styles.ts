import { css } from 'styled-components';
import { grey90 } from '@appConstants/colors';
import { inputShared, inlineInput, inputFocusColor } from '@appConstants/inputs';

const helpCursorWhenDisabled = css<{ disabled?: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: help;
    `}
`;

export const inputContainer = css<{ disabled?: boolean }>`
  ${helpCursorWhenDisabled};
  ${inputShared};
  ${inlineInput};
  background-color: transparent;
`;

export const inputCheckbox = css`
  ${helpCursorWhenDisabled};
  ${inputFocusColor};
  margin: 0;
`;

export const valueLabel = css<{ disabled?: boolean }>`
  ${helpCursorWhenDisabled};
  font-size: 13px;
  color: ${grey90};
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ disabled }) =>
    disabled &&
    css`
      text-decoration: line-through;
    `}
`;
