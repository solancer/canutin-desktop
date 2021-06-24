import React, { useContext, useEffect } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import styled from 'styled-components';

import LoadingStatusBar from '@components/common/LoadingStatusBar';
import Breadcrumbs from '@components/common/Breadcrumbs';
import Button from '@components/common/Button';

import { StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';
import { routesConfig } from '@routes';

import { container, error, success, currentSettings, currentSettingsLabel } from './styles';

const Container = styled.div`
  ${container}
`;
const Error = styled.p`
  ${error}
`;
const Success = styled.p`
  ${success}
`;
const CurrentSettings = styled.div`
  ${currentSettings}
`;
const CurrentSettingsLabel = styled.div`
  ${currentSettingsLabel}
`;

export const SUCCESS_MESSAGE_TIMEOUT = 5000;

const StatusBar = () => {
  const {
    loadingMessage,
    loadingPercentage,
    errorMessage,
    successMessage,
    setSuccessMessage,
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

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMessage !== '') {
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    }
  }, [successMessage]);

  return (
    <Container error={error} success={success && !loadingPercentage}>
      {content}
      {(error || success) && !loadingPercentage && <Button onClick={onClickButton}>Dismiss</Button>}
      {!(error || success) && !loadingPercentage && isAppInitialized && (
        <CurrentSettings>
          <CurrentSettingsLabel>ENGLISH</CurrentSettingsLabel>
          <CurrentSettingsLabel>USD $</CurrentSettingsLabel>
        </CurrentSettings>
      )}
    </Container>
  );
};

export default StatusBar;
