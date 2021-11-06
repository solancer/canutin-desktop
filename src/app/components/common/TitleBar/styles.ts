import { css } from 'styled-components';

import {
  whitePlain,
  grey5,
  grey7,
  grey10,
  redPlain,
  grey3,
  borderGrey,
} from '@appConstants/colors';

export const container = css<{ isMacOs: boolean }>`
  background-color: ${whitePlain};
  border-bottom: 1px solid ${grey10};
  grid-area: title-bar;
  display: grid;
  grid-gap: 32px;
  grid-auto-flow: column;
  justify-content: space-between;

  -webkit-app-region: drag;
  -webkit-user-select: none;

  ${({ isMacOs }) =>
    isMacOs &&
    css`
      justify-content: end;

      > svg {
        border-left: 1px solid ${grey10};
        border-right: none;
      }
    `}
`;

export const icon = css`
  align-self: center;
  height: 16px;
  padding: 16px;
  border-right: 1px solid ${grey10};
  cursor: pointer;

  &:hover {
    background-color: ${grey3};
    box-shadow: inset 0 -1px 0 ${borderGrey};
  }
`;

export const windowControls = css`
  display: grid;
  grid-auto-flow: column;
  border-bottom: 1px solid transparent;
  -webkit-app-region: no-drag;
`;

const baseControl = css`
  border: none;
  padding-left: 24px;
  padding-right: 24px;
  height: 100%;
  background-color: transparent;
  outline: none;

  &:hover {
    background-color: ${grey5};
  }

  &:active {
    background-color: ${grey7};
  }
`;

export const minimize = css`
  ${baseControl}
`;

export const maximize = css`
  ${baseControl}
`;

export const close = css`
  ${baseControl}

  &:hover {
    background-color: ${redPlain};

    > svg path {
      stroke: ${whitePlain};
    }
  }
`;
