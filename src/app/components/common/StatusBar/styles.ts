import { css } from 'styled-components';
import { monospaceRegular } from '@appConstants/fonts';
import {
  whitePlain,
  grey10,
  bluePlain,
  blueLight,
  redLight,
  redPlain,
  greenPlain,
  greenLight,
  yellowPlain,
  yellowLight,
  grey7,
  grey50,
} from '@appConstants/colors';

import { SUCCESS_MESSAGE_TIMEOUT } from './index';
import { StatusEnum } from '@app/constants/misc';

export const container = css<{ sentiment?: StatusEnum }>`
  position: relative;
  grid-area: status-bar;
  align-items: center;
  color: ${grey50};
  background-color: ${whitePlain};
  border-top: 1px solid ${grey10};
  display: flex;
  justify-content: space-between;
  line-height: 1em;
  padding: 0 16px;
  -webkit-user-select: none;

  ${({ sentiment }) => {
    switch (sentiment) {
      case StatusEnum.NEUTRAL:
        return css`
          color: ${bluePlain};
          background-color: ${blueLight};
        `;
      case StatusEnum.NEGATIVE:
        return css`
          color: ${redPlain};
          background-color: ${redLight};
        `;
      case StatusEnum.WARNING:
        return css`
          color: ${yellowPlain};
          background-color: ${yellowLight};
        `;
      case StatusEnum.POSITIVE:
        return css`
          color: ${greenPlain};
          background-color: ${greenLight};
          position: relative;

          > * {
            z-index: 1;
          }

          &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            right: 0;
            bottom: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            animation: ${SUCCESS_MESSAGE_TIMEOUT}ms ease-out autoDismissProgress;

            @keyframes autoDismissProgress {
              0% {
                width: 0%;
              }
              100% {
                width: 100%;
                background-color: ${whitePlain};
              }
            }
          }
        `;
    }
  }}
`;

export const statusMessage = css`
  width: 100%;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: auto max-content;
  align-items: center;
  font-size: 12px;
`;

export const currentSettings = css`
  display: grid;
  grid-gap: 4px;
  grid-auto-flow: column;
`;

export const currentSettingsLabel = css`
  ${monospaceRegular};
  font-size: 11px;
  letter-spacing: -0.025em;
  color: ${grey50};
  background-color: ${grey7};
  padding: 4px 8px;
  border-radius: 4px;
`;
