import React, { ReactNode } from 'react';
import styled from 'styled-components';

import LoadingStatusBar from '@components/common/LoadingStatusBar';

import { container, closeError, error, success, configurationInfo } from './styles';

const Container = styled.div`
  ${container}
`;
const Button = styled.button`
  ${closeError}
`;
const Error = styled.p`
  ${error}
`;
const Success = styled.p`
  ${success}
`;
const ConfigurationInfo = styled.div`
  ${configurationInfo}
`;

export interface StatusBarProps {
  loadingMessage?: string;
  loadingPercentage?: number;
  errorMessage?: string | ReactNode;
  successMessage?: string | ReactNode;
  onClickButton?: () => void;
  breadcrumbs?: ReactNode;
}

const StatusBar = ({
  loadingMessage,
  loadingPercentage,
  errorMessage,
  successMessage,
  onClickButton,
  breadcrumbs,
}: StatusBarProps) => {
  const error = errorMessage
    ? (typeof errorMessage === 'string' && errorMessage !== '') || errorMessage !== null
    : false;
  const success = successMessage
    ? ((typeof successMessage === 'string' && successMessage !== '') || successMessage !== null)
    : false;

  let content = breadcrumbs;

  if (error) {
    content = <Error>{errorMessage}</Error>;
  }

  if (success) {
    content = <Success>{successMessage}</Success>;
  }

  if(loadingMessage && loadingPercentage) {
    content = <LoadingStatusBar loadingMessage={loadingMessage} loadingPercentage={loadingPercentage} />;
  }

  return (
    <Container error={error} success={success && !loadingPercentage}>
      {content}
      {(error || success) && !loadingPercentage && <Button onClick={onClickButton}>Dismiss</Button>}
      <ConfigurationInfo />
    </Container>
  );
};

export default StatusBar;
