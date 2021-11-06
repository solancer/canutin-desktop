import { css } from 'styled-components';

import { bluePlain, grey40 } from '@appConstants/colors';

const breadcrumbSpacing = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  align-items: center;
`;

export const container = css`
  ${breadcrumbSpacing};
`;

export const breadcrumb = css`
  ${breadcrumbSpacing};

  &:last-child {
    pointer-events: none;
  }
`;

export const breadcrumbLabel = css`
  color: ${grey40};
  font-size: 11px;
  line-height: 11px;
  text-decoration: none;
  outline: none;

  &:hover {
    color: ${bluePlain};
  }
`;
