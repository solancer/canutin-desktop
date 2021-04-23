import React, {ReactNode } from "react";
import styled from 'styled-components';

import { container } from './styles';

export interface FormFooterProp {
  children: ReactNode;
}

const Container = styled.div`${container}`;

const FormFooter = ({ children }: FormFooterProp ) => <Container>{children}</Container>;

export default FormFooter;

