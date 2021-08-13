import { StatusEnum } from '@appConstants/misc';

export const redPlain = '#FF3162';
export const redLight = '#F9ECEF';
export const greenPlain = '#00A36F';
export const greenLight = '#ECF9F6';
export const bluePlain = '#0366D6';
export const blueLight = '#EFF7FF';
export const purplePlain = '#5255AC';
export const goldPlain = '#B19B70';
export const yellowPlain = '#FBA500';
export const yellowLight = '#FFF8E4';
export const borderGrey = '#E2E2E2';
export const whitePlain = '#FFFFFF';
export const blackPlain = '#000';
export const grey3 = '#FAFAFA';
export const grey5 = '#F2F2F2';
export const grey7 = '#EDEDED';
export const grey10 = '#E6E6E6';
export const grey20 = '#CCCCCC';
export const grey30 = '#B2B2B2';
export const grey40 = '#999999';
export const grey50 = '#7F7F7F';
export const grey60 = '#666';
export const grey70 = '#4C4C4C';
export const grey80 = '#333333';
export const grey90 = '#191919';
export const blackOpacity10 = 'rgba(0, 0, 0, .1)';
export const blackOpacity15 = 'rgba(0, 0, 0, .15)';
export const blackOpacity25 = 'rgba(0, 0, 0, .25)';
export const yellowUnderline = 'rgb(242 216 166 / 50%)';
export const yellowUnderlineHover = '#f2d8a6';
export const shadowPlate = '0px 4px 15px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05)';
export const underline = 'box-shadow: inset 0 -4px 0 rgb(242 216 166 / 50%)';
export const underlineHover = 'box-shadow: inset 0 -4px 0 #f2d8a6;';

export const getStatusColor = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.NEGATIVE:
      return redPlain;
    case StatusEnum.NEUTRAL:
      return bluePlain;
    case StatusEnum.POSITIVE:
      return greenPlain;
    case StatusEnum.WARNING:
      return yellowPlain;
  }
};
