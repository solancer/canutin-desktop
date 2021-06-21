import { css } from 'styled-components';
import { sansSerifBold } from '@appConstants/fonts';
import {
  whitePlain,
  grey10,
  grey20,
  grey70,
  redLight,
  redPlain,
  greenPlain,
  greenLight,
  grey7,
  grey50,
} from '@appConstants/colors';

export const container = css<{ error: boolean; success: boolean }>`
  grid-area: status-bar;
  align-items: center;
  background-color: ${({ error, success }) =>
    error ? redLight : success ? greenLight : whitePlain};
  box-shadow: inset 0 1px 0 ${grey10};
  display: flex;
  justify-content: space-between;
  line-height: 1em;

  -webkit-user-select: none;
`;

export const error = css`
  color: ${redPlain};
  font-size: 11px;
  padding: 0 16px;
  width: 100%;
`;

export const success = css`
  color: ${greenPlain};
  font-size: 11px;
  padding: 0 16px;
  width: 100%;
`;

export const closeError = css`
  ${sansSerifBold};
  cursor: pointer;
  padding: 8px 16px;
  margin-right: 16px;
  font-size: 12px;
  border-radius: 3px;
  color: ${grey70};
  border: 1px solid ${grey20};
  background-color: transparent;
  line-height: 1em;
  transition: transform 100ms;

  &:hover {
    border-color: ${grey70};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const configurationInfo = css`
  display: flex;
  margin-right: 16px;
`;

export const configurationLabel = css`
  align-items: center;
  background-color: ${grey7};
  border-radius: 4px;
  color: ${grey50};
  font-size: 11px;
  font-family: 'Decima Mono Pro';
  letter-spacing: -0.025em;
  display: flex;
  margin-left: 4px;
  justify-content: center;
  height: 23px;
  width: 61px;
`;
