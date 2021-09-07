import { css } from 'styled-components';
import { greenPlain, grey10, redPlain, whitePlain } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';
import { inputShared } from '@appConstants/inputs';

export const inputElement = css<{
  disabled: boolean;
  allowNegative: boolean;
  value: number | null;
}>`
  ${inputShared};
  ${monospaceRegular};
  min-height: 40px;
  background-color: ${whitePlain};

  // Positive values
  ${({ allowNegative, value }) =>
    allowNegative &&
    value &&
    value > 0 &&
    css`
      color: ${greenPlain};
    `}

  // Negative values
  ${({ allowNegative, value }) =>
    allowNegative &&
    value &&
    value < 0 &&
    css`
      color: ${redPlain};
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}
`;
