import { css } from 'styled-components';

import { grey40, grey80 } from '@appConstants/colors';

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
`;

export const breadcrumbLabel = css`
  color: ${grey40};
  font-size: 11px;
  line-height: 11px;
  text-decoration: none;
  outline: none;

  &:focus,
  &:hover {
    color: ${grey80};
  }
`;
