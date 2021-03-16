import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, closeError, error, configurationInfo } from './styles';

const Container = styled.div`${container}`;
const Button = styled.button`${closeError}`
const Error = styled.p`${error}`;
const ConfigurationInfo = styled.div`${configurationInfo}`;

export interface StatusBarProps {
  errorMessage: string | ReactNode;
  onClickButton: () => void;
  breadcrumbs: ReactNode;
}

const StatusBar = ({ errorMessage, onClickButton, breadcrumbs }: StatusBarProps) => {
  const error = (typeof errorMessage === "string" && errorMessage !== '') || errorMessage !== null;

  return (
    <Container error={error}>
      {error ? <Error>{errorMessage}</Error> : breadcrumbs}
      {error && (
        <Button onClick={onClickButton}>Dismiss</Button>
      )}
      <ConfigurationInfo />
    </Container>
  );
};

export default StatusBar;
