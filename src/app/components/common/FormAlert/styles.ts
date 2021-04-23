import { css } from 'styled-components';
import { whitePlain, bluePlain, grey80 } from '@appConstants/colors';

export const container = css`
  background-color: ${whitePlain};
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  border-left: 3px solid ${bluePlain}; 
  display: grid;
  grid-column: 2;
  grid-row-gap: 8px;
  padding: 16px 19px 16px 16px;
`;

export const title = css`
  color: ${grey80};
  font-size: 13px;
  font-weight: 600;
`;

export const description = css`
  color: ${grey80};
  font-size: 12px;
`;
