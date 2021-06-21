import { css } from 'styled-components';

import backgroundPattern from '@assets/background-pattern.png';

import { sansSerifBold, sansSerifRegular } from '@appConstants/fonts';
import { bluePlain, grey10, grey3, grey5, grey40 } from '@appConstants/colors';

const componentConstraints = css`
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
`;

export const container = css`
  grid-area: body;
  display: grid;
  grid-template-rows: max-content auto;
  overflow-y: auto;
`;

export const header = css`
  position: relative;
  background-color: ${grey3};
  border-bottom: 1px solid ${grey10};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 152px;
  box-sizing: border-box;
`;

const truncateLongTitle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: default;
`;

export const title = css`
  ${truncateLongTitle};
  ${componentConstraints};
  ${sansSerifBold};
  font-size: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const subTitle = css`
  ${truncateLongTitle};
  ${sansSerifRegular};
  color: ${grey40};
  font-size: 11px;
`;

export const main = css<{ wizard?: boolean }>`
  ${componentConstraints};
  display: grid;
  grid-gap: 64px;
  padding: 64px;
  height: max-content;

  ${({ wizard }) =>
    wizard &&
    css`
      position: relative;
      place-items: center;
      height: 100%;
      background: radial-gradient(50% 50% at 50% 50%, ${grey5} 31.77%, rgba(242, 242, 242, 0) 100%);

      &:before {
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        right: 0;
        bottom: 0;
        background-image: url(${backgroundPattern});
        background-size: 256px;
        background-color: ${grey5};
        animation: 10s linear 0s infinite background-loop;
        z-index: -1;
      }

      @keyframes background-loop {
        from {
          background-position: 0 256px;
        }
        to {
          background-position: 256px 0;
        }
      }
    `}
`;

export const backButton = css`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding: 20px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
    > * {
      stroke: ${bluePlain};
    }
  }
`;

export const headerContainer = css`
  ${componentConstraints};
  padding: 24px 64px;
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 32px;
  align-items: flex-end;
`;
