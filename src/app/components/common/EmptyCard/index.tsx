import React from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface EmptyCardProps {
  message: string;
  className?: string;
}

const EmptyCard = ({ message, className }: EmptyCardProps) => (
  <Container className={className}>{message}</Container>
);

export default EmptyCard;
