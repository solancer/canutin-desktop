import { css } from 'styled-components';
import { monospaceRegular } from '@appConstants/fonts';
import {
  whitePlain,
  grey10,
  redLight,
  redPlain,
  greenPlain,
  greenLight,
  grey7,
  grey50,
} from '@appConstants/colors';

import { SUCCESS_MESSAGE_TIMEOUT } from './index';

export const container = css<{ error: boolean; success: boolean }>`
  position: relative;
  grid-area: status-bar;
  align-items: center;
  background-color: ${({ error, success }) =>
    error ? redLight : success ? greenLight : whitePlain};
  border-top: 1px solid ${grey10};
  display: flex;
  justify-content: space-between;
  line-height: 1em;
  padding: 0 16px;
  -webkit-user-select: none;

  ${({ success }) =>
    success &&
    css`
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
    `}
  }
`;

export const error = css`
  color: ${redPlain};
  font-size: 11px;
`;

export const success = css`
  color: ${greenPlain};
  font-size: 11px;
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
