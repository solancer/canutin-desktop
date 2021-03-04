import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Icon } from 'assets/icons/CanutinIcon.svg';
import { container, icon } from './styles';

const Container = styled.div`${container}`;
const CanutinIcon = styled(Icon)`${icon}`;

const TopBar = () => (
  <Container>
    <CanutinIcon />
  </Container>
);

export default TopBar;
