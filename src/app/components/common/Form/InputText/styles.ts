import { css } from 'styled-components';
import { grey10, whitePlain } from '@appConstants/colors';
import { inputShared, placeholder } from '@appConstants/inputs';

export const inputElement = css<{ disabled?: boolean }>`
  ${inputShared};
  ${placeholder};
  background-color: ${whitePlain};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}
`;
