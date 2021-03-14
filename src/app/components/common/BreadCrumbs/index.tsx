import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Vector } from 'app/assets/icons/Vector.svg';
import { text } from './styles';

const Text = styled.a`${text}`;

export type BreadCrumbType = {
  text: string;
  href: string;
}

export interface BreadCrumbsProps {
  items: BreadCrumbType[];
}

const BreadCrumbs = ({ items }: BreadCrumbsProps) => (
  <>
    {items.map(({ text, href }, index) => (
      <div key={text}>
        <Text href={href}>{text}</Text>
        {index !== (items.length - 1) && <Vector />}
      </div>
    ))}
  </>
);

export default BreadCrumbs;
