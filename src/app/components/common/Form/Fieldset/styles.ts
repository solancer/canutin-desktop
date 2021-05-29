import { css } from 'styled-components';
import { grey10 } from '@appConstants/colors';

export const container = css`
  border: none;
  border-top: 1px solid ${grey10};
  padding: 12px 0;
  display: grid;
  grid-row-gap: 8px;
  margin: 0;

  &:first-child {
    border-top: none;
  }
`;
