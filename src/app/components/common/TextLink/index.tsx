import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { container } from './styles';

const Container = styled(Link)`
  ${container}
`;

interface TextLinkProps {
  label: string;
  pathname: string;
  state?: any;
}

const TextLink = ({ pathname, state, label }: TextLinkProps) => (
  <Container to={{ pathname, state }}>{label}</Container>
);

export default TextLink;
