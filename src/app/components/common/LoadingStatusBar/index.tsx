import React from 'react';
import styled from 'styled-components';

import { container, message, percentage } from './styles';

const Container = styled.div`
  ${container}
`;
const Message = styled.div`
  ${message}
`;
const Percentage = styled.div`
  ${percentage}
`;

export interface LoadingStatusBarProps {
  loadingMessage: string;
  loadingPercentage: number;
}

const LoadingStatusBar = ({ loadingMessage, loadingPercentage }: LoadingStatusBarProps) => (
  <Container loadingPercentage={loadingPercentage}>
    {loadingPercentage >= 10 && <Message>{loadingMessage}</Message>}
    <Percentage>{loadingPercentage}%</Percentage>
  </Container>
);

export default LoadingStatusBar;
