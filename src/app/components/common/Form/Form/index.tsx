import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.form`
  ${container}
`;

export interface FormProps {
  children: ReactNode;
  role?: string;
  onSubmit: () => void;
}

const Form = ({ children, role, onSubmit }: FormProps) => <Container role={role} onSubmit={onSubmit}>{children}</Container>;

export default Form;
