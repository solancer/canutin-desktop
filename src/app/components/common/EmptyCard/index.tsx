import React from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface EmptyCardProps {
  message: string;
}

const EmptyCard = ({ message }: EmptyCardProps) => <Container>{message}</Container>;

export default EmptyCard;
