import { css } from 'styled-components';
import { sansSerifBold } from 'app/constants/fonts';
import { whitePlain, grey10, grey20, grey70, redLight, redPlain } from 'app/constants/colors';

export const container = css<{ error: boolean }>`
  grid-area: status-bar;
  align-items: center;
  background-color: ${({ error }) => error ? redLight : whitePlain};
  box-shadow: inset 0 1px 0 ${grey10};
  display: flex;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  line-height: 1em;

  -webkit-user-select: none;
`;

export const error = css`
  color: ${redPlain};
  font-size: 11px;
  width: 100%;
`

export const closeError = css`
  ${sansSerifBold};
  cursor: pointer;
  padding: 8px 16px;
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

export const configurationInfo = css``;
