import { css } from 'styled-components';
import { plainWhite, grey10, redLight, redPlain } from 'app/constants/colors';

export const container = css<{ error: boolean }>`
  align-items: center;
  background-color: ${({ error }) => error ? redLight : plainWhite};
  border-top: 1px solid ${grey10};
  bottom: 0;
  display: flex;
  justify-content: ${({ error }) => error ? 'flex-start' : 'space-between'};
  height: 48px;
  padding-left: ${({ error }) => error ? '0' : '16px'};
  padding-right: 16px;
  position: sticky;
  width: 100vw;
  z-index: 1;
  
  -webkit-user-select: none;
`;

export const error = css`
  color: ${redPlain};
  font-size: 11px;
  margin-left: 16px;
`

export const closeError = css`
  align-items: center;
  background-color: ${plainWhite};
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 48px;
  width: 64px;
`;

export const configurationInfo = css``;
