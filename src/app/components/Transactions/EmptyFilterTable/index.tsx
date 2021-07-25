import React from 'react';
import styled from 'styled-components';

import { container, message } from './styles';

const Container = styled.div`
  ${container}
`;

const Message = styled.span`
  ${message}
`;

const EmptyFilterTable = () => (
  <Container>
    <Message>No transactions were found</Message>
  </Container>
);

export default EmptyFilterTable;
