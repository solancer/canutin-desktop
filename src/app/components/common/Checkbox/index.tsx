import React from 'react';
import styled from 'styled-components';

import { container, label, subContainer } from './styles';

const Container = styled.div`${container}`;
const SubContainer = styled.div`${subContainer}`;
const Label = styled.label`${label}`;

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface CheckboxProps {
  label: string;
  name: string;
  register?: () => RefReturn;
}

const Checkbox = ({
  label,
  name,
  register,
}: CheckboxProps) => (
  <Container>
    <SubContainer>
      <input
        name={name}
        ref={register ? register : null}
        id={name}
        type="checkbox"
      />
      <Label htmlFor={name}>{label}</Label>
    </SubContainer>
  </Container>
);

export default Checkbox;
