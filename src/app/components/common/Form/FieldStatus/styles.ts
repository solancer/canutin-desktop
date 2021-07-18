import { css } from 'styled-components';
import { getStatusColor } from '@appConstants/colors';

import { StatusEnum } from '@appConstants/misc';

export const container = css<{ status: StatusEnum }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ status }) => getStatusColor(status)};
`;
