import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, closeError, error, configurationInfo } from './styles';

const Container = styled.div`${container}`;
const CloseError = styled.button`${closeError}`
const Error = styled.p`${error}`;
const ConfigurationInfo = styled.div`${configurationInfo}`;

export interface BottomBarProps {
  errorMessage: string | ReactNode;
  onCloseError: () => void;
  breadCrumbs: ReactNode;
}

const BottomBar = ({ errorMessage, onCloseError, breadCrumbs }: BottomBarProps) => {
  const error = (typeof errorMessage === "string" && errorMessage !== '') || errorMessage !== null;

  return (
    <Container error={error}>
      {error ? <Error>{errorMessage}</Error> : breadCrumbs}
      {error && (
        <CloseError onClick={onCloseError}>Dismiss</CloseError>
      )}
      <ConfigurationInfo />
    </Container>
  );
};

export default BottomBar;
