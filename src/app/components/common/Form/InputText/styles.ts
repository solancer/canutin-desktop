import { css } from 'styled-components';
import { grey10, whitePlain } from '@appConstants/colors';
import { inputShared } from '@appConstants/inputs';

export const inputElement = css<{ disabled?: boolean }>`
  ${inputShared};
  background-color: ${whitePlain};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}
`;
