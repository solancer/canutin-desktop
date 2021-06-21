import React, { useContext } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import styled from 'styled-components';

import LoadingStatusBar from '@components/common/LoadingStatusBar';
import Breadcrumbs from '@components/common/Breadcrumbs';

import { StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';
import { routesConfig } from '@routes';

import {
  container,
  closeError,
  error,
  success,
  configurationInfo,
  configurationLabel,
} from './styles';

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
const ConfigurationLabel = styled.div`
  ${configurationLabel}
`;

const StatusBar = () => {
  const {
    loadingMessage,
    loadingPercentage,
    errorMessage,
    successMessage,
    onClickButton,
    breadcrumbs,
  } = useContext(StatusBarContext);
  const { isAppInitialized } = useContext(AppContext);
  const breadcrumbItems = useBreadcrumbs(routesConfig, { excludePaths: ['/'] });

  const error = errorMessage
    ? (typeof errorMessage === 'string' && errorMessage !== '') || errorMessage !== null
    : false;
  const success = successMessage
    ? (typeof successMessage === 'string' && successMessage !== '') || successMessage !== null
    : false;

  let content = breadcrumbs || <Breadcrumbs items={breadcrumbItems} />;

  if (error) {
    content = <Error>{errorMessage}</Error>;
  }

  if (success) {
    content = <Success>{successMessage}</Success>;
  }

  if (loadingMessage && loadingPercentage) {
    content = (
      <LoadingStatusBar loadingMessage={loadingMessage} loadingPercentage={loadingPercentage} />
    );
  }

  return (
    <Container error={error} success={success && !loadingPercentage}>
      {content}
      {(error || success) && !loadingPercentage && <Button onClick={onClickButton}>Dismiss</Button>}
      {!(error || success) && !loadingPercentage && isAppInitialized && (
        <ConfigurationInfo>
          <ConfigurationLabel>ENGLISH</ConfigurationLabel>
          <ConfigurationLabel>USD $</ConfigurationLabel>
        </ConfigurationInfo>
      )}
    </Container>
  );
};

export default StatusBar;
