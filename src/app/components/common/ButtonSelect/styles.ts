import { css } from 'styled-components';

import { grey20, grey40 } from '@app/constants/colors';

export const container = css`
  .select {
    &__control {
      min-width: 144px;
      border-width: 1px;
      height: 100%;
      min-height: 30px;
      border-color: ${grey20};
      border-radius: 3px;

      &:hover {
        border-color: ${grey40};
      }
    }

    &__single-value {
      font-size: 12px;
      font-weight: 600;
    }

    &__dropdown-indicator {
      padding-top: 0;
      padding-bottom: 0;
    }

    &__menu-list {
      font-size: 12px;
    }
  }
`;
