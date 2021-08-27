import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.nav`
  ${container}
`;

interface ButtonRowProps {
  children: ReactNode;
}

const ButtonRow = ({ children }: ButtonRowProps) => <Container>{children}</Container>;

export default ButtonRow;
