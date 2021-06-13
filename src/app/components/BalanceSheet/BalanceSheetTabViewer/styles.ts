import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import { grey40 } from '@app/constants/colors';

export const container = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const header = css`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const balanceSheetTitle = css`
  ${monospaceRegular}
  color: ${grey40};
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const balanceSheetTabs = css`
  display: flex;

  > * + * {
    margin-left: 4px;
  }
`;

export const balanceSheetViewer = css`
  margin-top: 11px;
`;
