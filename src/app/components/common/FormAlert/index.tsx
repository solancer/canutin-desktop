import React from 'react';
import styled from 'styled-components';

import FieldContainer from '@components/common/Form/FieldContainer';

import { container, title, description } from './styles';

const Container = styled.div`${container}`;
const Title = styled.div`${title}`;
const Description = styled.div`${description}`;

interface FormAlertProps {
  title: string;
  description: JSX.Element;
}

const FormAlert = ({ title, description }: FormAlertProps) => {
  return (
    <FieldContainer>
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Container>
    </FieldContainer>
  );
};

export default FormAlert;
