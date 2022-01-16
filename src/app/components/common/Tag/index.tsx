import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface TagProps {
  title?: string;
  children: ReactNode;
}

const Tag = ({ title, children }: TagProps) => <Container title={title}>{children}</Container>;

export default Tag;
