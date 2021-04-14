import { css } from 'styled-components';

import { StatusEnum } from '@appConstants/misc';
import { sansSerifBold } from '@appConstants/fonts';
import {
  grey20,
  grey40,
  grey70,
  grey80,
  whitePlain,
  borderGrey,
  redPlain,
  bluePlain,
  greenPlain,
} from '@appConstants/colors';

export const container = css`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;

export const labelWrapper = css`
  padding-right: 20px;
  text-align: end;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-top: 20px;
  text-align: end;
`;

export const fileExtensionLabel = css`
  color: ${grey40};
  font-size: 12px;
  text-align: end;
`;

export const fileContainer = css`
  display: flex;
  flex-direction: column;
`;

const getStatusColor = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.ERROR:
      return redPlain;
    case StatusEnum.LOADING:
      return bluePlain;
    case StatusEnum.SUCCESS:
      return greenPlain;
  }
};

export const filePathStatus = css<{ status: StatusEnum }>`
  font-size: 12px;
  color: ${({ status }) => getStatusColor(status)};
`;

export const filePathContainer = css<{ status?: StatusEnum }>`
  align-items: center;
  background-color: ${whitePlain};
  border: 2px solid ${({ status }) => status ? getStatusColor(status): borderGrey};
  border-radius: 5px;
  color: ${grey80};
  display: flex;
  padding: 5px 5px 5px 12px;
`;

export const filePathText = css`
  font-size: 13px;
`;

export const chooseBtn = css`
  background-color: ${whitePlain};
  border: 1px solid ${grey20};
  border-radius: 3px;
  font-weight: 600;
  font-size: 11px;
  height: 30px;
  margin-left: auto;
  padding: 9px 16px;
  width: 73px;
`;
