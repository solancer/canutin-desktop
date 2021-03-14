import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'app/assets/icons/Close.svg';
import { container, closeError, error, configurationInfo } from './styles';

const Container = styled.div`${container}`;
const CloseError = styled.div`${closeError}`
const Error = styled.span`${error}`;
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
      {error && (
        <CloseError onClick={onCloseError}>
          <CloseIcon />
        </CloseError>
      )}
      {error ? <Error>{errorMessage}</Error> : breadCrumbs}
      <ConfigurationInfo />
    </Container>
  );
};

export default BottomBar;
