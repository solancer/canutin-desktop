import { css } from 'styled-components';
import { grey10, whitePlain } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';
import { inputShared } from '@appConstants/inputs';

export const inputElement = css<{ disabled?: boolean }>`
  ${inputShared};
  ${monospaceRegular};
  min-height: 40px;

  background-color: ${whitePlain};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}
`;
