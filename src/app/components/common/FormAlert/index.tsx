import React from 'react';
import styled from 'styled-components';

import FieldContainer from '@components/common/Form/FieldContainer';
import Field from '@components/common/Form/Field';

import { container, title, description } from './styles';

const Container = styled.div`${container}`;
const Title = styled.div`${title}`;
const Description = styled.div`${description}`;

interface FormAlertProps {
  title: string;
  description: JSX.Element;
  label?: string;
}

const FormAlert = ({ title, description, label }: FormAlertProps) => {
  return (
    <Field name={title} label={label}>
      <Container>
      <Title>{title}</Title>
        <Description>{description}</Description>
      </Container>
    </Field>
  );
};

export default FormAlert;
