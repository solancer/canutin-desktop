import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { BreadcrumbData } from 'use-react-router-breadcrumbs';

import { ReactComponent as Chevron } from '@assets/icons/Chevron.svg';
import { container, breadcrumb, breadcrumbLabel } from './styles';

const Container = styled.div`
  ${container}
`;
const Breadcrumb = styled.div`
  ${breadcrumb}
`;
const BreadcrumbLabel = styled(NavLink)`
  ${breadcrumbLabel}
`;
export interface BreadcrumbsProps {
  items: BreadcrumbData[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <Container>
    {items.map(({ breadcrumb, match }, index) => (
      <Breadcrumb key={`${index}-${breadcrumb}`}>
        <BreadcrumbLabel to={match.url}>{breadcrumb}</BreadcrumbLabel>
        {index !== items.length - 1 && <Chevron />}
      </Breadcrumb>
    ))}
  </Container>
);

export default Breadcrumbs;
