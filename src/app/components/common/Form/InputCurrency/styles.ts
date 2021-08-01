import { css } from 'styled-components';
import { greenPlain, grey10, redPlain, whitePlain } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';
import { inputShared } from '@appConstants/inputs';
import { TransactionTypesEnum } from '@appConstants/misc';

export const inputElement = css<{ disabled?: boolean; transactionType?: TransactionTypesEnum }>`
  ${inputShared};
  ${monospaceRegular};

  background-color: ${whitePlain};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey10};
    `}

  ${({ transactionType }) => {
    if (transactionType === TransactionTypesEnum.INCOME) {
      return css`
        color: ${greenPlain};
      `;
    }

    if (transactionType === TransactionTypesEnum.EXPENSE) {
      return css`
        color: ${redPlain};
      `;
    }
  }}
`;
