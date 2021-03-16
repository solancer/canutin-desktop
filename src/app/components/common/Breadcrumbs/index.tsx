import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Chevron } from 'app/assets/icons/Chevron.svg';
import { text } from './styles';

const Text = styled.a`${text}`;

export type BreadcrumbType = {
  text: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbType[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <>
    {items.map(({ text, href }, index) => (
      <div key={text}>
        <Text href={href}>{text}</Text>
        {index !== (items.length - 1) && <Chevron />}
      </div>
    ))}
  </>
);

export default Breadcrumbs;
