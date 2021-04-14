import React from 'react';
import styled from 'styled-components';

import { formAlertContainer, container, title, description } from './styles';

const FormAlertContainer = styled.div`${formAlertContainer}`;
const Container = styled.div`${container}`;
const Title = styled.div`${title}`;
const Description = styled.div`${description}`;

interface FormAlertProps {
  title: string;
  description: JSX.Element;
}

const FormAlert = ({ title, description }: FormAlertProps) => {
  return (
    <FormAlertContainer>
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Container>
    </FormAlertContainer>
  );
};

export default FormAlert;
