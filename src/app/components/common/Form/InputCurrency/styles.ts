import { css } from 'styled-components';
import { grey10, whitePlain } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';
import { inputShared, placeholder } from '@appConstants/inputs';

export const inputElement = css<{ disabled?: boolean }>`
  ${inputShared};
  ${monospaceRegular};
  ${placeholder};
  min-height: 40px;

  background-color: ${whitePlain};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}
`;
