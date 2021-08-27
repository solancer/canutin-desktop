import React from 'react';
import styled from 'styled-components';

import { container } from './styles';

export const Container = styled.hr`
  ${container}
`;

const ButtonDivider = () => <Container />;

export default ButtonDivider;
