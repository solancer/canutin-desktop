// This component is a duplicate of `<Form>` that uses a `<div>` (as opposed to `<form>` tag) and strips away all of the functionality.
// It's should ONLY be implemented in the `<ImportWizardForm>` component it's meant to be used just for styling.

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface FormProps {
  children: ReactNode;
}

const Form = ({ children }: FormProps) => <Container>{children}</Container>;

export default Form;
