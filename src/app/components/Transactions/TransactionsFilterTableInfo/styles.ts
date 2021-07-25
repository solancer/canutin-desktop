import { borderGrey, grey80 } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';
import { css } from 'styled-components';

export const container = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 0px;
  margin: 8px 16px 20px; 
`;

export const infoContainer = css`
  border: 1px solid ${borderGrey};
  border-radius: 4px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 16px;
`;

export const infoTitle = css`
  color: ${grey80};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`

export const infoCount = css`
  ${monospaceRegular};

  font-size: 14px;
  color: ${grey80};
  letter-spacing: -0.02em;
`