import React from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

const EmptyBalanceCard = () => <Container>No balances are available in this group.</Container>;

export default EmptyBalanceCard;
