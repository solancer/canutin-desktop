import { css } from 'styled-components';
import { redPlain, bluePlain, greenPlain } from '@appConstants/colors';

import { StatusEnum } from '@appConstants/misc';

export const getStatusColor = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.ERROR:
      return redPlain;
    case StatusEnum.LOADING:
      return bluePlain;
    case StatusEnum.SUCCESS:
      return greenPlain;
  }
};

export const container = css<{ status: StatusEnum }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ status }) => getStatusColor(status)};
`;
