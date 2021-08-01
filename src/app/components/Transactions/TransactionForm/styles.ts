import { css } from 'styled-components';

export const toggableInputContainer = css`
  display: grid;
  grid-template-columns: minmax(96px, 1fr) 2fr;
  grid-gap: 8px;
`;

export const fieldRows = css`
  display: flex;
  justify-content: space-between;

  * {
    display: flex;
    flex: 1;
    max-width: 131px;

    &.select__menu-list {
      display: flex;
      flex-direction: column;
    }
  }

  &:first-child {
    padding-right: 1rem;
  }
`;
