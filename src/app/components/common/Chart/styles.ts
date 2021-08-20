import styled from 'styled-components';
import { whitePlain } from '@app/constants/colors';

export const Frame = styled.div<{ columns: number }>`
  background-color: ${whitePlain};
  border-radius: 5px;
  display: inline-grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  grid-template-rows: repeat(2, max-content);
  width: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05), 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

