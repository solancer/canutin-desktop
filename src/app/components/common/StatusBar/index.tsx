import React, { useContext, useEffect } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import styled from 'styled-components';

import Breadcrumbs from '@components/common/Breadcrumbs';
import Button from '@components/common/Button';
import { ReactComponent as Loading } from '@assets/icons/Loading.svg';

import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { routesConfig } from '@routes';

import { container, currentSettings, currentSettingsLabel, statusMessage } from './styles';
import { StatusEnum } from '@app/constants/misc';

const Container = styled.div`
  ${container}
`;
const StatusMessage = styled.div`
  ${statusMessage};
`;
const CurrentSettings = styled.div`
  ${currentSettings}
`;
const CurrentSettingsLabel = styled.div`
  ${currentSettingsLabel}
`;

export const SUCCESS_MESSAGE_TIMEOUT = 5000;

const StatusBar = () => {
  const { statusMessage, setStatusMessage, breadcrumbs } = useContext(StatusBarContext);
  const breadcrumbItems = useBreadcrumbs(routesConfig, { excludePaths: ['/'] });

  const dismissStatusMessage = () => {
    setStatusMessage(emptyStatusMessage);
  };

  // Auto-dismiss success messages
  useEffect(() => {
    if (statusMessage.sentiment === StatusEnum.POSITIVE && statusMessage.message) {
      setTimeout(() => {
        setStatusMessage(emptyStatusMessage);
      }, SUCCESS_MESSAGE_TIMEOUT);
    }
  }, [statusMessage]);

  return (
    <Container sentiment={statusMessage.sentiment}>
      {statusMessage.message && (
        <StatusMessage>
          <p>{statusMessage.message}</p>
          {statusMessage.isLoading ? (
            <Loading />
          ) : (
            <Button onClick={dismissStatusMessage}>Dismiss</Button>
          )}
        </StatusMessage>
      )}
      {!statusMessage.message && (
        <>
          {breadcrumbs || <Breadcrumbs items={breadcrumbItems} />}
          <CurrentSettings>
            <CurrentSettingsLabel>ENGLISH</CurrentSettingsLabel>
            <CurrentSettingsLabel>USD $</CurrentSettingsLabel>
          </CurrentSettings>
        </>
      )}
    </Container>
  );
};

export default StatusBar;
